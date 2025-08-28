export interface User {
  id: number;
  username: string;
  password: string;
  role: string;
  email: string;
  phone: string;
  status: "active" | "inactive";
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
