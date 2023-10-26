import { InMemoryAnswersRepository } from 'test/repositories/in-memory-answers-repository'
import { makeAnswer } from 'test/factories/make-answer'
import { EditAnswerUseCase } from './edit-answer'
import { UniqueEntityID } from '@/core/entities/unique-entity-id'
import { NotAllowedError } from './errors/not-allowed-error'
import { InMemoryAnswerAttachmentsRepository } from 'test/repositories/in-memory-answer-attachments-repository'
import { makeAnswerAttachment } from 'test/factories/make-answer-attachment'

let inMemoryAnswersRepository: InMemoryAnswersRepository
let inMemoryAnswerAttachmentsRepository: InMemoryAnswerAttachmentsRepository
let sut: EditAnswerUseCase

describe('Edit Answer', () => {
    beforeEach(() => {
        inMemoryAnswerAttachmentsRepository =
            new InMemoryAnswerAttachmentsRepository()
        inMemoryAnswersRepository = new InMemoryAnswersRepository(
            inMemoryAnswerAttachmentsRepository,
        )
        sut = new EditAnswerUseCase(
            inMemoryAnswersRepository,
            inMemoryAnswerAttachmentsRepository,
        )
    })

    it('Should be able to edit a answer', async () => {
        const newAnswer = makeAnswer(
            {
                authorId: new UniqueEntityID('author-1'),
            },
            new UniqueEntityID('answer-1'),
        )
        await inMemoryAnswersRepository.create(newAnswer)
        inMemoryAnswerAttachmentsRepository.items.push(
            makeAnswerAttachment({
                answerId: newAnswer.id,
                attachmentId: new UniqueEntityID('1'),
            }),
            makeAnswerAttachment({
                answerId: newAnswer.id,
                attachmentId: new UniqueEntityID('2'),
            }),
        )
        await sut.execute({
            answerId: newAnswer.id.toString(),
            authorId: newAnswer.authorId.toString(),
            content: 'Edited Content',
            attachmentsIds: ['1', '3'],
        })
        expect(inMemoryAnswersRepository.items[0]).toMatchObject({
            content: 'Edited Content',
        })
        expect(
            inMemoryAnswersRepository.items[0].attachments.currentItems,
        ).toHaveLength(2)
        expect(
            inMemoryAnswersRepository.items[0].attachments.currentItems,
        ).toEqual([
            expect.objectContaining({ attachmentId: new UniqueEntityID('1') }),
            expect.objectContaining({ attachmentId: new UniqueEntityID('3') }),
        ])
    })
    it('Should not be able to edit a answer from another user', async () => {
        const newAnswer = makeAnswer(
            {
                authorId: new UniqueEntityID('author-1'),
            },
            new UniqueEntityID('answer-1'),
        )
        await inMemoryAnswersRepository.create(newAnswer)
        const result = await sut.execute({
            answerId: newAnswer.id.toString(),
            authorId: 'author-2',
            content: 'Edited Content',
            attachmentsIds: [],
        })
        expect(result.isLeft()).toBe(true)
        expect(result.value).toBeInstanceOf(NotAllowedError)
    })
})
