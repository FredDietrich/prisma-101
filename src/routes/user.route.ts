import { FastifyInstance, FastifyPluginOptions } from "fastify"

async function routes(fastify: FastifyInstance, options: FastifyPluginOptions) {
    fastify.get('/', async (request) => {
        const users = await fastify.prisma.user.findMany()
        console.log(request.user)
        return users
    })

    fastify.get('/:id', async (request, reply) => {
        const { id: userId } = request.params as { id: string }
        const user = await fastify.prisma.user.findFirst({
            where: { id: userId }
        }).catch(() => null)
        if (!user) {
            reply.status(404)
            return
        }
        return user
    })

    fastify.get('/:id/entries', async (request, reply) => {
        const { id: userId } = request.params as { id: string }
        const user = await fastify.prisma.user.findFirst({
            where: { id: userId },
            include: { PhonebookEntry: true }
        }).catch(() => null)
        if (!user) {
            reply.status(404)
            return
        }
        return user.PhonebookEntry
    })
}

export default routes
