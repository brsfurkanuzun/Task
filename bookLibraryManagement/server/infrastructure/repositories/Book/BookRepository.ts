import { IBookRepository } from "./IBookRepository";
import { Book } from "../../../domain/entities/Book";
import { BookAverageResponse } from "../../../domain/entities/BookAverageResponse";
import prisma from "../../../config/prismaClient";
import { Books } from "@prisma/client";

export class BookRepository implements IBookRepository {
  async getAllBooks(): Promise<Book[]> {
    const books = await prisma.books.findMany({
      select: {
        BookId: true,
        Title: true,
        Author: true,
        PublishedYear: true,
      },
    });

    return books.map((book) => ({
      BookId: book.BookId,
      Title: book.Title,
      Author: book.Author,
      PublishedYear: book.PublishedYear,
    }));
  }

  async getBookAverageById(id: number): Promise<BookAverageResponse | null> {
  const book = await prisma.books.findUnique({
    where: { BookId: id }, 
  });

    const result = await prisma.bookRatings.aggregate({
      where: {
        BorrowedBooks: {
          BookId: id,
          ReturnDate: { not: null }, 
        },
      },
      _avg: {
        Rating: true, 
      },
    });

    if (!book) {
      return null;
    }

    return {
      BookId: book.BookId,
      Title: book.Title,
      Score: result._avg.Rating ?? -1,
    };
  }

  async getBookById(id: number): Promise<Book | null> {
    const book = await prisma.books.findUnique({
      where: { BookId: id },
    });

    if (!book) {
      return null;
    }

    return {
      BookId: book.BookId,
      Title: book.Title,
      Author: book.Author,
      PublishedYear: book.PublishedYear,
    };
  }
}