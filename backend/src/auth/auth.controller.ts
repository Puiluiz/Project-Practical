import { Body, Controller, Post, HttpException, HttpStatus } from '@nestjs/common';
import { AuthService } from './auth.service';
import { ApiTags } from '@nestjs/swagger';


@ApiTags('Auth')
@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  // ฟังก์ชันลงทะเบียน
  @Post('register')
  async register(@Body() body: { email: string; username: string; password: string; confirmPassword: string }) {
    const { email, username, password, confirmPassword } = body;

    try {
      const user = await this.authService.register({ email, username, password, confirmPassword });
      return { success: true, user };
    } catch (error) {
      console.error('Error during registration:', error); // แสดงข้อผิดพลาดในบันทึกเพื่อการดีบั๊ก
      throw new HttpException({
        status: HttpStatus.BAD_REQUEST,
        error: error.message || 'Registration failed', // ส่งข้อความแสดงข้อผิดพลาดเริ่มต้นในกรณีที่ไม่มีข้อความจาก error
      }, HttpStatus.BAD_REQUEST);
    }
  }

  // ฟังก์ชันเข้าสู่ระบบ
  // ฟังก์ชันเข้าสู่ระบบ
  @Post('login')
  async login(@Body() body: { username: string; password: string }) {
    const { username, password } = body;

    try {
      const loginResult = await this.authService.login({ username, password });
      return { success: true, loginResult };
    } catch (error) {
      console.error('Error during login:', error); // Log the error for debugging
      throw new HttpException({
        status: HttpStatus.UNAUTHORIZED,
        error: 'Invalid credentials', // Return a generic message for invalid credentials
      }, HttpStatus.UNAUTHORIZED);
    }
  }

  // ฟังก์ชันออกจากระบบ
  @Post('logout')
  async logout() {
    return this.authService.logout();
  }
}
