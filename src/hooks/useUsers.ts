import { useState, useEffect, useCallback, useMemo } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { User, UserRole, UserStatus } from '../types';
import { useDebounce } from './useDebounce';
import {
  queryUsersServer,
  updateUserServer,
  bulkUpdateUsersServer,
  bulkDeleteUsersServer,
  deleteUserServer,
  inviteUserServer,
} from '../lib/mockData';

export interface UserFilters {
  search: string;
  role: string;
  status: string;
  page: number;
  pageSize: number;
  sort: string;
  preset: string;
}

function parseUrlFilters(): UserFilters {
  const params = new URLSearchParams(window.location.search);
  return {
    search: params.get('search') ?? '',
    role: params.get('role') ?? 'all',
    status: params.get('status') ?? 'all',
    page: Number(params.get('page') ?? 1),
    pageSize: Number(params.get('pageSize') ?? 25),
    sort: params.get('sort') ?? 'name:asc',
    preset: params.get('preset') ?? '',
  };
}

export function useUsers() {
  const queryClient = useQueryClient();
  const [filters, setFiltersInternal] = useState<UserFilters>(parseUrlFilters);
  const [lastActionStatus, setLastActionStatus] = useState<{
    type: 'success' | 'error' | 'info';
    message: string;
  } | null>(null);

  // Sync state when browser back/forward buttons are pressed
  useEffect(() => {
    const handlePopState = () => {
      setFiltersInternal(parseUrlFilters());
    };
    window.addEventListener('popstate', handlePopState);
    return () => window.removeEventListener('popstate', handlePopState);
  }, []);

  const debouncedSearch = useDebounce(filters.search, 300);

  // Write filters back to URL search params
  const setFilters = useCallback((patch: Partial<UserFilters>) => {
    setFiltersInternal((prev) => {
      const next = { ...prev, ...patch };

      // Reset to page 1 whenever any filter other than page changes
      if (!('page' in patch) && (
        patch.search !== undefined ||
        patch.role !== undefined ||
        patch.status !== undefined ||
        patch.pageSize !== undefined ||
        patch.preset !== undefined
      )) {
        next.page = 1;
      }

      // If a preset is clicked, it can clear or sync role/status
      if (patch.preset) {
        if (patch.preset === 'admins') next.role = 'admin';
        if (patch.preset === 'invited') next.status = 'invited';
        if (patch.preset === 'active_members') next.status = 'active';
      }

      const params = new URLSearchParams();
      if (next.search) params.set('search', next.search);
      if (next.role && next.role !== 'all') params.set('role', next.role);
      if (next.status && next.status !== 'all') params.set('status', next.status);
      if (next.page > 1) params.set('page', String(next.page));
      if (next.pageSize !== 25) params.set('pageSize', String(next.pageSize));
      if (next.sort && next.sort !== 'name:asc') params.set('sort', next.sort);
      if (next.preset) params.set('preset', next.preset);

      const newQuery = params.toString();
      const newUrl = `${window.location.pathname}${newQuery ? `?${newQuery}` : ''}`;
      window.history.replaceState({}, '', newUrl);

      return next;
    });
  }, []);

  // Construct active query key for caching
  const queryKey = useMemo(
    () => ['users', { ...filters, search: debouncedSearch }],
    [filters, debouncedSearch]
  );

  const { data, isLoading, isFetching, error, refetch } = useQuery({
    queryKey,
    queryFn: () =>
      queryUsersServer({
        search: debouncedSearch,
        role: filters.role,
        status: filters.status,
        page: filters.page,
        pageSize: filters.pageSize,
        sort: filters.sort,
        preset: filters.preset,
      }),
    placeholderData: (previousData) => previousData,
    staleTime: 30_000,
  });

  // OPTIMISTIC UPDATE: Update user role
  const updateRoleMutation = useMutation({
    mutationFn: async ({ userId, newRole }: { userId: string; newRole: UserRole }) => {
      return updateUserServer(userId, { role: newRole });
    },
    onMutate: async ({ userId, newRole }) => {
      await queryClient.cancelQueries({ queryKey: ['users'] });
      const previousData = queryClient.getQueryData(queryKey);

      // Optimistically update current view
      queryClient.setQueryData(queryKey, (old: any) => {
        if (!old) return old;
        return {
          ...old,
          users: old.users.map((u: User) =>
            u.id === userId ? { ...u, role: newRole } : u
          ),
        };
      });

      setLastActionStatus({
        type: 'info',
        message: `Optimistically changed role to ${newRole}...`,
      });

      return { previousData };
    },
    onError: (err, _variables, context) => {
      if (context?.previousData) {
        queryClient.setQueryData(queryKey, context.previousData);
      }
      setLastActionStatus({
        type: 'error',
        message: `Role update failed: ${(err as Error).message}. Rolled back changes.`,
      });
    },
    onSuccess: (updatedUser) => {
      setLastActionStatus({
        type: 'success',
        message: `Successfully updated ${updatedUser.name}'s role to ${updatedUser.role}.`,
      });
      queryClient.invalidateQueries({ queryKey: ['users'] });
    },
  });

  // OPTIMISTIC UPDATE: Update user status
  const updateStatusMutation = useMutation({
    mutationFn: async ({ userId, newStatus }: { userId: string; newStatus: UserStatus }) => {
      return updateUserServer(userId, { status: newStatus });
    },
    onMutate: async ({ userId, newStatus }) => {
      await queryClient.cancelQueries({ queryKey: ['users'] });
      const previousData = queryClient.getQueryData(queryKey);

      queryClient.setQueryData(queryKey, (old: any) => {
        if (!old) return old;
        return {
          ...old,
          users: old.users.map((u: User) =>
            u.id === userId ? { ...u, status: newStatus } : u
          ),
        };
      });

      return { previousData };
    },
    onError: (err, _variables, context) => {
      if (context?.previousData) {
        queryClient.setQueryData(queryKey, context.previousData);
      }
      setLastActionStatus({
        type: 'error',
        message: `Status update failed: ${(err as Error).message}. Rolled back changes.`,
      });
    },
    onSuccess: (updatedUser) => {
      setLastActionStatus({
        type: 'success',
        message: `Updated ${updatedUser.name}'s status to ${updatedUser.status}.`,
      });
      queryClient.invalidateQueries({ queryKey: ['users'] });
    },
  });

  // Delete User Mutation
  const deleteUserMutation = useMutation({
    mutationFn: async (userId: string) => {
      return deleteUserServer(userId);
    },
    onSuccess: () => {
      setLastActionStatus({
        type: 'success',
        message: 'User removed successfully.',
      });
      queryClient.invalidateQueries({ queryKey: ['users'] });
    },
    onError: (err) => {
      setLastActionStatus({
        type: 'error',
        message: `Failed to delete user: ${(err as Error).message}`,
      });
    },
  });

  // Bulk Suspend / Activate Mutation
  const bulkUpdateStatusMutation = useMutation({
    mutationFn: async ({ ids, status }: { ids: string[]; status: UserStatus }) => {
      return bulkUpdateUsersServer(ids, { status });
    },
    onSuccess: (_res, vars) => {
      setLastActionStatus({
        type: 'success',
        message: `Successfully updated ${vars.ids.length} users to status "${vars.status}".`,
      });
      queryClient.invalidateQueries({ queryKey: ['users'] });
    },
    onError: (err) => {
      setLastActionStatus({
        type: 'error',
        message: `Bulk update failed: ${(err as Error).message}`,
      });
    },
  });

  // Bulk Role Change Mutation
  const bulkUpdateRoleMutation = useMutation({
    mutationFn: async ({ ids, role }: { ids: string[]; role: UserRole }) => {
      return bulkUpdateUsersServer(ids, { role });
    },
    onSuccess: (_res, vars) => {
      setLastActionStatus({
        type: 'success',
        message: `Successfully changed role for ${vars.ids.length} users to "${vars.role}".`,
      });
      queryClient.invalidateQueries({ queryKey: ['users'] });
    },
    onError: (err) => {
      setLastActionStatus({
        type: 'error',
        message: `Bulk role update failed: ${(err as Error).message}`,
      });
    },
  });

  // Bulk Delete Mutation
  const bulkDeleteMutation = useMutation({
    mutationFn: async (ids: string[]) => {
      return bulkDeleteUsersServer(ids);
    },
    onSuccess: (_res, ids) => {
      setLastActionStatus({
        type: 'success',
        message: `Deleted ${ids.length} users.`,
      });
      queryClient.invalidateQueries({ queryKey: ['users'] });
    },
    onError: (err) => {
      setLastActionStatus({
        type: 'error',
        message: `Bulk delete failed: ${(err as Error).message}`,
      });
    },
  });

  // Invite User Mutation
  const inviteUserMutation = useMutation({
    mutationFn: async (payload: { name: string; email: string; role: UserRole; department: string }) => {
      return inviteUserServer(payload);
    },
    onSuccess: (newUser) => {
      setLastActionStatus({
        type: 'success',
        message: `Invitation email sent to ${newUser.email} (${newUser.role})!`,
      });
      queryClient.invalidateQueries({ queryKey: ['users'] });
    },
    onError: (err) => {
      setLastActionStatus({
        type: 'error',
        message: `Failed to invite user: ${(err as Error).message}`,
      });
    },
  });

  return {
    filters,
    setFilters,
    data,
    isLoading,
    isFetching,
    error,
    refetch,
    lastActionStatus,
    clearLastActionStatus: () => setLastActionStatus(null),
    updateRole: updateRoleMutation.mutate,
    isUpdatingRole: updateRoleMutation.isPending,
    updateStatus: updateStatusMutation.mutate,
    deleteUser: deleteUserMutation.mutate,
    isDeletingUser: deleteUserMutation.isPending,
    bulkUpdateStatus: bulkUpdateStatusMutation.mutate,
    bulkUpdateRole: bulkUpdateRoleMutation.mutate,
    bulkDelete: bulkDeleteMutation.mutate,
    isBulkOperating:
      bulkUpdateStatusMutation.isPending ||
      bulkUpdateRoleMutation.isPending ||
      bulkDeleteMutation.isPending,
    inviteUser: inviteUserMutation.mutateAsync,
    isInviting: inviteUserMutation.isPending,
  };
}
