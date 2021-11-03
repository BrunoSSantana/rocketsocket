import { injectable } from 'tsyringe';
import { prismaClient } from '../prisma';

interface CreateMessageDTO {
  to: string
  text: string
  room_id: string
}

@injectable()
class CreateMessageService {
  async execute({ room_id, text, to }: CreateMessageDTO) {
    const message = await prismaClient.message.create({
      data: {
        user_id: to,
        text,
        room_id
      }
    })
    return message
  }
}

export { CreateMessageService }
