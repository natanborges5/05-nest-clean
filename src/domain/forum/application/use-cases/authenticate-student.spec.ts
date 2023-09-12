import { InMemoryStudentsRepository } from "test/repositories/in-memory-students-repository"
import { UniqueEntityID } from "@/core/entities/unique-entity-id"
import { AuthenticateStudentUseCase } from "./authenticate-student"
import { FakeHasher } from "test/cryptography/fake-hasher"
import { FakeEncrypter } from "test/cryptography/fake-encrypter"
import { makeStudent } from "test/factories/make-student"

let inMemoryStudentsRepository: InMemoryStudentsRepository
let fakeHasher: FakeHasher
let fakeEncrypter: FakeEncrypter
let sut: AuthenticateStudentUseCase

describe("Authenticate Student", () => {
    beforeEach(() => {
        inMemoryStudentsRepository = new InMemoryStudentsRepository();
        fakeHasher = new FakeHasher()
        fakeEncrypter = new FakeEncrypter()
        sut = new AuthenticateStudentUseCase(inMemoryStudentsRepository,fakeHasher,fakeEncrypter)
    })

    it("Should be able to authenticate a student", async () => {
        const student = makeStudent({
            email: "johndoe@example.com",
            password: await fakeHasher.hash("123123")
        })
        await inMemoryStudentsRepository.create(student)
        const result = await sut.execute({
            email: "johndoe@example.com",
            password: "123123"
        })
        expect(result.isRight()).toBe(true)
        expect(result.value).toEqual({
            accessToken: expect.any(String)
        })
    })
})
