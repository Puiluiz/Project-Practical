import { UserRole } from '@prisma/client';

export class UpdateUserDto {
    username?: string;
    email?: string;
    balance?: number;
    role?: UserRole;  // กำหนดให้ role เป็น enum
  }