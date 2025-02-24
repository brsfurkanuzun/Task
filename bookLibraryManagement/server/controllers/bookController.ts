import { Request, Response } from "express";
import { IBookRepository } from './../infrastructure/repositories/Book/IBookRepository';

export class BookController {
  private bookRepository: IBookRepository;

  constructor(bookRepository: IBookRepository) {
    this.bookRepository = bookRepository;
  }

  public getAllBooks = async (req: Request, res: Response): Promise<void> => {
    try {
      const books = await this.bookRepository.getAllBooks();
      res.json(books);
    } catch (err) {
      res.status(500).json({ error: (err as Error).message });
    }
  };
  public getBookById = async (req: Request, res: Response): Promise<void> => {
    const bookId = parseInt(req.params.id, 10);
    try {
      const book = await this.bookRepository.getBookById(bookId);
      res.json(book);
    } catch (err) {
      res.status(500).json({ error: (err as Error).message });
    }
  };

  public getBookAverageById = async (req: Request, res: Response): Promise<void> => {
    const bookId = parseInt(req.params.id, 10);
    try {
      const book = await this.bookRepository.getBookAverageById(bookId);
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