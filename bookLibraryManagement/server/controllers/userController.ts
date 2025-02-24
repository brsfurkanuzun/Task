import { Request, Response } from "express";
import { IUserRepository } from './../infrastructure/repositories/User/IUserRepository';
import { IBorrowedBooksRepository } from './../infrastructure/repositories/BorrowedBooks/IBorrowedBooksRepository';

export class UserController {
  private userRepository: IUserRepository;
  private borrowedBooksRepository: IBorrowedBooksRepository;


  constructor(userRepository: IUserRepository,borrowedBooksRepository: IBorrowedBooksRepository) {
    this.userRepository = userRepository;
    this.borrowedBooksRepository = borrowedBooksRepository;

  }

  public getAllUsers = async (req: Request, res: Response): Promise<void> => {
    try {
      const users = await this.userRepository.getAllUsers();

      res.json(users.map((user) => ({id: user.UserId, name: user.Name})));

      }
     catch (err) {
      res.status(500).json({ error: (err as Error).message });
    }
  };

  public getBorrowBookHistoryByUserId = async (req: Request, res: Response): Promise<void> => {
    const userId = parseInt(req.params.id, 10);
    try {
      const user = await this.borrowedBooksRepository.getBorrowBookHistoryByUserId(userId);
      if (!user) {
        res.status(404).json({ message: "Book not found" });
        return;
      }
      res.json(user);
    } catch (err) {
      res.status(500).json({ error: (err as Error).message });
    }
  };
}