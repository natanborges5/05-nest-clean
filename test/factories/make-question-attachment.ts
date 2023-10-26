import { UniqueEntityID } from '@/core/entities/unique-entity-id'
import {
    QuestionAttachment,
    QuestionAttachmentProps,
} from '@/domain/forum/enterprise/entities/question-attachment'
import { faker } from '@faker-js/faker'

export function makeQuestionAttachment(
    override: Partial<QuestionAttachmentProps> = {},
    id?: UniqueEntityID,
) {
    const questionattachment = QuestionAttachment.create(
        {
            questionId: new UniqueEntityID(),
            attachmentId: new UniqueEntityID(),
            ...override,
        },
        id,
    )
    return questionattachment
}
