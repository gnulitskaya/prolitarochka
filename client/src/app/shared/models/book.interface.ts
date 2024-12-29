export interface Book {
  id?: string;
  title: string;
  author: string;
  thoughts: string;
  rating: number;
  userId: string;
  createdAt: Date;
  updatedAt: Date;
}
