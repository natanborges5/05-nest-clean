import { Either, left, right } from "@/core/either"
import { Answer } from "../../enterprise/entities/answer"
import { AnswersRepository } from "../repositories/answers-repository"
import { NotAllowedError } from "./errors/not-allowed-error"
import { ResourceNotFoundError } from "./errors/resource-not-found-error"
import { AnswerAttachmentsRepository } from "../repositories/answer-attachments-repository"
import { AnswerAttachmentList } from "../../enterprise/entities/answer-attachment-list"
import { AnswerAttachment } from "../../enterprise/entities/answer-attachment"
import { UniqueEntityID } from "@/core/entities/unique-entity-id"

interface EditAnswerUseCaseRequest {
    authorId: string
    answerId: string
    content: string
    attachmentsIds: string[]
}
type EditAnswerUseCaseResponse = Either<ResourceNotFoundError | NotAllowedError ,{answer: Answer}>
export class EditAnswerUseCase { 
    constructor(
        private answerRepository: AnswersRepository,
        private answerAttachmentRepository: AnswerAttachmentsRepository
    ){}
    async execute({authorId,answerId,content,attachmentsIds}: EditAnswerUseCaseRequest) : Promise<EditAnswerUseCaseResponse> {
        const answer = await this.answerRepository.findById(answerId);
        if(!answer){
            return left(new ResourceNotFoundError)
        }
        if(authorId !== answer.authorId.toString()) {
            return left(new NotAllowedError)
        }
        const currentAnswerAttachments = await this.answerAttachmentRepository.findManyByAnswerId(answerId)
        const answerAttachmentList = new AnswerAttachmentList(currentAnswerAttachments)

        const answerAttachments = attachmentsIds.map(attachmentId => {
            return AnswerAttachment.create({
                attachmentId: new UniqueEntityID(attachmentId),
                answerId: answer.id
            })
        })
        answerAttachmentList.update(answerAttachments)
        answer.content = content
        answer.attachments = answerAttachmentList
        await this.answerRepository.save(answer)
        return right({answer})
    }
    
}