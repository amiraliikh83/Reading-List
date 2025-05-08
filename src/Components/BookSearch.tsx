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
import { AiOutlineLoading3Quarters } from "react-icons/ai";

import { Book, useStore } from "@/store";

type SearchResult = {
  docs: Book[];
  numFound: number;
};

export const BookSearch = () => {
  const { books, addBook } = useStore((state) => state);
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
    <div className="m-1.5 overflow-x-auto ">
      <div
        className="sm:divide-y sm:divide-gray-200 sm:rounded-2xl
      sm:border sm:dark:divide-gray-700 sm:dark:border-gray-700">
        <div className="flex flex-col items-center gap-3 px-4 py-3 sm:flex-row">
          <div className="relative w-full sm:max-w-xs">
            <Input
              type="text"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Search for your next Book!"
              onKeyUp={handleKeyPress}
            />
          </div>
          <Button
            className="max-sm:w-full sm:max-w-xs"
            onClick={() => searchBook()}
            disabled={isLoading}>
            {isLoading ? (
              <>
                <AiOutlineLoading3Quarters
                  className="mr-2
            h-4 w-4 animate-spin"
                />
                Searching ...
              </>
            ) : (
              "Search"
            )}
          </Button>
        </div>
        <div
          className="block max-h-[200px] overflow-y-auto
        sm:max-h-[300px] [&::-webkit-scrollbar-thumb]:bg-gray-300
         dark:[&::-webkit-scrollbar-thumb]:bg-slate-500
          [&::-webkit-scrollbar-track]:bg-gray-100
          dark:[&::-webkit-scrollbar-track]:bg-slate-700
        [&::-webkit-scrollbar]:w-2">
          {query.length > 0 && results.length > 0 ? (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead className="p-2">Title</TableHead>
                  <TableHead className="p-2">Author</TableHead>
                  <TableHead className="hidden sm:table-cell">Year</TableHead>
                  <TableHead className="hidden sm:table-cell">
                    Page Count
                  </TableHead>
                  <TableHead className="p-2">Invoice</TableHead>
                  <TableHead></TableHead>
                </TableRow>
              </TableHeader>
              <TableBody className="overflow-y-auto">
                {results.map((book, index) => (
                  <TableRow key={index}>
                    <TableCell>{book.title || "-"}</TableCell>
                    <TableCell>{book.author_name?.join(", ") || "-"}</TableCell>
                    <TableCell className="hidden sm:table-cell">
                      {book.first_publish_year ?? "-"}
                    </TableCell>
                    <TableCell className="hidden sm:table-cell">
                      {book.number_of_pages_median ?? "-"}
                    </TableCell>
                    <TableCell>
                      <Button
                        variant="link"
                        onClick={() =>
                          addBook({
                            key: book.key,
                            title: book.title,
                            author_name: book.author_name || [],
                            first_publish_year: book.first_publish_year ?? 0,
                            number_of_pages_median:
                              book.number_of_pages_median ?? null,
                            status: "backlog",
                          })
                        }
                        disabled={books.some((b) => b.key === book.key)}>
                        Add
                      </Button>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          ) : (
            <div className="flex max-h-60 items-center justify-center p-16">
              <p className="text-gray-600 dark:text-gray-400">
                Start your search!
              </p>
            </div>
          )}
        </div>
        <div
          className="flex w-full flex-col items-center gap-3
        border-t border-gray-200 px-6 py-4 sm:flex-row
        sm:justify-between dark:border-gray-700">
          {totalResults > 0 && (
            <p className="text-sm">
              Showing {startIndex} - {endIndex} out of {totalResults} results
            </p>
          )}
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
              currentPage >= Math.ceil(totalResults / resultsPerPage) ||
              isLoading
            }>
            Next
          </Button>
        </div>
      </div>
    </div>
  );
};
