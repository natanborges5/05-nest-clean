import { AnswerQuestionUseCase } from "./answer-question"
import { AnswerRepository } from "../repositories/answers-repository"
import { Answer } from "../../enterprise/entities/answer"
import { InMemoryAnswersRepository } from "test/repositories/in-memory-answers-repository"
import { UniqueEntityID } from "@/core/entities/unique-entity-id"
import { InMemoryAnswerAttachmentsRepository } from "test/repositories/in-memory-answer-attachments-repository"

let inMemoryAnswersRepository: InMemoryAnswersRepository
let inMemoryAnswerAttachmentsRepository: InMemoryAnswerAttachmentsRepository
let sut: AnswerQuestionUseCase

describe("Create Question", () => {
beforeEach(() => {
    inMemoryAnswerAttachmentsRepository = new InMemoryAnswerAttachmentsRepository()
    inMemoryAnswersRepository = new InMemoryAnswersRepository(inMemoryAnswerAttachmentsRepository);
    sut = new AnswerQuestionUseCase(inMemoryAnswersRepository)
})

    it("Should be able to create a answer", async () => {
        const result = await sut.execute({
            questionId: "1",
            instructorId: "1",
            content: "Conteudo da Resposta",
            attachmentsIds: ["1","2"]
        })
        expect(result.isRight()).toBe(true)
        expect(inMemoryAnswersRepository.items[0]).toEqual(result.value?.answer)
        expect(inMemoryAnswersRepository.items[0].attachments.currentItems).toHaveLength(2)
        expect(inMemoryAnswersRepository.items[0].attachments.currentItems).toEqual([
            expect.objectContaining({attachmentId: new UniqueEntityID("1")}),
            expect.objectContaining({attachmentId: new UniqueEntityID("2")})
        ])
    })
})