import {
    BadRequestException,
    Body,
    Controller,
    Get,
    HttpCode,
    Param,
    Post,
    Put,
    Query,
    UseGuards,
    UsePipes,
} from '@nestjs/common'
import { ZodValidationPipe } from '@/infra/http/pipes/zod-validation-pipe'
import { z } from 'zod'
import { CurrentUser } from '@/infra/auth/current-user-decorator'
import { UserPayload } from '@/infra/auth/jwt.strategy'
import { CreateQuestionUseCase } from '@/domain/forum/application/use-cases/create-question'
import { FetchRecentQuestionsUseCase } from '@/domain/forum/application/use-cases/fetch-recent-questions'
import { QuestionPresenter } from '../presenters/question-presenter'
import { GetQuestionBySlugUseCase } from '@/domain/forum/application/use-cases/get-question-by-slug'
import { EditQuestionUseCase } from '@/domain/forum/application/use-cases/edit-question'
const questionSchema = z.object({
    title: z.string(),
    content: z.string(),
})
const pageQueryParamSchema = z
    .string()
    .optional()
    .default('1')
    .transform(Number)
    .pipe(z.number().min(1))
const queryValidationPipe = new ZodValidationPipe(pageQueryParamSchema)
type PageQueryParamSchema = z.infer<typeof pageQueryParamSchema>
type QuestionBodySchema = z.infer<typeof questionSchema>
@Controller('/questions')
export class QuestionController {
    constructor(
        private createQuestion: CreateQuestionUseCase,
        private fetchRecentQuestions: FetchRecentQuestionsUseCase,
        private getQuestionBySlug: GetQuestionBySlugUseCase,
        private editQuestion: EditQuestionUseCase,
    ) {}
    @Get()
    async handleFetchRecentQuestions(
        @Query('page', queryValidationPipe) page: PageQueryParamSchema,
    ) {
        const result = await this.fetchRecentQuestions.execute({ page })
        if (result.isLeft()) {
            throw new BadRequestException()
        }
        const questions = result.value.questions
        return {
            questions: questions.map(QuestionPresenter.toHTTP),
        }
    }
    @Get('/:slug')
    async handleGetQuestionBySlug(@Param('slug') slug: string) {
        const result = await this.getQuestionBySlug.execute({ slug })
        if (result.isLeft()) {
            throw new BadRequestException()
        }
        return {
            question: QuestionPresenter.toHTTP(result.value.question),
        }
    }
    @Post()
    @HttpCode(201)
    async handlePostQuestion(
        @CurrentUser() user: UserPayload,
        @Body(new ZodValidationPipe(questionSchema)) body: QuestionBodySchema,
    ) {
        const { title, content } = body
        const userId = user.sub
        const result = await this.createQuestion.execute({
            title,
            content,
            authorId: userId,
            attachmentsIds: [],
        })
        if (result.isLeft()) {
            throw new BadRequestException()
        }
    }
    @Put('/:id')
    @HttpCode(204)
    async handleEditQuestion(
        @CurrentUser() user: UserPayload,
        @Body(new ZodValidationPipe(questionSchema)) body: QuestionBodySchema,
        @Param('id') questionId: string,
    ) {
        const { title, content } = body
        const userId = user.sub
        const result = await this.editQuestion.execute({
            title,
            content,
            authorId: userId,
            attachmentsIds: [],
            questionId,
        })
        if (result.isLeft()) {
            throw new BadRequestException()
        }
    }
}
