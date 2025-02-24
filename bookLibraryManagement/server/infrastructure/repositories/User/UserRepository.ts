import { IUserRepository } from "./IUserRepository";
import prisma from "../../../config/prismaClient";
import { User } from './../../../domain/entities/User';

export class UserRepository implements IUserRepository {
  async getAllUsers(): Promise<User[]> {
    const users = await prisma.users.findMany({
      select: {
        UserId: true,
        Name: true,
      },
    });

    return users.map((user) => ({
        UserId: user.UserId,
        Name: user.Name,
    }));
  }

  async getUserById(id: number): Promise<User | null> {
    const user = await prisma.users.findUnique({
      where: { UserId: id },
    });

    if (!user) {
      return null;
    }

    return {
        UserId: user.UserId,
        Name: user.Name,
    };
  }
}