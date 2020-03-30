import { createReducer, on, Action, createSelector } from "@ngrx/store";
import { BookModel, calculateBooksGrossEarnings } from "src/app/shared/models";
import { BooksPageActions, BooksApiActions } from "src/app/books/actions";
import { stat } from 'fs';

const createBook = (books: BookModel[], book: BookModel) => [...books, book];
const updateBook = (books: BookModel[], changes: BookModel) =>
  books.map(book => {
    return book.id === changes.id ? Object.assign({}, book, changes) : book;
  });
const deleteBook = (books: BookModel[], bookId: string) =>
  books.filter(book => bookId !== book.id);

export interface State {
    collection: BookModel[],
    activeBookId: string | null;
};

export const initialState: State = {
    collection: [],
    activeBookId: null
};

// Create reducer function
export const booksReducer = createReducer(
    initialState,
    on(BooksPageActions.enterBook, 
       BooksPageActions.clearSelectedBook, 
       (state, action) => {
        return {
        ...state,
        activeBookId: null
        };
    }),
    on(BooksPageActions.selectBook, (state, action) => {
        return {
            ...state,
            activeBookId: action.bookId
        };
    }),
    on(BooksApiActions.booksLoaded, (state, action) => {
      return {
        ...state,
        collection: action.books
      };
    }),
    on(BooksApiActions.bookCreated, (state, action) => {
      return {
        collection: createBook(state.collection, action.book),
        activeBookId: null
      };
    }),
    on(BooksApiActions.bookUpdated, (state, action) => {
      return {
        collection: updateBook(state.collection, action.book),
        activeBookId: null
      };
    }),
    on(BooksApiActions.bookDeleted, (state, action) => {
      return {
        ...state,
        collection: deleteBook(state.collection, action.bookId)
      };
    })
);

export function reducer(state: undefined | State, action: Action) {
    return booksReducer(state, action);
};

// Getter selectors
export const selectAll = (state: State) => state.collection;
export const selectActiveBookId = (state: State) => state.activeBookId;

//Complex selectors
export const selectActiveBook_unoptimized = (state: State) => {
    //Inputs
    const books = selectAll(state);
    const activeBookId = selectActiveBookId(state);

    // Computation
    return books.find(book => book.id === activeBookId);
};

//   |
//   v
// Redunced to

// If either of the selectAll or selectActiveBookId change (NgRx will constantly scan)
// NgRx will then re-run the selector.  Otherwise NgRx will return a cached version
//
// The selector function can take up to 8 functions acting as inputs (not specifically defined to 8)
// The last parameter is the computation that will occur based on the inputs
export const selectActiveBook = createSelector(
    selectAll,
    selectActiveBookId,
    (books, selectActiveBookId) => {
        return books.find(book => book.id === selectActiveBookId);
    }
);


export const selectEarningsTotals_unoptimized = (state: State) => {
    const books = selectAll(state);

    return calculateBooksGrossEarnings(books);
};

//   |
//   v
// Redunced to

export const selectEarningsTotals = createSelector(
    selectAll,
    calculateBooksGrossEarnings
);