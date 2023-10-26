import { Slug } from '@/domain/forum/enterprise/entities/value-objects/slug'
import { AppModule } from '@/infra/app.module'
import { DatabaseModule } from '@/infra/database/database.module'
import { PrismaService } from '@/infra/database/prisma/prisma.service'
import { INestApplication } from '@nestjs/common'
import { JwtService } from '@nestjs/jwt'
import { Test } from '@nestjs/testing'
import request from 'supertest'
import { QuestionFactory } from 'test/factories/make-question'
import { StudentFactory } from 'test/factories/make-student'
describe('Questions (E2E)', () => {
    let app: INestApplication
    let prisma: PrismaService
    let jwt: JwtService
    let studentFactory: StudentFactory
    let questionFactory: QuestionFactory
    beforeAll(async () => {
        const moduleRef = await Test.createTestingModule({
            imports: [AppModule, DatabaseModule],
            providers: [StudentFactory, QuestionFactory],
        }).compile()

        app = moduleRef.createNestApplication()
        prisma = moduleRef.get(PrismaService)
        jwt = moduleRef.get(JwtService)
        studentFactory = moduleRef.get(StudentFactory)
        questionFactory = moduleRef.get(QuestionFactory)
        await app.init()
    })
    test('[POST] /questions', async () => {
        const user = await studentFactory.makePrismaStudent()

        const accessToken = jwt.sign({ sub: user.id.toString() })
        const response = await request(app.getHttpServer())
            .post('/questions')
            .set('Authorization', `Bearer ${accessToken}`)
            .send({
                title: 'New question',
                content: 'Question content',
            })
        expect(response.statusCode).toBe(201)
        const questionOnDatabase = await prisma.question.findFirst({
            where: {
                title: 'New question',
            },
        })
        expect(questionOnDatabase).toBeTruthy()
    })
    test('[GET] /questions Fetch recent questions', async () => {
        const user = await studentFactory.makePrismaStudent()

        const accessToken = jwt.sign({ sub: user.id.toString() })

        await Promise.all([
            questionFactory.makePrismaQuestion({
                title: 'New question 01',
                slug: Slug.create('question-01'),
                authorId: user.id,
            }),
            questionFactory.makePrismaQuestion({
                title: 'New question 02',
                slug: Slug.create('question-02'),
                authorId: user.id,
            }),
            questionFactory.makePrismaQuestion({
                title: 'New question 03',
                slug: Slug.create('question-03'),
                authorId: user.id,
            }),
        ])
        const response = await request(app.getHttpServer())
            .get('/questions')
            .set('Authorization', `Bearer ${accessToken}`)
            .send()
        expect(response.statusCode).toBe(200)
        expect(response.body).toEqual({
            questions: expect.arrayContaining([
                expect.objectContaining({ title: 'New question 01' }),
                expect.objectContaining({ title: 'New question 03' }),
                expect.objectContaining({ title: 'New question 02' }),
                expect.objectContaining({ title: 'New question' }),
            ]),
        })
    })
    test('[GET] /questions/:slug', async () => {
        const user = await studentFactory.makePrismaStudent()

        const accessToken = jwt.sign({ sub: user.id.toString() })
        await questionFactory.makePrismaQuestion({
            title: 'Question 05',
            slug: Slug.create('question-05'),
            authorId: user.id,
        })
        const response = await request(app.getHttpServer())
            .get('/questions/question-05')
            .set('Authorization', `Bearer ${accessToken}`)
            .send()
        expect(response.statusCode).toBe(200)
        expect(response.body).toEqual({
            question: expect.objectContaining({ title: 'Question 05' }),
        })
    })
    test('[PUT] /questions/:id', async () => {
        const user = await studentFactory.makePrismaStudent()

        const accessToken = jwt.sign({ sub: user.id.toString() })

        const question = await questionFactory.makePrismaQuestion({
            authorId: user.id,
            slug: Slug.create('question-0-edit'),
        })
        const questionId = question.id.toString()
        const response = await request(app.getHttpServer())
            .put(`/questions/${questionId}`)
            .set('Authorization', `Bearer ${accessToken}`)
            .send({
                title: 'New title',
                content: 'New content',
                
            })
        expect(response.statusCode).toBe(204)
        const questionOnDatabase = await prisma.question.findFirst({
            where: {
                title: 'New question',
            },
        })
        expect(questionOnDatabase).toBeTruthy()
    })
})
