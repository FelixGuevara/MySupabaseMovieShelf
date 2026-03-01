'use client';

import React from 'react';
import { Pencil, Trash2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { UserEditDialog, EditableUser } from './editUserModal';
import { toast } from 'sonner';

import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';

import type { Profile } from '@/app/types/profile';
// Ensure this path matches your project (contexts vs context)
import { useUsers } from '@/app/contexts/UserProvider';

export function UserTable() {
  const {
    filteredUsers: users,
    viewUser,            // still available if you later add a view button
    resetPassword,       // still available if you later add a reset button
    deleteUser,
    editUser,
  } = useUsers();

  const [editOpen, setEditOpen] = React.useState(false);
  const [editing, setEditing] = React.useState<Profile | null>(null);

  const [isDeleteOpen, setIsDeleteOpen] = React.useState(false);
  const [deletingUser, setDeletingUser] = React.useState<Profile | null>(null);

  const handleEdit = (user: Profile) => {
    setEditing(user);
    setEditOpen(true);
  };

  const askDelete = (user: Profile) => {
    setDeletingUser(user);
    setIsDeleteOpen(true);
  };

  const confirmDelete = () => {
    if (!deletingUser) return;
    deleteUser(deletingUser.id);
    toast.success(`${deletingUser.name} has been deleted successfully.`);
    setIsDeleteOpen(false);
    setDeletingUser(null);
  };

  const onSaveEdit = async (u: EditableUser) => {
  try {
    if (!editing) return;
    const patch: Partial<Profile> = {
      name: u.name ?? editing.name,
      email: u.email ?? editing.email,
      role: (u.role ?? editing.role) as Profile["role"],
      status: (u.status ?? editing.status) as Profile["status"],
    };

    const result = await editUser(editing.id, patch); 

    if (!result) {
      toast.error("Failed to save changes.");
      return;
    }

    toast.success("User updated.");
    setEditOpen(false);
  } catch (e) {
    console.error(e);
    toast.error("Failed to save changes.");
  }
};

  return (
    <div className="bg-white rounded-lg border border-gray-200">
      <div className="overflow-x-auto">
        <table className="w-full">
          <thead className="bg-gray-50 border-b border-gray-200">
            <tr>
              <th className="text-left py-3 px-4 text-xs uppercase text-gray-500 tracking-wider">Name</th>
              <th className="text-left py-3 px-4 text-xs uppercase text-gray-500 tracking-wider">Email</th>
              <th className="text-left py-3 px-4 text-xs uppercase text-gray-500 tracking-wider">Role</th>
              <th className="text-left py-3 px-4 text-xs uppercase text-gray-500 tracking-wider">Created Date</th>
              <th className="text-left py-3 px-4 text-xs uppercase text-gray-500 tracking-wider">Status</th>
              <th className="text-left py-3 px-4 text-xs uppercase text-gray-500 tracking-wider">Last Login</th>
              <th className="text-left py-3 px-4 text-xs uppercase text-gray-500 tracking-wider">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-200">
            {users.map((user) => (
              <tr key={user.id} className="hover:bg-gray-50">
                <td className="py-4 px-4">
                  <div className="text-gray-900">{user.name}</div>
                </td>
                <td className="py-4 px-4">
                  <div className="text-gray-600">{user.email}</div>
                </td>
                <td className="py-4 px-4">
                  <div className="text-gray-900">{user.role}</div>
                </td>
                <td className="py-4 px-4">
                  <div className="text-gray-900">{user.created_at ? new Date(user.created_at).toLocaleDateString("en-US") : "—"}</div>
                </td>
                <td className="py-4 px-4">
                  <Badge
                    variant={user.status === 'Active' ? 'default' : 'secondary'}
                    className={user.status === 'Active' ? 'bg-gray-900 text-white' : 'bg-gray-200 text-gray-700'}
                  >
                    {user.status}
                  </Badge>
                </td>
                <td className="py-4 px-4">
                  <div className="text-gray-900">{user.last_login ? new Date(user.last_login).toLocaleDateString("en-US") : "—"}</div>
                </td>
                <td className="py-4 px-4">
                  <div className="flex items-center gap-2">
                    {/* Edit (pencil) */}
                    <Button
                      type="button"
                      variant="outline"
                      className="cursor-pointer bg-[rgb(0,76,157)] text-white hover:bg-blue-900 focus-visible:ring-2 focus-visible:ring-blue-700"
                      onClick={() => handleEdit(user)}
                      aria-label={`Edit ${user.name}`}
                      title="Edit">
                      <Pencil className="h-4 w-4 text-white"  />
                    </Button>

                    {/* Delete (trash) */}
                    <Button
                      type="button"
                      variant="outline"
                      className="cursor-pointer bg-[rgb(0,76,157)] text-white hover:bg-blue-900 focus-visible:ring-2 focus-visible:ring-blue-700"
                      onClick={() => askDelete(user)}
                      aria-label={`Delete ${user.name}`}
                      title="Delete">
                      <Trash2 className="h-4 w-4 text-white" />
                    </Button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <UserEditDialog
        open={editOpen}
        onOpenChange={setEditOpen}
        user={
          editing
            ? {
                id: editing.id,
                name: editing.name,
                email: editing.email,
                role: editing.role,
                status: editing.status,
              }
            : null
        }
        onSave={onSaveEdit}
      />

     <Dialog open={isDeleteOpen} onOpenChange={setIsDeleteOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>
              {`Delete “${deletingUser?.name ?? 'this user'}”?`}
            </DialogTitle>
          </DialogHeader>
          <p className="text-sm text-gray-600">
            This action cannot be undone. This will permanently remove the user from your system.
          </p>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsDeleteOpen(false)} type="button">
              Cancel
            </Button>
            <Button
              className="cursor-pointer bg-red-600 text-white hover:bg-red-700"
              onClick={confirmDelete}
              type="button"
            >
              Delete
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>

  );
}