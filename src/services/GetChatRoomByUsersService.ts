import { prismaClient } from "../prisma"

class GetChatRoomByUsersService {
  async execute(usersId: string[]) {
    const getChatMyUser0 = await prismaClient.usersOnRooms.findMany({
      where: {
        user: {
          id: {in: usersId[0]}
        }
      }
    })
    if (getChatMyUser0) {
      const room = await prismaClient.usersOnRooms.findMany({
        where: {
          user: {
            id: {in: usersId[1]}
          }
        }
      })
      return room
    }
  }
}

export { GetChatRoomByUsersService }
