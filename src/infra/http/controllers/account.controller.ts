import { Body, ConflictException, Controller, HttpCode, Post, UsePipes } from "@nestjs/common";
import { hash } from "bcryptjs";
import { ZodValidationPipe } from "@/infra/http/pipes/zod-validation-pipe";
import { PrismaService } from "@/infra/database/prisma/prisma.service";
import {z} from "zod"
const accountSchema = z.object({
    name: z.string(),
    email: z.string().email(),
    password: z.string(),
})
type AccountBodySchema = z.infer<typeof accountSchema>
@Controller("/accounts")
export class AccountController {
    constructor(private prisma: PrismaService){}
    
    @Post()
    @HttpCode(201)
    @UsePipes(new ZodValidationPipe(accountSchema))
    async handle(@Body() body: AccountBodySchema){
        const {name, email, password} = body

        const userWithSameEmail = await this.prisma.user.findUnique({
            where:{
                email
            }
        })
        if(userWithSameEmail){
            throw new ConflictException("Useer with same e-mail address already exists")
        }
        const hashedPassword = await hash(password, 8)
        await this.prisma.user.create({
            data: {
                name,
                email,
                password: hashedPassword
            }
        })
    }
}