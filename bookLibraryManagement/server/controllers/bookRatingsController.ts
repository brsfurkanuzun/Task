import { Request, Response } from "express";
import { IBookRatingsRepository } from './../infrastructure/repositories/BookRatings/IBookRatingsRepository';

export class BookRatingsController {
  private bookRatingsRepository: IBookRatingsRepository;

  constructor(bookRatingsRepository: IBookRatingsRepository) {
    this.bookRatingsRepository = bookRatingsRepository;
  }

  public getAllBookRatings = async (req: Request, res: Response): Promise<void> => {
    try {
      const users = await this.bookRatingsRepository.getAllBookRatings();
      res.json(users);
    } catch (err) {
      res.status(500).json({ error: (err as Error).message });
    }
  };

  public getBookRatingsById = async (req: Request, res: Response): Promise<void> => {
    const borrowId = parseInt(req.params.id, 10);
    try {
      const book = await this.bookRatingsRepository.getBookRatingsById(borrowId);
      if (!book) {
        res.status(404).json({ message: "Book not found" });
        return;
      }
      res.json(book);
    } catch (err) {
      res.status(500).json({ error: (err as Error).message });
    }
  };
}