import { injectable } from "tsyringe";
import { prismaClient } from "../prisma";

@injectable()
class GetChatRoomByIdService {
  async execute(idChatRoom: string) {
    const room = await prismaClient.room.findUnique({
      where: {
        id: idChatRoom
      },
      include: {
        users: {
          include: {user: true},
        },
      }
    })
    return room
  }
}

export { GetChatRoomByIdService }
