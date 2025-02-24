import { Router } from "express";
import { BookRepository } from "../infrastructure/repositories/Book/BookRepository";
import { BookController } from "../controllers/bookController";
import { BorrowedBooksController } from "../controllers/borrowedBooksController";
import { BorrowedBooksRepository } from '../infrastructure/repositories/BorrowedBooks/BorrowedBooksRepository';
import { UserRepository } from '../infrastructure/repositories/User/UserRepository';
import { BookRatingsRepository } from "../infrastructure/repositories/BookRatings/BookRatingsRepository";

const router = Router();
const bookRepository = new BookRepository();
const bookController = new BookController(bookRepository);
const userRepository = new UserRepository();
const bookRatingsRepository = new BookRatingsRepository();
const borrowedBooksRepository = new BorrowedBooksRepository(bookRatingsRepository, userRepository);
const borrowedBooksController = new BorrowedBooksController(borrowedBooksRepository);


router.get("/books", bookController.getAllBooks);
router.get("/books/:id", bookController.getBookAverageById);
router.get("/booksInfo/:id", bookController.getBookById);
router.get("/users/:userId/borrow/:bookId", borrowedBooksController.borrowBook);
router.get("/borrowById/:bookId", borrowedBooksController.getBorrowedBookByBookId);

export default router;