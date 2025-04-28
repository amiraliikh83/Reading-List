import axios from "axios";
import React, { useState } from "react";
import { Button } from "./ui/button";

export const BookSearch = () => {
  const [query, setQurry] = useState("");
  const [results, setResults] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  type SearchResult = {
    docs: any[];
    numFound: number;
  };

  const searchBook = async () => {
    if (!query) return;

    setIsLoading(true);
    try {
      const response = await axios.get<SearchResult>(
        `https://openlibrary.org/search.json?q${query}`,
      );

      setResults(response.data.docs);
    } catch (error) {
      console.error("Errro Fetching in Api", error);
    }
    setIsLoading(false);
  };

  return (
    <div className="p-4">
      <Button></Button>
    </div>
  );
};
