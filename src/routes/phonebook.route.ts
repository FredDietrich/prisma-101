import { PhonebookEntry, PrismaClient } from "@prisma/client"
import { FastifyInstance, FastifyPluginOptions } from "fastify"

async function routes(fastify: FastifyInstance) {
    fastify.get('/', async () => {
        const phonebookEntries = await fastify.prisma.phonebookEntry.findMany()
        return phonebookEntries
    })

    fastify.post('/', async (request, reply) => {
        const { name, email, cellphone, landlinePhone, authorId } = request.body as PhonebookEntry
        const entry = await fastify.prisma.phonebookEntry.create({
            data: { name, email, cellphone, landlinePhone, authorId }
        })
        if (entry) {
            reply.code(201)
            return entry
        }
})

fastify.put('/:id', async (request, reply) => {
    const { name, email, cellphone, landlinePhone } = request.body as PhonebookEntry
    const { id: finderId } = request.params as { id: string }
    const entry = await fastify.prisma.phonebookEntry.update({
        where: { id: finderId },
        data: { name, email, cellphone, landlinePhone }
    }).catch(() => null)
    if (entry) {
        reply.status(200)
        return entry
    }
    reply.status(404)
    return
})
}

export default routes
