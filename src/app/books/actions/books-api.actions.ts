import { createAction, props } from "@ngrx/store";
import { BookModel } from "src/app/shared/models";


// booksLoaded
export const booksLoaded = createAction(
    '[Book API] Books Loaded Success',
    props<{books: BookModel[]}>()
);

// bookUpdated
export const bookUpdated = createAction(
    '[Book API] Book Updated Success',
    props<{book: BookModel}>()
);

// bookCreated
export const bookCreated = createAction(
    '[Book API] Book Created Success',
    props<{book: BookModel}>()
);

// bookDeleted
export const bookDeleted = createAction(
    '[Book API] Book Deleted Success',
    props<{bookId: string}>()
);