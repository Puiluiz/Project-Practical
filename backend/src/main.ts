import { NestFactory } from '@nestjs/core';
import { SwaggerModule, DocumentBuilder } from '@nestjs/swagger';
import { AppModule } from './app.module';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  const config = new DocumentBuilder()
    .setTitle('API TAG')
    .setDescription('API')
    .setVersion('1.0')
    .addTag('APi')
    .build();
  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('api', app, document);

  app.enableCors({
    origin: 'http://localhost:5173', // ใส่ที่มาของ frontend ที่คุณต้องการอนุญาต
    methods: 'GET,HEAD,PUT,PATCH,POST,DELETE,OPTIONS',
    credentials: true, // ถ้าคุณต้องการส่งคุกกี้หรือข้อมูลเกี่ยวกับการรับรองตัวตน
  });

  await app.listen(3000);
}
bootstrap();