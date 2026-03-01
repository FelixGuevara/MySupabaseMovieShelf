// app/contexts/UserProvider.tsx
"use client";

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
  ReactNode,
} from "react";
import { createClient } from "@/lib/supabase/client";
import type { Profile, NewProfile } from "@/app/types/profile";

type RoleFilter = "all" | "enthusiast" | "admin";
type StatusFilter = "all" | "active" | "inactive";

type UsersContextShape = {
  users: Profile[];
  filteredUsers: Profile[];
  loading: boolean;
  error: string | null;

  searchQuery: string;
  setSearchQuery: (v: string) => void;

  roleFilter: RoleFilter;
  setRoleFilter: (v: RoleFilter) => void;

  statusFilter: StatusFilter;
  setStatusFilter: (v: StatusFilter) => void;

  refresh: () => Promise<void>;

  addUser: (u: NewProfile) => Promise<Profile | null>;
  editUser: (id: string, patch: Partial<Omit<Profile, "id">>) => Promise<Profile | null>;
  deleteUser: (id: string) => Promise<boolean>;
  viewUser: (id: string) => Profile | undefined;
  resetPassword: (id: string) => Promise<void>; // placeholder unless you wire to auth
};

const UsersContext = createContext<UsersContextShape | undefined>(undefined);

type ProviderProps = {
  children: ReactNode;
  /** Optional server-hydrated data */
  initialUsers?: Profile[];
  /** Enable realtime sync (on by default) */
  realtime?: boolean;
};

export function UserProvider({ children, initialUsers, realtime = true }: ProviderProps) {
  const [users, setUsers] = useState<Profile[]>(initialUsers ?? []);
  const [loading, setLoading] = useState<boolean>(!initialUsers);
  const [error, setError] = useState<string | null>(null);

  const [searchQuery, setSearchQuery] = useState("");
  const [roleFilter, setRoleFilter] = useState<RoleFilter>("all");
  const [statusFilter, setStatusFilter] = useState<StatusFilter>("all");
  const supabase = createClient();

  const fetchUsers = useCallback(async () => {
    setLoading(true);
    setError(null);
    const { data, error } = await supabase
      .from("profiles")
      .select("id, name, email, role, status, avatar_url, last_login, created_at")
      .order("created_at", { ascending: false });

    if (error) {
      setError(error.message);
      setUsers([]);
    } else {
      setUsers((data ?? []) as Profile[]);
    }
    setLoading(false);
  }, []);

  // Initial load if no server data provided
  useEffect(() => {
    if (!initialUsers) fetchUsers();
  }, [initialUsers, fetchUsers]);

  // Optional: realtime sync for inserts/updates/deletes
  useEffect(() => {
    if (!realtime) return;

    const channel = supabase
      .channel("profiles-changes")
      .on(
        "postgres_changes",
        { event: "*", schema: "public", table: "profiles" },
        (payload) => {
          if (payload.eventType === "INSERT") {
            const newRow = payload.new as Profile;
            setUsers((prev) => (prev.some((u) => u.id === newRow.id) ? prev : [newRow, ...prev]));
          } else if (payload.eventType === "UPDATE") {
            const updated = payload.new as Profile;
            setUsers((prev) => prev.map((u) => (u.id === updated.id ? updated : u)));
          } else if (payload.eventType === "DELETE") {
            const removed = payload.old as Profile;
            setUsers((prev) => prev.filter((u) => u.id !== removed.id));
          }
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [realtime]);

  const filteredUsers = useMemo(() => {
    const q = searchQuery.trim().toLowerCase();
    return users.filter((u) => {
      const roleOk = roleFilter === "all" || (u.role ?? "").toLowerCase() === roleFilter;
      const statusOk = statusFilter === "all" || (u.status ?? "").toLowerCase() === statusFilter;
      const textOk =
        !q ||
        (u.name ?? "").toLowerCase().includes(q) ||
        (u.email ?? "").toLowerCase().includes(q);
      return roleOk && statusOk && textOk;
    });
  }, [users, searchQuery, roleFilter, statusFilter]);

  const addUser = useCallback(async (u: NewProfile) => {
    const payload = {
      name: u.name,
      email: u.email,
      role: u.role,
      status: u.status,
      avatar_url: u.avatar_url ?? null,
    };
    const { data, error } = await supabase
      .from("profiles")
      .insert([payload])
      .select()
      .single();

    if (error) {
      console.error("addUser error:", error);
      setError(error.message);
      return null;
    }
    const inserted = data as Profile;
    setUsers((prev) => [inserted, ...prev]);
    return inserted;
  }, []);

  const editUser = useCallback(
    async (id: string, patch: Partial<Omit<Profile, "id">>) => {
      const { data, error } = await supabase
        .from("profiles")
        .update(patch)
        .eq("id", id)
        .select()
        .single();

      if (error) {
        console.error("editUser error:", error);
        setError(error.message);
        return null;
      }
      const updated = data as Profile;
      setUsers((prev) => prev.map((u) => (u.id === id ? updated : u)));
      return updated;
    },
    []
  );

  const deleteUser = useCallback(async (id: string) => {
    const { error } = await supabase.from("profiles").delete().eq("id", id);
    if (error) {
      console.error("deleteUser error:", error);
      setError(error.message);
      return false;
    }
    setUsers((prev) => prev.filter((u) => u.id !== id));
    return true;
  }, []);

  // Stubbed: you’re not using Supabase Auth here
  const resetPassword = useCallback(async (_id: string) => {
    // If you move to Supabase Auth later, wire admin reset or magic link here.
    return;
  }, []);

  const viewUser = useCallback(
    (id: string) => users.find((u) => u.id === id),
    [users]
  );

  const value: UsersContextShape = {
    users,
    filteredUsers,
    loading,
    error,

    searchQuery,
    setSearchQuery,

    roleFilter,
    setRoleFilter,

    statusFilter,
    setStatusFilter,

    refresh: fetchUsers,

    addUser,
    editUser,
    deleteUser,
    viewUser,
    resetPassword,
  };

  return <UsersContext.Provider value={value}>{children}</UsersContext.Provider>;
}

export function useUsers() {
  const ctx = useContext(UsersContext);
  if (!ctx) throw new Error("useUsers must be used within a UserProvider");
  return ctx;
}