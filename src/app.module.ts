import { Module } from '@nestjs/common';
import { PrismaService } from './prisma/prisma.service';
import { AccountController } from './controllers/account.controller';

@Module({
  controllers: [AccountController],
  providers: [PrismaService],
})
export class AppModule {}
