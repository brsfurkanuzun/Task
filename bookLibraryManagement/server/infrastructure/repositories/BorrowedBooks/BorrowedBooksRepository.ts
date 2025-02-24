import { IBorrowedBooksRepository } from "./IBorrowedBooksRepository";
import { BorrowedBooks } from "../../../domain/entities/BorrowedBooks";
import { BorrowedBooksWithAverage } from "../../../domain/entities/BorrowedBooksWithAverage";

import prisma from "../../../config/prismaClient";
import { Prisma } from "@prisma/client";
import { IBookRatingsRepository } from "../BookRatings/IBookRatingsRepository";
import { IUserRepository } from "../User/IUserRepository";

export class BorrowedBooksRepository implements IBorrowedBooksRepository {

  private bookRatingsRepository: IBookRatingsRepository;
  private userRepository: IUserRepository;


  constructor(bookRatingsRepository: IBookRatingsRepository, userRepository: IUserRepository) {
    this.bookRatingsRepository = bookRatingsRepository;
    this.userRepository = userRepository;

  }

  async getAllBorrowedBooks(): Promise<BorrowedBooks[]> {
    const borrowedBooks = await prisma.borrowedBooks.findMany({
      select: {
        BorrowId: true,
        UserId: true,
        BookId: true,
        BorrowDate: true,
        ReturnDate: true
      },
    });

    return borrowedBooks.map((book) => ({
      BorrowId: book.BorrowId,
      UserId: book.UserId,
      BookId: book.BookId,
      BorrowDate: book.BorrowDate,
      ReturnDate: book.ReturnDate,
    }));
  }

  async getBorrowedBookById(id: number): Promise<BorrowedBooks | null> {
    const borrowedBook = await prisma.borrowedBooks.findUnique({
      where: { BorrowId: id },
    });

    if (!borrowedBook) {
      return null;
    }

    return {
      BorrowId: borrowedBook.BorrowId,
      UserId: borrowedBook.UserId,
      BookId: borrowedBook.BookId,
      BorrowDate: borrowedBook.BorrowDate,
      ReturnDate: borrowedBook.ReturnDate,
    };
  }
  async borrowBook(userId: number, bookId: number): Promise<BorrowedBooks | null> {


    const isBookAvailable = await this.getBorrowedBookByBookId(bookId);
    if (isBookAvailable) {
      return null; 
    }

    const data: Prisma.BorrowedBooksCreateInput = {
      Users: ({ connect: { UserId: userId } }),
      Books: ({ connect: { BookId: bookId } }),
      BorrowDate: new Date().toISOString(),
      ReturnDate: null,
    };

    const borrowedBook = await prisma.borrowedBooks.create({
      data,
    });

    if (!borrowedBook) {
      return null;
    }

    return {
      BorrowId: borrowedBook.BorrowId,
      UserId: borrowedBook.UserId,
      BookId: borrowedBook.BookId,
      BorrowDate: borrowedBook.BorrowDate,
      ReturnDate: borrowedBook.ReturnDate,
    };

  }
  async returnBook(userId: number, bookId: number, score: number): Promise<BorrowedBooks | String> {
    const isBookAvailable = await this.getBorrowedBookByBookId(bookId);
    if (isBookAvailable === null) return "Book is not borrowed";
    if (isBookAvailable.UserId !== userId) return "Book is not borrowed by you";
    const data: Prisma.BorrowedBooksUpdateInput = {
      ReturnDate: new Date().toISOString(),
    };



    const updatedBook = await prisma.borrowedBooks.update({
      where: { BorrowId: isBookAvailable.BorrowId },
      data: {
        ReturnDate: new Date(),
      },
    });

    if (!updatedBook) {
      return "Error in updating table";
    }
    const dataRating: Prisma.BookRatingsCreateInput = {
      Rating: score,
      RatingDate: new Date().toISOString(),
      BorrowedBooks: ({ connect: { BorrowId: updatedBook.BorrowId } }),
    };

    const bookRating = await this.bookRatingsRepository.rateBook(updatedBook.BorrowId, score);


    if (!bookRating) {
      return 'Error in rating';
    }
    return {
      BorrowId: updatedBook.BorrowId,
      UserId: updatedBook.UserId,
      BookId: updatedBook.BookId,
      BorrowDate: updatedBook.BorrowDate,
      ReturnDate: updatedBook.ReturnDate,
    };
  }


  async getBorrowBookHistoryByUserId(userId: number): Promise<BorrowedBooksWithAverage | String> {
    const user = await this.userRepository.getUserById(userId);


    if (!user) {
      return "User not found";
    }

    const borrowedBooks = await prisma.borrowedBooks.findMany({
      where: {
        UserId: userId,
      },
      include: {
        Books: true,
        BookRatings: true,

      },
    });



    return {
      id: userId, name: user.Name, books: {
        past: borrowedBooks.filter((book) => book.ReturnDate !== null).map((book) => ({ name: book.Books.Title, bookId:book.Books.BookId, userScore: book.BookRatings.find(x => x.BorrowId === book.BorrowId)?.Rating })),
        present: borrowedBooks.filter((book) => book.ReturnDate === null).map((book) => ({ name: book.Books.Title,bookId:book.Books.BookId, }))

      }
    };
  }


  async getBorrowedBookByBookId(bookId: number): Promise<BorrowedBooks | null> {
    const borrowedBook = await prisma.borrowedBooks.findFirst({
      where: { BookId: bookId, ReturnDate: { equals: null } },
    });

    return borrowedBook;

  }
}