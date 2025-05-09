import { useEffect } from "react";
import { BookSearch } from "./Components/BookSearch";
import BookList from "./Components/BookList";
import { useStore } from "./store";
import { Layout } from "./Components/Layout";
import { TooltipProvider } from "@radix-ui/react-tooltip";

const App = () => {
  const { loadBooksFromLocalStorage } = useStore((state) => state);

  useEffect(() => {
    loadBooksFromLocalStorage();
  }, [loadBooksFromLocalStorage]);
  return (
    <Layout>
      <BookSearch />
      <TooltipProvider>
        <BookList />
      </TooltipProvider>
    </Layout>
  );
};

export default App;
