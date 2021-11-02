import { injectable } from "tsyringe";
import { prismaClient } from "../prisma";

interface CreateUserDTO {
  email: string
  socket_id: string
  avatar: string
  name: string

}

@injectable()
class CreateUserService {
  async execute({ avatar, socket_id, email, name }: CreateUserDTO) {
    const userAlreadyExists = await prismaClient.user.findUnique({
      where: { email }
    })

    if (userAlreadyExists) {
      const user = await prismaClient.user.update({
        where: { email },
        data: { socket_id, avatar, name }
      })
      return user
    }
    else {
      const user = await prismaClient.user.create({
        data: { avatar, email, socket_id, name }
      })
    }
  }
}

export { CreateUserService }