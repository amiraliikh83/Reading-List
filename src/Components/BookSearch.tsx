import axios from "axios";
import React, { useState } from "react";
import { Button } from "./ui/button";
import { Input } from "./ui/input";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "./ui/table";

export type Book = {
  key: string;
  title: string;
  author_name: string;
  first_publish_year: string;
  number_of_pages_median: string;
  status: "done" | "inProgress" | "backlog";
};

export const BookSearch = () => {
  const [query, setQuery] = useState("");
  const [results, setResults] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [totalResults, setTotalResults] = useState(0);
  const [currentPage, setCurrentPage] = useState(1);
  const resultsPerPage = 100;

  type SearchResult = {
    docs: Book[];
    numFound: number;
  };

  const searchBook = async (page: number = 1) => {
    if (!query) return;

    setIsLoading(true);
    try {
      const response = await axios.get<SearchResult>(
        `https://openlibrary.org/search.json?q=${query}&page=${page}&limit=${resultsPerPage}`,
      );

      setResults(response.data.docs);
      setTotalResults(response.data.numFound);
      setCurrentPage(page);
    } catch (error) {
      console.error("Errro Fetching in Api", error);
    }
    setIsLoading(false);
  };

  const handleKeyPress = (event: React.KeyboardEvent) => {
    if (event.key === "Enter ") {
      searchBook();
    }
  };

  const handlePerviouseClick = () => {
    if (currentPage > 1) {
      searchBook(currentPage - 1);
    }
  };

  const handleNextClick = () => {
    if (currentPage < Math.ceil(totalResults / resultsPerPage)) {
      searchBook(currentPage + 1);
    }
  };

  const startIndex = (currentPage - 1) * resultsPerPage + 1;

  const endIndex = Math.min(startIndex + resultsPerPage - 1, totalResults);

  return (
    <div className="p-4">
      <div className="sm:max-w-xs">
        <Input
          type="text"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="search for you next Book!"
          onKeyUp={handleKeyPress}
        />
      </div>
      <Button onClick={(e) => searchBook()} disabled={isLoading}>
        {isLoading ? "Searching ..." : "Search"}
      </Button>
      <div className="mt-2">
        {totalResults > 0 && (
          <p className="text-sum">
            Showing {startIndex} - {endIndex} out of {totalResults} results
          </p>
        )}
        </div>
      <div className="mt-4 max-h-64 overflow-auto">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead className="p-2">Title</TableHead>
              <TableHead className="p-2">Author</TableHead>
              <TableHead className="p-2">Year</TableHead>
              <TableHead className="p-2">Page Count</TableHead>
              <TableHead className="p-2">Invoice</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {results.map((book, index) => (
              <TableRow key={index}>
                <TableCell>{book.title}</TableCell>
                <TableCell>{book.author_name}</TableCell>
                <TableCell>{book.first_publish_year}</TableCell>
                <TableCell>{book.number_of_pages_median || "-"}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
      <div className="mt-4 flex items-center justify-between">
        <Button
          variant="outline"
          onClick={handlePerviouseClick}
          disabled={currentPage <= 1 || isLoading}></Button>
        <span>page {currentPage}</span>
        <Button
          variant="outline"
          onClick={handleNextClick}
          disabled={
            currentPage >= Math.ceil(totalResults / resultsPerPage) || isLoading
          }>
          Next
        </Button>
      </div>
    </div>
  );
};
