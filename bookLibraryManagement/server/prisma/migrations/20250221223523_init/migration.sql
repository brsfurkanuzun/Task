BEGIN TRY

BEGIN TRAN;

-- CreateTable
CREATE TABLE [dbo].[Users] (
    [UserId] INT NOT NULL IDENTITY(1,1),
    [Name] NVARCHAR(100) NOT NULL,
    CONSTRAINT [Users_pkey] PRIMARY KEY CLUSTERED ([UserId])
);

-- CreateTable
CREATE TABLE [dbo].[Books] (
    [BookId] INT NOT NULL IDENTITY(1,1),
    [Title] NVARCHAR(255) NOT NULL,
    [Author] NVARCHAR(255) NOT NULL,
    [PublishedYear] INT,
    CONSTRAINT [Books_pkey] PRIMARY KEY CLUSTERED ([BookId])
);

-- CreateTable
CREATE TABLE [dbo].[BorrowedBooks] (
    [BorrowId] INT NOT NULL IDENTITY(1,1),
    [UserId] INT NOT NULL,
    [BookId] INT NOT NULL,
    [BorrowDate] DATETIME2 NOT NULL,
    [ReturnDate] DATETIME2,
    CONSTRAINT [BorrowedBooks_pkey] PRIMARY KEY CLUSTERED ([BorrowId])
);

-- CreateTable
CREATE TABLE [dbo].[BookRatings] (
    [RatingId] INT NOT NULL IDENTITY(1,1),
    [BorrowId] INT NOT NULL,
    [Rating] INT NOT NULL,
    [RatingDate] DATETIME2 NOT NULL,
    CONSTRAINT [BookRatings_pkey] PRIMARY KEY CLUSTERED ([RatingId])
);

-- AddForeignKey
ALTER TABLE [dbo].[BorrowedBooks] ADD CONSTRAINT [BorrowedBooks_UserId_fkey] FOREIGN KEY ([UserId]) REFERENCES [dbo].[Users]([UserId]) ON DELETE NO ACTION ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE [dbo].[BorrowedBooks] ADD CONSTRAINT [BorrowedBooks_BookId_fkey] FOREIGN KEY ([BookId]) REFERENCES [dbo].[Books]([BookId]) ON DELETE NO ACTION ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE [dbo].[BookRatings] ADD CONSTRAINT [BookRatings_BorrowId_fkey] FOREIGN KEY ([BorrowId]) REFERENCES [dbo].[BorrowedBooks]([BorrowId]) ON DELETE NO ACTION ON UPDATE CASCADE;

COMMIT TRAN;

END TRY
BEGIN CATCH

IF @@TRANCOUNT > 0
BEGIN
    ROLLBACK TRAN;
END;
THROW

END CATCH
