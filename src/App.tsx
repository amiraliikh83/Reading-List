import React, { useEffect, useState } from "react";
import { Book, BookSearch } from "./Components/BookSearch";
import BookList from "./Components/BookList";

const App = () => {
  const [books, setBooks] = useState<Book[]>([]);

  useEffect(() => {
    const storedBooks = localStorage.getItem("readingList");
    if (storedBooks) {
      setBooks(JSON.parse(storedBooks));
    }
  }, []);

  const addBook = (newBook: Book) => {
    const updatedBooks: Book[] = [...books, { ...newBook, status: "backlog" }];
    setBooks(updatedBooks);
    localStorage.setItem("readingList", JSON.stringify(updatedBooks));
  };

  const moveBook = (bookToMove: Book, newStatus: Book["status"]) => {
    // const updatedBooks: Book[] = [...books, { ...newBook, status: "backlog" }] 01:05:42;
  };

  return (
    <div className="container mx-auto">
      <BookSearch onAddBook={addBook} />
      <BookList books={books} />
    </div>
  );
};

export default App;
