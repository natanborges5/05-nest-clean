import { BadRequestException, Body, Controller, Post, UnauthorizedException, UsePipes } from "@nestjs/common";
import { ZodValidationPipe } from "@/infra/http/pipes/zod-validation-pipe";
import { z } from "zod";
import { AuthenticateStudentUseCase } from "@/domain/forum/application/use-cases/authenticate-student";
import { WrongCredentialsError } from "@/domain/forum/application/use-cases/errors/wrong-credentials-error";
import { Public } from "@/infra/auth/public";
const AuthenticateSchema = z.object({
    email: z.string().email(),
    password: z.string(),
})
type AuthenticateBodySchema = z.infer<typeof AuthenticateSchema>
@Controller("/sessions")
export class AuthenticateController {
    constructor(private authenticateStudent: AuthenticateStudentUseCase){}
    @Post()
    @Public()
    @UsePipes(new ZodValidationPipe(AuthenticateSchema))
    async handle(@Body() body: AuthenticateBodySchema){
        const {email, password} = body
        const result = await this.authenticateStudent.execute({
            email,
            password
        })
        if(result.isLeft()){
            const error = result.value
            switch (error.constructor){
                case WrongCredentialsError:
                    throw new UnauthorizedException(error.message)
                default:
                    throw new BadRequestException(error.message)
            }
        }
        const {accessToken} = result.value
        return {
            access_token: accessToken
        }
    }
}