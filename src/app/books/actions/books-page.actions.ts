import { createAction, props } from "@ngrx/store";
import { BookRequiredProps } from "src/app/shared/models";


// enterAction
export const enterBook = createAction(
    "[Books Page] Enter"
);

// selectAction
export const selectBook = createAction(
    "[Books Page] Select",
    props<{ bookId: string }>()
);

// clearAction
export const clearSelectedBook = createAction(
    "[Books Page] Clear Selected Book"
  );

// createAction
export const createBook = createAction(
    "[Books Page] Create",
    (book: BookRequiredProps) => ({ book })
);

// updateAction
export const updateBook = createAction(
    "[Books Page] Update",
    props<{ bookId: string; bookChanges: BookRequiredProps }>()
);

// deleteAction
export const deleteBook = createAction(
    "[Books Page] Delete",
    props<{ bookId: string;}>()
);