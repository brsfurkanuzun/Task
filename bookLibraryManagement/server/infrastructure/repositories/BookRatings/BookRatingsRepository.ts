import { IBookRatingsRepository } from "./IBookRatingsRepository";
import { BookRatings } from "../../../domain/entities/BookRatings";
import prisma from "../../../config/prismaClient";
import { Prisma } from "@prisma/client";

export class BookRatingsRepository implements IBookRatingsRepository {
  async getAllBookRatings(): Promise<BookRatings[]> {
    const bookRatings = await prisma.bookRatings.findMany({
      select: {
        RatingId: true,
        BorrowId: true,
        Rating: true,
        RatingDate: true,
        BorrowedBooks:true
      },
    });

    return bookRatings.map((rating) => ({
        RatingId: rating.RatingId,
        BorrowId: rating.BorrowId,
        Rating: rating.Rating,
        RatingDate: rating.RatingDate,
    }));
  }

  async getBookRatingsById(id: number): Promise<BookRatings | null> {
    const bookRating = await prisma.bookRatings.findUnique({
      where: { RatingId: id },
    });

    if (!bookRating) {
      return null;
    }

    return {
        RatingId: bookRating.RatingId,
        BorrowId: bookRating.BorrowId,
        Rating: bookRating.Rating,
        RatingDate: bookRating.RatingDate,
    };
  }
  async rateBook(borrowId: number , rating:number): Promise<BookRatings | null> {
    const data: Prisma.BookRatingsCreateInput = {
      BorrowedBooks:  ({ connect: { BorrowId: borrowId } }),
      RatingDate: new Date().toISOString(),
      Rating: rating,
    };
    
    const rateBook = await prisma.bookRatings.create({
      data,
    });
    return rateBook;
  }
}