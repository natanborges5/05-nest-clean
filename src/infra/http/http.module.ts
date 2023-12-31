import { Module } from '@nestjs/common'
import { AccountController } from './controllers/account.controller'
import { AuthenticateController } from './controllers/authenticate.controller'
import { QuestionController } from './controllers/question.controller'
import { PrismaService } from '../database/prisma/prisma.service'
import { DatabaseModule } from '../database/database.module'
import { CreateQuestionUseCase } from '@/domain/forum/application/use-cases/create-question'
import { FetchRecentQuestionsUseCase } from '@/domain/forum/application/use-cases/fetch-recent-questions'
import { AuthenticateStudentUseCase } from '@/domain/forum/application/use-cases/authenticate-student'
import { RegisterStudentUseCase } from '@/domain/forum/application/use-cases/register-student'
import { CryptographyModule } from '../cryptography/cryptography.module'
import { GetQuestionBySlugUseCase } from '@/domain/forum/application/use-cases/get-question-by-slug'
import { EditQuestionUseCase } from '@/domain/forum/application/use-cases/edit-question'

@Module({
    imports: [DatabaseModule, CryptographyModule],
    controllers: [
        AccountController,
        AuthenticateController,
        QuestionController,
    ],
    providers: [
        CreateQuestionUseCase,
        FetchRecentQuestionsUseCase,
        AuthenticateStudentUseCase,
        RegisterStudentUseCase,
        GetQuestionBySlugUseCase,
        EditQuestionUseCase,
    ],
})
export class HttpModule {}
