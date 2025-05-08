import { useEffect } from "react";
import { BookSearch } from "./Components/BookSearch";
import BookList from "./Components/BookList";

import { useStore } from "./store";
import { Layout } from "./Components/Layout";

const App = () => {
  const { loadBooksFromLocalStorage } = useStore((state) => state);

  useEffect(() => {
    loadBooksFromLocalStorage();
  }, [loadBooksFromLocalStorage]);
  return (
    <Layout>
      <BookSearch />
      <BookList />
    </Layout>
  );
};

export default App;
