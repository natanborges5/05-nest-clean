import { BadRequestException, Body, ConflictException, Controller, HttpCode, Post, UsePipes } from "@nestjs/common";
import { ZodValidationPipe } from "@/infra/http/pipes/zod-validation-pipe";
import { z } from "zod";
import { RegisterStudentUseCase } from "@/domain/forum/application/use-cases/register-student";
import { StudentAlreadyExistsError } from "@/domain/forum/application/use-cases/errors/student-already-exists-error";
const accountSchema = z.object({
    name: z.string(),
    email: z.string().email(),
    password: z.string(),
})
type AccountBodySchema = z.infer<typeof accountSchema>
@Controller("/accounts")
export class AccountController {
    constructor(private registerStudent: RegisterStudentUseCase){}
    
    @Post()
    @HttpCode(201)
    @UsePipes(new ZodValidationPipe(accountSchema))
    async handle(@Body() body: AccountBodySchema){
        const {name, email, password} = body

        const result = await this.registerStudent.execute({
            name,
            email,
            password
        })
        if(result.isLeft()){
            const error = result.value
            console.log("entrou")
            switch (error.constructor){
                case StudentAlreadyExistsError:
                    throw new ConflictException(error.message)
                default:
                    throw new BadRequestException(error.message)
            }
            
        }
    }
}