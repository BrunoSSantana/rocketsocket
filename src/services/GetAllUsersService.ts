import { injectable } from "tsyringe";
import { prismaClient } from "../prisma";

@injectable()
class GetAllUsersService {
  async execute() {
    const users = await prismaClient.user.findMany()
    return users
  }
}

export { GetAllUsersService }