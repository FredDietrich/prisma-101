import { User } from "@prisma/client";
import { compare, hash } from 'bcrypt';
import { FastifyInstance } from "fastify";

const saltRounds = +(process.env.SALT_ROUNDS || 10)
const ADMIN_EMAILS = (process.env.ADMIN_EMAILS || '').split(',')

export async function loginRoute(fastify: FastifyInstance) {
    fastify.post('/register', async (request) => {
        const { email, name, password } = request.body as User
        const encryptedPassword = await hash(password, saltRounds)
        const user = await fastify.prisma.user.create({
            data: {
                email, name, password: encryptedPassword, admin: ADMIN_EMAILS.includes(email)
            }
        })
        return user
    })

    fastify.post('/login', async (request, reply) => {
        const { email, password } = request.body as User
        const foundUser = await fastify.prisma.user.findFirst({
            where: { email }
        })
        if (!foundUser) {
            reply.status(401)
            return { status: 'Wrong username or password' }
        }
        const correctPassword = await compare(password, foundUser.password)
        if (!correctPassword) {
            reply.status(401)
            return { status: 'Wrong username or password' }
        }
        reply.status(201)
        const { password: _, ...noPasswordUser } = foundUser
        const token = fastify.jwt.sign({ payload: noPasswordUser })
        return { token }
    })
}
