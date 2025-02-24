import { BookRatings } from "../../../domain/entities/BookRatings";

export interface IBookRatingsRepository {
    getAllBookRatings(): Promise<BookRatings[]>;
    getBookRatingsById(id: number): Promise<BookRatings | null>;
    rateBook(borrowId: number , rating:number): Promise<BookRatings | null> 
}