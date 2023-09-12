import { InMemoryQuestionsRepository } from "test/repositories/in-memory-questions-repository"
import { makeQuestion } from "test/factories/make-question"
import { DeleteQuestionUseCase } from "./delete-question"
import { UniqueEntityID } from "@/core/entities/unique-entity-id"
import { InMemoryAnswersRepository } from "test/repositories/in-memory-answers-repository"
import { ChooseQuestionBestAnswerUseCase } from "./choose-question-best-answer"
import { makeAnswer } from "test/factories/make-answer"
import { NotAllowedError } from "./errors/not-allowed-error"
import { InMemoryQuestionAttachmentsRepository } from "test/repositories/in-memory-question-attachments-repository"
import { InMemoryAnswerAttachmentsRepository } from "test/repositories/in-memory-answer-attachments-repository"

let inMemoryQuestionsRepository: InMemoryQuestionsRepository
let inMemoryAnswersRepository: InMemoryAnswersRepository
let inMemoryQuestionAttachmentsRepository: InMemoryQuestionAttachmentsRepository
let inMemoryAnswerAttachmentsRepository: InMemoryAnswerAttachmentsRepository
let sut: ChooseQuestionBestAnswerUseCase

describe("Choose question best answer", () => {
    beforeEach(() => {
        inMemoryQuestionAttachmentsRepository = new InMemoryQuestionAttachmentsRepository()
        inMemoryQuestionsRepository = new InMemoryQuestionsRepository(inMemoryQuestionAttachmentsRepository);
        inMemoryAnswersRepository = new InMemoryAnswersRepository(inMemoryAnswerAttachmentsRepository)
        sut = new ChooseQuestionBestAnswerUseCase(inMemoryAnswersRepository,inMemoryQuestionsRepository,)
    })

    it("Should be able to choose the question best answer", async () => {
        const question = makeQuestion()
        const answer = makeAnswer({
            questionId: question.id
        })
        await inMemoryQuestionsRepository.create(question)
        await inMemoryAnswersRepository.create(answer)
        await sut.execute({
            authorId: question.authorId.toString(),
            answerId: answer.id.toString()
        })
        expect(inMemoryQuestionsRepository.items[0].bestAnswerId).toEqual(answer.id)
    })
    it("Should not be able to choose another user question best answer", async () => {
        const question = makeQuestion({
            authorId: new UniqueEntityID("author-1")
        })
        const answer = makeAnswer({
            questionId: question.id
        })
        await inMemoryQuestionsRepository.create(question)
        await inMemoryAnswersRepository.create(answer)
        const result = await sut.execute({
            answerId: answer.id.toString(),
            authorId: "author-2"
        })
        expect(result.isLeft()).toBe(true)
        expect(result.value).toBeInstanceOf(NotAllowedError)
    })
})
