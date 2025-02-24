import { BorrowedBooks } from "../../../domain/entities/BorrowedBooks";
import { BorrowedBooksWithAverage } from "../../../domain/entities/BorrowedBooksWithAverage";


export interface IBorrowedBooksRepository {
    getAllBorrowedBooks(): Promise<BorrowedBooks[]>;
    getBorrowedBookById(id: number): Promise<BorrowedBooks | null>;
    borrowBook(bookId: number, userId: number): Promise<BorrowedBooks | null>;
    returnBook(userId: number, bookId: number, score: number): Promise<BorrowedBooks | String>
    getBorrowBookHistoryByUserId(userId: number): Promise<BorrowedBooksWithAverage | String> 
    getBorrowedBookByBookId(bookId: number): Promise<BorrowedBooks | null>
}