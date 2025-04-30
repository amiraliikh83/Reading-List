import React from "react";
import { Book } from "./BookSearch";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "./ui/card";

const BookList = ({ books }: { books: Book[] }) => {
  const renderBookItem = (book: Book, index: number) => (
    <Card key={index}>
      <CardHeader>
        <CardTitle>{book.title}</CardTitle>
        <CardDescription>{book.author_name}</CardDescription>
      </CardHeader>
    </Card>
  );

  return (
    <div className="space-y-8 p-4">
      <h2 className="mb-4 text-2xl font-bold">Reading list </h2>
      <div>{books.map((book, index) => renderBookItem(book, index))}</div>
    </div>
  );
};

export default BookList;
