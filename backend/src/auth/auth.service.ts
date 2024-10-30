import { Injectable, HttpException, HttpStatus, UnauthorizedException, BadRequestException } from '@nestjs/common';
import { PrismaService } from '../utills/prisma/prisma.service';
import * as bcrypt from 'bcrypt';
import { JwtService } from '@nestjs/jwt';
import { RegisterDto } from './dto/register.dto';

@Injectable()
export class AuthService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly jwtService: JwtService, 
  ) {}

  async register(registerDto: RegisterDto) {
    const { email, username, password, confirmPassword } = registerDto;

    // ตรวจสอบว่ารหัสผ่านตรงกันหรือไม่
    console.log(registerDto); // ตรวจสอบค่าที่ได้รับ
    if (password !== confirmPassword) {
      throw new BadRequestException('Passwords do not match');
    }

    // ตรวจสอบว่า email หรือ username มีอยู่แล้วหรือไม่
    const existingUser = await this.prisma.user.findFirst({
      where: {
        OR: [{ email }, { username }],
      },
    });

    if (existingUser) {
      throw new BadRequestException('Email or username already exists');
    }

    // บันทึกผู้ใช้ลงในฐานข้อมูล
    const newUser = await this.prisma.user.create({
      data: {
        email,
        username,
        password, // เก็บรหัสผ่านในรูปแบบ plain text
        balance: 0,
        role: 'USER', // ใช้ Enum 'USER' ในการตั้งค่า role
        createdAt: new Date()
      },
    });

    return newUser;
  }
  
  async login(loginDto: { username: string, password: string }) {
    const { username, password } = loginDto;

    // ค้นหาผู้ใช้จาก username
    const user = await this.prisma.user.findFirst({ where: { username } });

    if (!user) {
      throw new UnauthorizedException('User not found');
    }

    // ตรวจสอบความถูกต้องของรหัสผ่าน (โดยไม่ใช้ bcrypt)
    if (user.password !== password) {
      throw new UnauthorizedException('Invalid password');
    }

    // สร้าง JWT token
    const token = this.jwtService.sign({ userId: user.id });

    // ส่งกลับ username, balance, และ token หลังจากการ login
    return {
      message: 'Login successful',
      token,  // ส่ง token กลับไปที่ frontend
      user: {
        id: user.id,
        username: user.username,
        balance: user.balance,  // ส่ง balance กลับไปด้วย
        role: user.role,        // ส่ง role กลับไปด้วย
      },
    };
  }
  
  

  // ฟังก์ชันออกจากระบบ
  async logout() {
    return { message: 'Logout successful' };
  }
}
