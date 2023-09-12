import { Either, left, right } from "@/core/either"
import { AnswerCommentsRepository } from "../repositories/answer-comments-repository"
import { ResourceNotFoundError } from "./errors/resource-not-found-error"
import { NotAllowedError } from "./errors/not-allowed-error"

interface DeleteAnswerCommentUseCaseRequest {
    authorId: string
    answerCommentId: string
}
type DeleteAnswerCommentUseCaseResponse = Either<ResourceNotFoundError | NotAllowedError, {}>
export class DeleteAnswerCommentUseCase { 
    constructor(
        private answerCommentsRepository: AnswerCommentsRepository
    ){}
    async execute({authorId, answerCommentId}: DeleteAnswerCommentUseCaseRequest) : Promise<DeleteAnswerCommentUseCaseResponse> {
        const answer = await this.answerCommentsRepository.findById(answerCommentId)
        if(!answer){
            return left(new ResourceNotFoundError())
        }
        if(answer.authorId.toString() !== authorId){
            return left(new NotAllowedError())
        }
        await this.answerCommentsRepository.delete(answer)
        return right({})
    }
    
}