import { injectable } from "tsyringe"
import { prismaClient } from "../prisma"

@injectable()
class GetUserBySocketId {
  async execute(socket_id: string) {
    const user = await prismaClient.user.findFirst({
      where: {socket_id}
    })
    return user
  }
}

export { GetUserBySocketId }
