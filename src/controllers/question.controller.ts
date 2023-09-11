import { Body, Controller, Get, HttpCode, Post, Query, UseGuards, UsePipes } from "@nestjs/common";
import { AuthGuard } from "@nestjs/passport";
import { CurrentUser } from "@/auth/current-user-decorator";
import { UserPayload } from "@/auth/jwt.strategy";
import { ZodValidationPipe } from "@/pipes/zod-validation-pipe";
import { PrismaService } from "@/prisma/prisma.service";
import {z} from "zod"
const questionSchema = z.object({
    title: z.string(),
    content: z.string()
})
const pageQueryParamSchema = z.string().optional().default("1").transform(Number).pipe(z.number().min(1))
const queryValidationPipe = new ZodValidationPipe(pageQueryParamSchema)
type PageQueryParamSchema = z.infer<typeof pageQueryParamSchema>
type QuestionBodySchema = z.infer<typeof questionSchema>
@Controller("/questions")
@UseGuards(AuthGuard("jwt"))
export class QuestionController {
    constructor(private prisma: PrismaService){}
    @Get()
    async handleFetchRecentQuestions(@Query("page", queryValidationPipe) page: PageQueryParamSchema){
      const perPage = 1
      const questions = await this.prisma.question.findMany({
        take: perPage,
        skip: (page - 1) * perPage,
        orderBy: {
          createdAt: "desc"
        }
      })
      return {
        questions
      }
    }

    @Post()
    @HttpCode(201)
    async handlePostQuestion(@CurrentUser() user: UserPayload, @Body(new ZodValidationPipe(questionSchema)) body: QuestionBodySchema){
        const {title, content} = body
        const userId = user.sub
        const slug = this.stringToSlug(title)
        await this.prisma.question.create({
            data: {
                authorId: userId,
                title,
                content,
                slug,
            }
        })
    }
    private stringToSlug(input: string): string {
        // Remove acentos e caracteres especiais da string
        const normalizedString = input
          .normalize("NFD")
          .replace(/[\u0300-\u036f]/g, "");
      
        // Substitui espaços e caracteres especiais por hífens
        const slug = normalizedString
          .toLowerCase()
          .replace(/[^a-z0-9]+/g, "-")
          .replace(/^-+|-+$/g, "") // Remove hífens duplicados no início e no final
          .replace(/^-/g, "") // Remove hífen no início (caso exista)
          .replace(/-$/g, ""); // Remove hífen no final (caso exista)
      
        return slug;
      }
}