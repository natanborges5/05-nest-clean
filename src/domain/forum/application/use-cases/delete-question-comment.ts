import { Either, left, right } from '@/core/either'
import { QuestionCommentsRepository } from '../repositories/question-comments-repository'
import { NotAllowedError } from './errors/not-allowed-error'
import { ResourceNotFoundError } from './errors/resource-not-found-error'
interface DeleteQuestionCommentUseCaseRequest {
    authorId: string
    questionCommentId: string
}
type DeleteQuestionCommentUseCaseResponse = Either<
    ResourceNotFoundError | NotAllowedError,
    {}
>
export class DeleteQuestionCommentUseCase {
    constructor(
        private questionCommentsRepository: QuestionCommentsRepository,
    ) {}
    async execute({
        authorId,
        questionCommentId,
    }: DeleteQuestionCommentUseCaseRequest): Promise<DeleteQuestionCommentUseCaseResponse> {
        const question =
            await this.questionCommentsRepository.findById(questionCommentId)
        if (!question) {
            return left(new ResourceNotFoundError())
        }
        if (question.authorId.toString() !== authorId) {
            return left(new NotAllowedError())
        }
        await this.questionCommentsRepository.delete(question)
        return right({})
    }
}
