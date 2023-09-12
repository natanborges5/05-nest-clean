import { UniqueEntityID } from "@/core/entities/unique-entity-id";
import { Student, StudentProps } from "@/domain/forum/enterprise/entities/student";
import { Slug } from "@/domain/forum/enterprise/entities/value-objects/slug";
import {fa, faker} from "@faker-js/faker"
export function makeStudent(override: Partial<StudentProps> = {}, id?: UniqueEntityID){
    const student = Student.create({
        name: faker.person.firstName(),
        email: faker.internet.email(),
        password: faker.internet.password(),
        ...override
    }, id)
    return student;
}