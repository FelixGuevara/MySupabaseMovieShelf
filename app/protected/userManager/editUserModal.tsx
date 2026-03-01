// components/users/editUserModal.tsx
"use client";

import * as React from "react";
import { toast } from "sonner";
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import type { ProfileRole, ProfileStatus } from '@/app/types/profile';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

type Status = "Active" | "Inactive";

export interface EditableUser {
  id: string;
  name: string;
  email: string;
  role: "Admin" | "Enthusiast" | string;
  status: "Active" | "Inactive" | string;
}

interface UserEditDialogProps {
  open: boolean;
  onOpenChange: (v: boolean) => void;
  user: EditableUser | null;
  onSave: (u: EditableUser) => Promise<void> | void; // supports sync/async
}

export function UserEditDialog({ open, onOpenChange, user, onSave }: UserEditDialogProps) {
  const [form, setForm] = React.useState<EditableUser | null>(user);
  const [saving, setSaving] = React.useState(false);

  React.useEffect(() => {
    setForm(user);
  }, [user]);

  const onChange =
    (key: keyof EditableUser) =>
    (e: React.ChangeEvent<HTMLInputElement>) => {
      if (!form) return;
      setForm({ ...form, [key]: e.target.value });
    };

  const onStatusChange = (value: string) => {
    if (!form) return;
    setForm({ ...form, status: value as Status });
  };

  const submit = async () => {
    if (!form) return;

    // Minimal validation, same spirit as MovieDetails
    if (!form.name.trim()) {
      toast.error("Name is required.");
      return;
    }
    if (!/^\S+@\S+\.\S+$/.test(form.email.trim())) {
      toast.error("Please enter a valid email address.");
      return;
    }
    if (!form.role.trim()) {
      toast.error("Role is required.");
      return;
    }

    setSaving(true);
    try {
      await Promise.resolve(onSave(form));
      toast.success(`Saved changes to “${form.name}”.`);
      onOpenChange(false);
    } catch (err) {
      console.error("Edit failed:", err);
      toast.error("Failed to save changes.");
    } finally {
      setSaving(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Edit {user ? `“${user.name}”` : "User"}</DialogTitle>
        </DialogHeader>

        <div className="grid gap-4 py-2">
          <div className="grid gap-2">
            <Label htmlFor="name">Name</Label>
            <Input
              id="name"
              value={form?.name ?? ""}
              onChange={onChange("name")}
              placeholder="Full name"
            />
          </div>

          <div className="grid gap-2">
            <Label htmlFor="email">Email</Label>
            <Input
              id="email"
              type="email"
              value={form?.email ?? ""}
              onChange={onChange("email")}
              placeholder="name@company.com"
            />
          </div>

          <div className="grid gap-2 sm:grid-cols-2">
            <div className="grid gap-2">
              <Label htmlFor="role">Role</Label>
              <Input
                id="role"
                value={form?.role ?? ""}
                onChange={onChange("role")}
                placeholder="e.g., Admin, Editor, Viewer"
              />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="status">Status</Label>
              <Select value={form?.status ?? "Active"} onValueChange={onStatusChange}>
                <SelectTrigger id="status">
                  <SelectValue placeholder="Select status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Active">Active</SelectItem>
                  <SelectItem value="Inactive">Inactive</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        </div>

        <DialogFooter>
          <Button variant="outline" onClick={() => onOpenChange(false)} disabled={saving} type="button">
            Cancel
          </Button>
          <Button className="cursor-pointer" onClick={submit} disabled={saving} type="button">
            {saving ? "Saving..." : "Save changes"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}