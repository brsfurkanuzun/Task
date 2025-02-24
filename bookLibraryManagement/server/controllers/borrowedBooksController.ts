import { Request, Response } from "express";
import { IBorrowedBooksRepository } from './../infrastructure/repositories/BorrowedBooks/IBorrowedBooksRepository';

export class BorrowedBooksController {
  private borrowedBooksRepository: IBorrowedBooksRepository;

  constructor(borrowedBooksRepository: IBorrowedBooksRepository) {
    this.borrowedBooksRepository = borrowedBooksRepository;
  }

  public getAllBorrowedBooks = async (req: Request, res: Response): Promise<void> => {
    try {
      const users = await this.borrowedBooksRepository.getAllBorrowedBooks();
      res.json(users);
    } catch (err) {
      res.status(500).json({ error: (err as Error).message });
    }
  };

  public getBorrowedBookById = async (req: Request, res: Response): Promise<void> => {
    const borrowId = parseInt(req.params.id, 10);
    try {
      const book = await this.borrowedBooksRepository.getBorrowedBookById(borrowId);
      if (!book) {
        res.status(404).json({ message: "Book not found" });
        return;
      }
      res.json(book);
    } catch (err) {
      res.status(500).json({ error: (err as Error).message });
    }
  };
  public borrowBook = async (req: Request, res: Response): Promise<void> => {
    const userId = parseInt(req.params.userId, 10);
    const bookId = parseInt(req.params.bookId, 10);
    try {
      const book = await this.borrowedBooksRepository.borrowBook(userId, bookId);
      if (!book) {
        res.status(404).json({ message: "This book is not available for borrow at this moment." });
        return;
      }
      res.json(book);
    } catch (err) {
      res.status(500).json({ error: (err as Error).message });
    }
  };
  public returnBook = async (req: Request, res: Response): Promise<void> => {
    const userId = parseInt(req.params.userId, 10);
    const bookId = parseInt(req.params.bookId, 10);
    const rating = parseInt(req.body.score , 10);
    try {
      const book = await this.borrowedBooksRepository.returnBook(userId, bookId, rating);
      if (typeof(book) === 'string') {
        res.status(404).json({ message: book});
        return;
      }
      res.json(book);
    } catch (err) {
      res.status(500).json({ error: (err as Error).message });
    }
  };
  public getBorrowedBookByBookId = async (req: Request, res: Response): Promise<void> => {
    const bookId = parseInt(req.params.bookId, 10);
    try {
      const book = await this.borrowedBooksRepository.getBorrowedBookByBookId(bookId);
      
      res.json(book);
    } catch (err) {
      res.status(500).json({ error: (err as Error).message });
    }
  };
}