import { injectable } from "tsyringe";
import { prismaClient } from "../prisma";

@injectable()
class GetMessageByChatRoomService {
  async execute(roomId: string) {
    
    const messages = await prismaClient.message.findMany({
      where: {
        roomId
      },
      select: {
        id: true,
        to: true,
        text: true,
        roomId: true,
        userId: true

      }
    })
    
    return messages
  }
}

export { GetMessageByChatRoomService }
