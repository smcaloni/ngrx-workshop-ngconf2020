import { Injectable } from "@angular/core";
import { createEffect, Actions, ofType } from "@ngrx/effects";
import { mergeMap, map, exhaustMap, concatMap } from "rxjs/operators";
import { BooksService } from "../shared/services";
import { BooksPageActions, BooksApiActions } from "./actions";

@Injectable()
export class BooksApiEffects {
  constructor(private booksService: BooksService, private actions$: Actions) {}

  loadBooks$ = createEffect(() =>
    this.actions$.pipe(
      ofType(BooksPageActions.enterBook),
      exhaustMap(() =>
        this.booksService
          .all()
          .pipe(map(books => BooksApiActions.booksLoaded({ books })))
      )
    )
  );

  deleteBook$ = createEffect(() => {
      return this.actions$.pipe(
          ofType(BooksPageActions.deleteBook),
          mergeMap(action =>
            this.booksService
              .delete(action.bookId)
              .pipe(
                map(() => BooksApiActions.bookDeleted({ bookId: action.bookId }))
              )
          )
      )
  });

  createBook$ = createEffect(() => {
    return this.actions$.pipe(
        ofType(BooksPageActions.createBook),
        concatMap(action =>
        this.booksService
            .create(action.book)
            .pipe(map(book => BooksApiActions.bookCreated({ book })))
        )
    )
    });

    updateBook$ = createEffect(() => {
    return this.actions$.pipe(
        ofType(BooksPageActions.updateBook),
        concatMap(action =>
            this.booksService
            .update(action.bookId, action.bookChanges)
            .pipe(map(book => BooksApiActions.bookUpdated({ book })))
        )
        )
    });
}