import { ActionReducerMap, createSelector, MetaReducer } from "@ngrx/store";
import * as fromAuth from "./auth.reducer";
import * as fromBooks from "./books.reducer";

export interface State {
    auth: fromAuth.State;
    books: fromBooks.State;
}

export const reducers: ActionReducerMap<State> = {
    auth: fromAuth.reducer,
    books: fromBooks.reducer
  };

export const metaReducers: MetaReducer<State>[] = [];

/**
 * Auth Selectors
 */
export const selectAuthState = (state: State) => state.auth;

export const selectGettingAuthStatus = createSelector(
  selectAuthState,
  fromAuth.selectGettingStatus
);

export const selectAuthUser = createSelector(
  selectAuthState,
  fromAuth.selectUser
);

export const selectAuthError = createSelector(
  selectAuthState,
  fromAuth.selectError
);

// Books state section
//
//  *takes all local selectors and export to make them global

//export selector
export const selectBooksState = (state: State) => state.books;
export const selectActiveBook_unoptimized = (state: State) => {
  const booksState = selectBooksState(state);

  return fromBooks.selectActiveBook(booksState);
};

export const selectActiveBook = createSelector(
  selectBooksState,
  fromBooks.selectActiveBook
);

export const selectAllBooks = createSelector(
  selectBooksState,
  fromBooks.selectAll
);

export const selectBooksEarningsTotals = createSelector(
  selectBooksState,
  fromBooks.selectEarningsTotals
);
