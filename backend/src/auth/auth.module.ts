import { Module } from '@nestjs/common';
import { AuthService } from './auth.service';
import { AuthController } from './auth.controller';
import { PrismaService } from '../utills/prisma/prisma.service';
import { HttpModule } from '@nestjs/axios'; // Import HttpModule สำหรับใช้งาน HttpService
import { JwtModule } from '@nestjs/jwt';

@Module({
  imports: [
    HttpModule, // เพิ่ม HttpModule
    JwtModule.register({
      secret: 'yourSecretKey', // ควรเก็บไว้ใน environment variable
      signOptions: { expiresIn: '1h' },
    }),
  ],
  providers: [AuthService, PrismaService],
  controllers: [AuthController],
})
export class AuthModule {}
