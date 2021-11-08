import { prismaClient } from "../prisma"

class GetChatRoomByUsersService {
  async execute(usersId: string[]) {
    const room = await prismaClient.room.findMany({
      where: {
        AND: [
          {
            users: {
              some: {
                user_id: usersId[0]
              }
            }
          },
          {
            users: {
              some: {
                user_id: usersId[1]
              }
            }
          }
        ]
      }
    })

    return room[0]

  }
}

export { GetChatRoomByUsersService }
