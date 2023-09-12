import { AppModule } from "@/infra/app.module";
import { PrismaService } from "@/infra/database/prisma/prisma.service";
import { INestApplication } from "@nestjs/common";
import { JwtService } from "@nestjs/jwt";
import {Test} from "@nestjs/testing"
import request from "supertest"
describe("Questions (E2E)", () =>{
    let app: INestApplication
    let prisma: PrismaService
    let jwt: JwtService
    beforeAll(async () => {
        const moduleRef = await Test.createTestingModule({
          imports: [AppModule],
        })
          .compile();
    
        app = moduleRef.createNestApplication();
        prisma = moduleRef.get(PrismaService)
        jwt = moduleRef.get(JwtService)
        await app.init();
      });
    test("[POST] /questions", async () => {
        const user = await prisma.user.create({
            data: {
                name: "John Doe",
                email: "johndoe@example.com",
                password: "123456"
            }
        })

        const accessToken = jwt.sign({sub: user.id})
        const response = await request(app.getHttpServer()).post("/questions").set("Authorization", `Bearer ${accessToken}`).send({
            title: "New question",
            content: "Question content",
        })
        expect(response.statusCode).toBe(201)
        const questionOnDatabase = await prisma.question.findFirst({
            where: {
                title: "New question"
            }
        })
        expect(questionOnDatabase).toBeTruthy()
    })
    test("[GET] /questions Fetch recent questions", async () => {
        const user = await prisma.user.create({
            data: {
                name: "John Doe",
                email: "johndoe2@example.com",
                password: "123456"
            }
        })

        const accessToken = jwt.sign({sub: user.id})
        await prisma.question.createMany({
            data: [
                {
                    title: "New question 01",
                    slug: "question-01",
                    content: "Question content",
                    authorId: user.id
                },
                {
                    title: "New question 02",
                    slug: "question-02",
                    content: "Question content",
                    authorId: user.id
                },
                {
                    title: "New question 03",
                    slug: "question-03",
                    content: "Question content",
                    authorId: user.id
                },
            ]
        })
        const response = await request(app.getHttpServer()).get("/questions").set("Authorization", `Bearer ${accessToken}`)
        expect(response.statusCode).toBe(200)
        expect(response.body).toEqual({
            questions: [
                expect.objectContaining({title: "New question 01"}),
                expect.objectContaining({title: "New question 02"}),
                expect.objectContaining({title: "New question 03"}),
                expect.objectContaining({title: "New question"})
            ]
        })
    })
})