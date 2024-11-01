import { UserRole } from '@prisma/client';

export class UpdateUserDto {
    username?: string;
    email?: string;
    balance?: number;
    password: string;
    role?: UserRole;  // กำหนดให้ role เป็น enum
  }