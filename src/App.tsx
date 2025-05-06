import { useEffect } from "react";
import { BookSearch } from "./Components/BookSearch";
import BookList from "./Components/BookList";

import { useStore } from "./store";

const App = () => {
  const { loadBooksFromLocalStorage } = useStore((state) => state);

  useEffect(() => {
    loadBooksFromLocalStorage();
  }, [loadBooksFromLocalStorage]);
  return (
    <div className="container mx-auto">
      <BookSearch />
      <BookList />
    </div>
  );
};

export default App;
