import React, { useEffect, useState } from "react";
import { Book, BookSearch } from "./Components/BookSearch";

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

  return (
    <div className="container mx-auto">
      <BookSearch onAddBook={addBook} />
    </div>
  );
};

export default App;
