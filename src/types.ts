export interface User {
  id: number;
  username: string;
  password: string;
  role: string;
  email: string;
}

export interface Book {
  id: number;
  title: string;
  author: string;
  image: string;
  description: string;
  borrowed_by: number[];
  favorited_by: number[];
  isFavorite: boolean;
}

export interface BorrowedBookWithUser {
  book: Book;
  borrowedBy: Array<{
    id: number;
    username: string;
    email: string;
  }>;
}

export interface ReturnedBookWithUser {
  book: Book;
  returnedBy: Array<{
    id: number;
    username: string;
    email: string;
  }>;
}
