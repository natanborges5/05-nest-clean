import { Module } from '@nestjs/common';
import { PrismaService } from './prisma/prisma.service';
import { AccountController } from './controllers/account.controller';
import { ConfigModule } from '@nestjs/config';
import { envSchema } from './env';
import { AuthModule } from './auth/auth.module';
import { AuthenticateController } from './controllers/authenticate.controller';
import { QuestionController } from './controllers/question.controller';
@Module({
  imports: [ConfigModule.forRoot({
      validate: (env) => envSchema.parse(env),
      isGlobal: true
    }),
    AuthModule
  ],
  controllers: [AccountController,AuthenticateController,QuestionController],
  providers: [PrismaService],
})
export class AppModule {}
