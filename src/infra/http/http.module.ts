import { Module } from "@nestjs/common";
import { AccountController } from "./controllers/account.controller";
import { AuthenticateController } from "./controllers/authenticate.controller";
import { QuestionController } from "./controllers/question.controller";
import { PrismaService } from "../database/prisma/prisma.service";
import { DatabaseModule } from "../database/database.module";
import { CreateQuestionUseCase } from "@/domain/forum/application/use-cases/create-question";
import { FetchRecentQuestionsUseCase } from "@/domain/forum/application/use-cases/fetch-recent-questions";

@Module({
    imports: [
        DatabaseModule,
    ],
    controllers: [AccountController,AuthenticateController,QuestionController],
    providers: [CreateQuestionUseCase,FetchRecentQuestionsUseCase]
})
export class HttpModule{

}