'use client';

import React, { useState } from 'react';
import { Search, Plus } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { UserTable } from './userTable';
import { AddUserModal } from './addUserModal';
import { useUsers } from '@/app/contexts/UserProvider';

export default function UserManagerPage() {
  const {
    filteredUsers,
    searchQuery,
    roleFilter,
    statusFilter,
    setSearchQuery,
    setRoleFilter,
    setStatusFilter,
    addUser,
    editUser,
    viewUser,
    resetPassword,
    deleteUser,
  } = useUsers();

  const [isAddModalOpen, setIsAddModalOpen] = useState(false);

  const handleAddNewUser = () => setIsAddModalOpen(true);
  const handleCloseModal = () => setIsAddModalOpen(false);

  return (
    <div className="flex-1 bg-gray-50 h-full flex flex-col">
      <div className="flex-1 p-6">
        {/* Header */}
        <div className="flex justify-between items-start mb-8">
          <div>
            <h1 className="text-2xl text-gray-900 mb-2">User Management</h1>
            <p className="text-gray-600">
              Manage enthusiast and administrative staff
            </p>
          </div>
          <Button
            onClick={handleAddNewUser}
            className="cursor-pointer bg-[rgb(0,76,157)] text-white hover:bg-blue-900 focus-visible:ring-2 focus-visible:ring-blue-700"                 
          >
            <Plus className="h-4 w-4 text-white mr-2" />
            Add New User
          </Button>
        </div>

        {/* User Directory Section - Full Height */}
        <div className="bg-white rounded-lg border border-gray-200 p-6 flex-1 flex flex-col">
          <div className="mb-6">
            <h2 className="text-lg text-gray-900 mb-2">User Directory</h2>
            <p className="text-gray-600">
              Search and filter system users ({filteredUsers.length} users)
            </p>
          </div>

          {/* Search and Filters */}
          <div className="flex flex-wrap gap-4 mb-6">
            <div className="flex-1 min-w-80">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                <Input
                  type="text"
                  placeholder="Search by name or email..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-10 bg-gray-50 border-gray-200"
                />
              </div>
            </div>

            <Select value={roleFilter} onValueChange={setRoleFilter as any}>
              <SelectTrigger className="w-40 bg-gray-50 border-gray-200">
                <SelectValue placeholder="All Roles" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Roles</SelectItem>
                <SelectItem value="enthusiast">Enthusiast</SelectItem>
                <SelectItem value="admin">Admin</SelectItem>
              </SelectContent>
            </Select>

            <Select value={statusFilter} onValueChange={setStatusFilter as any}>
              <SelectTrigger className="w-40 bg-gray-50 border-gray-200">
                <SelectValue placeholder="All Status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Status</SelectItem>
                <SelectItem value="active">Active</SelectItem>
                <SelectItem value="inactive">Inactive</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {/* User Table */}
          <div className="flex-1">
            <UserTable/>
          </div>
        </div>
      </div>

      {/* Add User Modal */}
      <AddUserModal
        isOpen={isAddModalOpen}
        onClose={handleCloseModal}
        onAddUser={async (u) => {
          await addUser(u);  
          handleCloseModal();
  }}

      />
    </div>
  );
}
