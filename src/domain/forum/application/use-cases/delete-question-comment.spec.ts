import { InMemoryQuestionCommentsRepository } from 'test/repositories/in-memory-question-comments-repository'
import { DeleteQuestionCommentUseCase } from './delete-question-comment'
import { makeQuestionComment } from 'test/factories/make-question-comment'

let inMemoryQuestionCommentsRepository: InMemoryQuestionCommentsRepository
let sut: DeleteQuestionCommentUseCase

describe('Delete on Question', () => {
    beforeEach(() => {
        inMemoryQuestionCommentsRepository =
            new InMemoryQuestionCommentsRepository()
        sut = new DeleteQuestionCommentUseCase(
            inMemoryQuestionCommentsRepository,
        )
    })

    it('Should be able to delete a question comment', async () => {
        const questionComment = makeQuestionComment()

        await inMemoryQuestionCommentsRepository.create(questionComment)
        await sut.execute({
            questionCommentId: questionComment.id.toString(),
            authorId: questionComment.authorId.toString(),
        })
        expect(inMemoryQuestionCommentsRepository.items).toHaveLength(0)
    })
})
