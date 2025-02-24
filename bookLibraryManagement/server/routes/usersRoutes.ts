import { Router } from "express";
import { UserController } from "../controllers/userController";
import { BorrowedBooksController } from "../controllers/borrowedBooksController";
import { UserRepository } from '../infrastructure/repositories/User/UserRepository';
import { BorrowedBooksRepository } from '../infrastructure/repositories/BorrowedBooks/BorrowedBooksRepository';
import { BookRatingsRepository } from "../infrastructure/repositories/BookRatings/BookRatingsRepository";
const router = Router();
const userRepository = new UserRepository();
const bookRatingsRepository = new BookRatingsRepository();
const borrowedBooksRepository = new BorrowedBooksRepository(bookRatingsRepository, userRepository);
const userController = new UserController(userRepository, borrowedBooksRepository);
const borrowedBooksController = new BorrowedBooksController(borrowedBooksRepository);

router.get("/users", userController.getAllUsers);
router.get("/users/:id", userController.getBorrowBookHistoryByUserId);
router.post("/users/:userId/borrow/:bookId", borrowedBooksController.borrowBook);
router.post("/users/:userId/return/:bookId", borrowedBooksController.returnBook);

export default router;