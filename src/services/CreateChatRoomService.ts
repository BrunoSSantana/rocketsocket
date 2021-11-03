import { injectable } from "tsyringe";
import { prismaClient } from "../prisma";

@injectable()
class CreateChatRoomService {
  async execute(idUsers: string[]) {
    const room = await prismaClient.room.create({
      data: {
        user: {
          connect: [{id: idUsers[0]}, {id: idUsers[1]}]
        }
      }
    })
    return room
  }
}

export { CreateChatRoomService }