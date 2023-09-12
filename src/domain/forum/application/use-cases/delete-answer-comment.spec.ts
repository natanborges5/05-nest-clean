import { InMemoryAnswerCommentsRepository } from "test/repositories/in-memory-answer-comments-repository"
import { DeleteAnswerCommentUseCase } from "./delete-answer-comment"
import { makeAnswerComment } from "test/factories/make-answer-comment"

let inMemoryAnswerCommentsRepository: InMemoryAnswerCommentsRepository
let sut: DeleteAnswerCommentUseCase

describe("Delete on Answer", () => {
    beforeEach(() => {
        inMemoryAnswerCommentsRepository = new InMemoryAnswerCommentsRepository()
        sut = new DeleteAnswerCommentUseCase(inMemoryAnswerCommentsRepository,)
    })

    it("Should be able to delete a answer comment", async () => {
        const answerComment = makeAnswerComment()
        
        await inMemoryAnswerCommentsRepository.create(answerComment)
        await sut.execute({
            answerCommentId: answerComment.id.toString(),
            authorId: answerComment.authorId.toString(),
        })
        expect(inMemoryAnswerCommentsRepository.items).toHaveLength(0)
    })
})