import { InMemoryStudentsRepository } from "test/repositories/in-memory-students-repository"
import { UniqueEntityID } from "@/core/entities/unique-entity-id"
import { RegisterStudentUseCase } from "./register-student"
import { FakeHasher } from "test/cryptography/fake-hasher"

let inMemoryStudentsRepository: InMemoryStudentsRepository
let fakeHasher: FakeHasher
let sut: RegisterStudentUseCase

describe("Create Student", () => {
    beforeEach(() => {
        inMemoryStudentsRepository = new InMemoryStudentsRepository();
        fakeHasher = new FakeHasher()
        sut = new RegisterStudentUseCase(inMemoryStudentsRepository,fakeHasher)
    })

    it("Should be able to register a new student", async () => {
        const result = await sut.execute({
            name: "John Doe",
            email: "johndoe@example.com",
            password: "123123"
        })
        expect(result.isRight()).toBe(true)
        expect(result.value).toEqual({
            student: inMemoryStudentsRepository.items[0]
        })
    })
    it("Should hash student password upon registration", async () => {
        const result = await sut.execute({
            name: "John Doe",
            email: "johndoe@example.com",
            password: "123123"
        })
        const hashedPassword = await fakeHasher.hash("123123")
        expect(result.isRight()).toBe(true)
        expect(inMemoryStudentsRepository.items[0].password).toEqual(hashedPassword)
    })
})
