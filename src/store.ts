import { create } from "zustand";

export type Book = {
  key: string;
  title: string;
  author_name?: string[];
  first_publish_year?: number;
  number_of_pages_median?: number | null;
  status: "done" | "inProgress" | "backlog";
};

interface Bookstate {
  books: Book[];
}

interface BookStore extends Bookstate {
  addBook: (newBook: Book) => void;
  removeBook: (bookToRemove: Book) => void;
  moveBook: (bookToMove: Book, newStatus: Book["status"]) => void;
  loadBooksFromLocalStorage: () => void;
  reorderBooks: (
    listType: Book["status"],
    startIndex: number,
    endIndex: number,
  ) => void;
}

export const useStore = create<BookStore>((set, get) => ({
  books: [],

  addBook: (newBook) =>
    set((state) => {
      const updatedBooks = [...state.books, newBook];
      localStorage.setItem("readingList", JSON.stringify(updatedBooks));
      return { books: updatedBooks };
    }),

  removeBook: (bookToRemove) =>
    set((state) => {
      const updatedBooks = state.books.filter(
        (book) => book.key !== bookToRemove.key,
      );
      localStorage.setItem("readingList", JSON.stringify(updatedBooks));
      return { books: updatedBooks };
    }),

  moveBook: (bookToMove, newStatus) =>
    set((state) => {
      const updatedBooks = state.books.map((book) =>
        book.key === bookToMove.key ? { ...book, status: newStatus } : book,
      );
      localStorage.setItem("readingList", JSON.stringify(updatedBooks));
      return { books: updatedBooks };
    }),
  reorderBooks: (
    listType: Book["status"],
    startIndex: number,
    endIndex: number,
  ) =>
    set((state: Bookstate) => {
      const filteredBooks = state.books.filter(
        (book) => book.status === listType,
      );
      const [reorderedBook] = filteredBooks.splice(startIndex, 1);

      filteredBooks.splice(endIndex, 0, reorderedBook);

      const updatedBooks = state.books.map((book) =>
        book.status === listType ? filteredBooks.shift() || book : book,
      );
      localStorage.setItem("readingList", JSON.stringify(updatedBooks));
      return { books: updatedBooks };
    }),

  loadBooksFromLocalStorage: () => {
    const storedBooks = localStorage.getItem("readingList");
    const books: Book[] = storedBooks ? JSON.parse(storedBooks) : [];
    set({ books });
  },
}));
