import { Either, right } from "@/core/either"
import { QuestionComment } from "../../enterprise/entities/question-comment"
import { QuestionCommentsRepository } from "../repositories/question-comments-repository"
import { NotAllowedError } from "./errors/not-allowed-error"
import { ResourceNotFoundError } from "./errors/resource-not-found-error"

interface FetchQuestionCommentsUseCaseRequest {
    questionId: string
    page: number
}
type FetchQuestionCommentsUseCaseResponse = Either<null ,{questionComments: QuestionComment[]}>
export class FetchQuestionCommentsUseCase { 
    constructor(
        private questionCommentsRepository: QuestionCommentsRepository,
    ){}
    async execute({questionId,page}: FetchQuestionCommentsUseCaseRequest) : Promise<FetchQuestionCommentsUseCaseResponse> {
        const questionComments = await this.questionCommentsRepository.findManyByQuestionId(questionId, {page})
        return right({
            questionComments
        })
    }
}
    