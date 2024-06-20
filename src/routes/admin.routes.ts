import { FastifyInstance } from "fastify";
import phonebookRoute from "./phonebook.route";
import userRoute from "./user.route";
import { User } from "@prisma/client";

export interface UserFromRequest {
    payload:  Partial<User>
}

export async function adminRoutes(fastify: FastifyInstance) {
    fastify.addHook("onRequest", async (request, reply) => {
        try {
            await request.jwtVerify()
            const { payload: user } = request.user as UserFromRequest
            if (!user.admin) {
                reply.status(401)
                throw new Error('Not authorized')
            }
        } catch (err) {
            reply.send(err)
        }
    })
    fastify
        .register(phonebookRoute, { prefix: '/phonebook' })
        .register(userRoute, { prefix: '/user' })
}
