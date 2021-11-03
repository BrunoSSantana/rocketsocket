import { injectable } from "tsyringe";
import { prismaClient } from "../prisma";

@injectable()
class CreateChatRoomService {
  async execute(idUsers: string[]) {
    // cria room
    const room = await prismaClient.room.create({
      data: {}
    })
    console.log('roomCreate', room);

    // conecta room com primeiro usuário
    const roomOnRooms1 = await prismaClient.usersOnRooms.create({
      data: {
        room: {
          connect: { id: room.id }
        },
        user: {
          connect: { id: idUsers[0] }
        }
      }
    })
    console.log('Room1', roomOnRooms1)
    // conecta room com segundo usuário
    const roomOnRooms2 = await prismaClient.usersOnRooms.create({
      data: {
        room: {
          connect: { id: room.id }
        },
        user: {
          connect: { id: idUsers[1] }
        }
      }
    })
    console.log('Room2',roomOnRooms2)

    return room
  }
}

export { CreateChatRoomService }