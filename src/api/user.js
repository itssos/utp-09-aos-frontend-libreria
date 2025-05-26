import { api } from './apiHelper';

export const assignRoleToUser = (userId, newRole) => api.put(`/api/users/${userId}/role`, { roleType: newRole });

export const getUsers = ()                        => api.get('/api/users/short');
