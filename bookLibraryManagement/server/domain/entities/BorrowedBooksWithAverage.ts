export interface BorrowedBooksWithAverage {
    id: number,
    name: string,
    books: books,
}


interface books {
    past: holder[],
    present: holder[]
}

interface holder {
    name: string,
    userScore?: number,
    bookId:number
}

