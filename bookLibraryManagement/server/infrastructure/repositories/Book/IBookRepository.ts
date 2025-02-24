import { Book } from "../../../domain/entities/Book";
import { BookAverageResponse } from "../../../domain/entities/BookAverageResponse";


export interface IBookRepository {
  getAllBooks(): Promise<Book[]>;
  getBookAverageById(id: number): Promise<BookAverageResponse | null>
  getBookById(id: number): Promise<Book | null>
}