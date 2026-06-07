import { SetMetadata } from '@nestjs/common';

export const ROLES_KEY = 'roles';

/**
 * Đánh dấu các role được phép truy cập route.
 * Dùng kèm với JwtAuthGuard + RolesGuard.
 * Ví dụ: @Roles('ADMIN')
 */
export const Roles = (...roles: string[]) => SetMetadata(ROLES_KEY, roles);
