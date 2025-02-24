export interface BorrowedBooks {
    BorrowId: number,
    UserId: number,
    BookId: number,
    BorrowDate: Date,
    ReturnDate: Date | null,
    }