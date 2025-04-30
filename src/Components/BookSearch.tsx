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
import { response } from "express";

export type Book = {
  key: string;
  title: string;
  author_name?: string[];
  first_publish_year?: number;
  number_of_pages_median?: number | null;
  status: "done" | "inProgress" | "backlog";
};

type SearchResult = {
  docs: Book[];
  numFound: number;
};

export const BookSearch = ({
  onAddBook,
}: {
  onAddBook: (Book: Book) => void;
}) => {
  const [query, setQuery] = useState("");
  const [results, setResults] = useState<Book[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [totalResults, setTotalResults] = useState(0);
  const [currentPage, setCurrentPage] = useState(1);
  const resultsPerPage = 100;

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
      console.error("Error Fetching API", error);
    }
    setIsLoading(false);
  };

  const handleKeyPress = (event: React.KeyboardEvent) => {
    if (event.key === "Enter") {
      searchBook();
    }
  };

  const handlePreviousClick = () => {
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
      <div className="sm:max-w-xs mb-2">
        <Input
          type="text"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Search for your next Book!"
          onKeyUp={handleKeyPress}
        />
      </div>
      <Button onClick={() => searchBook()} disabled={isLoading}>
        {isLoading ? "Searching..." : "Search"}
      </Button>

      {totalResults > 0 && (
        <div className="mt-2">
          <p>
            Showing {startIndex} - {endIndex} out of {totalResults} results
          </p>
        </div>
      )}

      <div className="mt-4 max-h-64 overflow-auto">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead className="p-2">Title</TableHead>
              <TableHead className="p-2">Author</TableHead>
              <TableHead className="p-2">Year</TableHead>
              <TableHead className="p-2">Page Count</TableHead>
              <TableHead className="p-2">Invoice</TableHead>
              <TableHead></TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {results.map((book, index) => (
              <TableRow key={index}>
                <TableCell>{book.title || "-"}</TableCell>
                <TableCell>{book.author_name?.join(", ") || "-"}</TableCell>
                <TableCell>{book.first_publish_year ?? "-"}</TableCell>
                <TableCell>{book.number_of_pages_median ?? "-"}</TableCell>
                <TableCell>
                  <Button
                    variant="link"
                    onClick={() =>
                      onAddBook({
                        key: book.key,
                        title: book.title,
                        author_name: book.author_name || [],
                        first_publish_year: book.first_publish_year ?? 0,
                        number_of_pages_median:
                          book.number_of_pages_median ?? null,
                        status: "backlog",
                      })
                    }>
                    Add
                  </Button>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>

      <div className="mt-4 flex items-center justify-between">
        <Button
          variant="outline"
          onClick={handlePreviousClick}
          disabled={currentPage <= 1 || isLoading}>
          Previous
        </Button>
        <span>Page {currentPage}</span>
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
