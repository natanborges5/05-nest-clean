
import { Answer } from "@/domain/forum/enterprise/entities/answer"
import { AnswersRepository } from "../repositories/answers-repository"
import { UniqueEntityID } from "@/core/entities/unique-entity-id"
import { Question } from "../../enterprise/entities/question"
import { QuestionsRepository } from "../repositories/questions-repository"
import { Either, left, right } from "@/core/either"
import { ResourceNotFoundError } from "./errors/resource-not-found-error"
import { NotAllowedError } from "./errors/not-allowed-error"

interface ChooseQuestionBestAnswerCaseRequest {
    authorId: string
    answerId: string
}
type ChooseQuestionBestAnswerCaseResponse = Either<ResourceNotFoundError | NotAllowedError, {question: Question}>
export class ChooseQuestionBestAnswerUseCase { 
    constructor(
        private answerRepository: AnswersRepository,
        private questionRepository: QuestionsRepository
    ){}
    async execute({authorId, answerId}: ChooseQuestionBestAnswerCaseRequest): Promise<ChooseQuestionBestAnswerCaseResponse> {
        const answer = await this.answerRepository.findById(answerId);
        if(!answer){
            return left(new ResourceNotFoundError())
        }
        const question = await this.questionRepository.findById(answer.questionId.toString());
        if(!question){
            return left(new ResourceNotFoundError())
        }
        if(authorId !== question.authorId.toString()) {
            return left(new NotAllowedError())
        }
        question.bestAnswerId = answer.id
        await this.questionRepository.save(question)
        return right({question})
    }
    
}