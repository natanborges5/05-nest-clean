import { Answer } from '@/domain/forum/enterprise/entities/answer'
import { AnswersRepository } from '../repositories/answers-repository'
import { UniqueEntityID } from '@/core/entities/unique-entity-id'
import { Either, right } from '@/core/either'
import { AnswerAttachment } from '../../enterprise/entities/answer-attachment'
import { AnswerAttachmentList } from '../../enterprise/entities/answer-attachment-list'

interface AnswerQuestionUseCaseRequest {
    instructorId: string
    questionId: string
    content: string
    attachmentsIds: string[]
}
type AnswerQuestionUseCaseResponse = Either<null, { answer: Answer }>
export class AnswerQuestionUseCase {
    constructor(private answerRepository: AnswersRepository) {}
    async execute({
        questionId,
        instructorId,
        content,
        attachmentsIds,
    }: AnswerQuestionUseCaseRequest): Promise<AnswerQuestionUseCaseResponse> {
        const answer = Answer.create({
            content,
            authorId: new UniqueEntityID(instructorId),
            questionId: new UniqueEntityID(questionId),
        })
        const answerAttachments = attachmentsIds.map((attachmentId) => {
            return AnswerAttachment.create({
                attachmentId: new UniqueEntityID(attachmentId),
                answerId: answer.id,
            })
        })
        answer.attachments = new AnswerAttachmentList(answerAttachments)
        await this.answerRepository.create(answer)
        return right({
            answer,
        })
    }
}
