import { Student } from "../../enterprise/entities/student"
import { Either, right } from "@/core/either"
import { Injectable } from "@nestjs/common"
import { StudentsRepository } from "../repositories/student-repository"
import { HashGenerator } from "../cryptography/hasher-generator"
import { StudentAlreadyExistsError } from "./errors/student-already-exists-error"

interface CreateStudentUseCaseRequest {
    name: string
    email: string
    password: string
}
type CreateStudentUseCaseResponse = Either<StudentAlreadyExistsError, {
    student: Student
}>
@Injectable()
export class CreateStudentUseCase { 
    constructor(
        private studentRepository: StudentsRepository,
        private hashGenerator: HashGenerator
    ){}
    async execute({name, email, password}: CreateStudentUseCaseRequest) : Promise<CreateStudentUseCaseResponse> {
        const studentWithSameEmail = await this.studentRepository.findByEmail(email)
        if(studentWithSameEmail){
            throw new StudentAlreadyExistsError(email)
        }
        const hashedPassword = await this.hashGenerator.hash(password)
        const student = Student.create({
            name,
            email,
            password: hashedPassword,
        }) 
        await this.studentRepository.create(student)
        return right({
            student
        })
    }
    
}