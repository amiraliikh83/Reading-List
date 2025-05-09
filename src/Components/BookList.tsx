import {
  Card,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "./ui/card";
import { Button } from "./ui/button";
import { Book, useStore } from "@/store";
import {
  DragDropContext,
  Draggable,
  Droppable,
  DropResult,
} from "react-beautiful-dnd";
import { StrictModeDroppable } from "./StrictModeDroppable";
import {
  GiBookPile,
  GiBookshelf,
  GiBookmarklet,
  GiBurningBook,
} from "react-icons/gi";

import { Tooltip, TooltipContent, TooltipTrigger } from "./ui/tooltip";

const BookList = () => {
  const { books, removeBook, moveBook, reorderBooks } = useStore(
    (state) => state,
  );

  const moveToList = (book: Book, targetList: Book["status"]) => {
    moveBook(book, targetList);
  };

  const renderBookItem = (
    book: Book,
    index: number,
    listType: Book["status"],
  ) => (
    <Card
      key={index}
      className="rounded-none first:mt-0 first:rounded-t-lg last:rounded-b-lg">
      <CardHeader>
        <CardTitle>{book.title}</CardTitle>
        <CardDescription>{book.author_name}</CardDescription>
      </CardHeader>
      <CardFooter className="flex justify-between">
        <Tooltip>
          <TooltipTrigger asChild>
            <Button variant="destructive" onClick={() => removeBook(book)}>
              Remove
            </Button>
          </TooltipTrigger>
          <TooltipContent>Delete from my reading list </TooltipContent>
        </Tooltip>
        <div className="inline-flex gap-2">
          <Tooltip>
            <TooltipTrigger asChild>
              <Button
                variant="outline"
                onClick={() => moveToList(book, "inProgress")}
                disabled={listType === "inProgress"}>
                In Progress
              </Button>
            </TooltipTrigger>
            <TooltipContent>Mark as "Currently Reading"</TooltipContent>
          </Tooltip>
          <Tooltip>
            <TooltipTrigger asChild>
              <Button
                variant="outline"
                onClick={() => moveToList(book, "backlog")}
                disabled={listType === "backlog"}>
                backlog
              </Button>
            </TooltipTrigger>
            <TooltipContent>Mark as "For Latar"</TooltipContent>
          </Tooltip>
          <Tooltip>
            <TooltipTrigger asChild>
              <Button
                variant="outline"
                onClick={() => moveToList(book, "done")}
                disabled={listType === "done"}>
                done
              </Button>
            </TooltipTrigger>
            <TooltipContent>Mark as "Done"</TooltipContent>
          </Tooltip>
        </div>
      </CardFooter>
    </Card>
  );

  const onDragEnd = (result: DropResult) => {
    if (!result.destination) return;

    const sourceIndex = result.source.index;
    const destinationIndex = result.destination.index;
    const listType = result.source.droppableId as Book["status"];

    reorderBooks(listType, sourceIndex, destinationIndex);
  };

  const renderDraggleBookList = (
    listType: Book["status"],
    books: Book[],
    renderBookItem: Function,
  ) => {
    const filteredBooks = books.filter((book) => book.status === listType);

    return (
      <StrictModeDroppable droppableId={listType}>
        {(provided) => (
          <div
            ref={provided.innerRef}
            {...provided.droppableProps}
            className="p-2 border rounded-md bg-gray-100">
            {filteredBooks.map((book, index) => (
              <Draggable key={book.key} draggableId={book.key} index={index}>
                {(provided) => (
                  <div
                    ref={provided.innerRef}
                    {...provided.draggableProps}
                    {...provided.dragHandleProps}
                    className="my-2">
                    {renderBookItem(book, index, listType)}
                  </div>
                )}
              </Draggable>
            ))}
            {provided.placeholder}
          </div>
        )}
      </StrictModeDroppable>
    );
  };

  return (
    <div className="space-y-8 p-4">
      <h2 className="mb-4 text-2xl font-bold">Reading list</h2>
      <DragDropContext onDragEnd={onDragEnd}>
        {books.filter((book) => book.status === "inProgress").length > 0 && (
          <>
            <h3 className="mb-2 text-xl font-semibold">In Progress</h3>
            {renderDraggleBookList("inProgress", books, renderBookItem)}
          </>
        )}
        {books.filter((book) => book.status === "backlog").length > 0 && (
          <>
            <h3 className="mb-2 text-xl font-semibold">Backlog</h3>
            {renderDraggleBookList("backlog", books, renderBookItem)}
          </>
        )}
      </DragDropContext>
      {books.filter((book) => book.status === "done").length > 0 && (
        <>
          <h3 className="mb-2 text-xl font-semibold">Done</h3>
          <div>
            {books
              .filter((book) => book.status === "done")
              .map((book, index) => renderBookItem(book, index, "done"))}
          </div>
        </>
      )}
    </div>
  );
};

export default BookList;
