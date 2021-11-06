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

    // console.log('The ROOMS: ', room);

    return room[0]

    // if (getChatMyUser0) {
    //   const room = await prismaClient.usersOnRooms.findMany({
    //     where: {
    //       user: {
    //         id: { in: usersId[1] }
    //       }
    //     }
    //   })
    //   return room
    // }

  }
}

export { GetChatRoomByUsersService }
