import { Module } from '@nestjs/common';
import { AuthModule } from './auth/auth.module';
import { PrismaModule } from './utills/prisma/prisma.module';
import { ProductModule } from './product/product.module';
import { ManybahtService } from './manybaht/manybaht.service';
import { UserService } from './user/user.service';
import { UserModule } from './user/user.module';
import { HistoryService } from './history/history.service';
import { HistoryModule } from './history/history.module';
import { SummaryService } from './summary/summary.service';
import { SummaryModule } from './summary/summary.module';

@Module({
  imports: [
    AuthModule,
    PrismaModule,
    ProductModule,
    UserModule,
    HistoryModule,
    SummaryModule,
  ],
  providers: [ManybahtService, UserService, HistoryService, SummaryModule],
})
export class AppModule {}
