import { Component, OnInit } from "@angular/core";
import {
  BookModel,
  calculateBooksGrossEarnings,
  BookRequiredProps
} from "src/app/shared/models";
import { BooksService } from "src/app/shared/services";
import { Store } from '@ngrx/store';
import { State, selectBooksEarningsTotals, selectAllBooks, selectActiveBook } from 'src/app/shared/state';
import { BooksPageActions, BooksApiActions } from '../../actions';
import { Observable } from 'rxjs';
import { selectActiveBookId } from 'src/app/shared/state/books.reducer';

@Component({
  selector: "app-books",
  templateUrl: "./books-page.component.html",
  styleUrls: ["./books-page.component.css"]
})
export class BooksPageComponent implements OnInit {
  books$: Observable<BookModel[]>;
  currentBook$: Observable<BookModel | undefined>;
  total$: Observable<number>; //$ denotes it is a stream...aka observable

  constructor(private booksService: BooksService, private store: Store<State>) {
    this.books$ = store.select(selectAllBooks);
    this.currentBook$ = store.select(selectActiveBook);
    this.total$ = store.select(selectBooksEarningsTotals);
  }

  ngOnInit() {
    this.store.dispatch(BooksPageActions.enterBook());
    this.getBooks();
    this.removeSelectedBook();
  }

  getBooks() {
    this.booksService.all().subscribe(books => {
      // action to describe the event of this API call succeding
      // for production, would have an action for API failing
      this.store.dispatch(BooksApiActions.booksLoaded({ books }));
    });
  }

  onSelect(book: BookModel) {
    this.store.dispatch(BooksPageActions.selectBook({bookId: book.id}));
    //this.currentBook = book;
  }

  onCancel() {
    this.removeSelectedBook();
  }

  removeSelectedBook() {
    this.store.dispatch(BooksPageActions.clearSelectedBook());
  }

  onSave(book: BookRequiredProps | BookModel) {
    if ("id" in book) {
      this.updateBook(book);
    } else {
      this.saveBook(book);
    }
  }

  saveBook(bookProps: BookRequiredProps) {
    this.store.dispatch(BooksPageActions.createBook({book: bookProps}));
    this.booksService.create(bookProps).subscribe(book => {
      // this.getBooks();
      // this.removeSelectedBook();

      this.store.dispatch(BooksApiActions.bookCreated({book}));
    });
  }

  updateBook(book: BookModel) {
    this.store.dispatch(BooksPageActions.updateBook({bookId: book.id, bookChanges:book }));
    this.booksService.update(book.id, book).subscribe(book => {
      // this.getBooks();
      // this.removeSelectedBook();

      this.store.dispatch(BooksApiActions.bookUpdated({ book }));
    });
  }

  onDelete(book: BookModel) {
    this.store.dispatch(BooksPageActions.deleteBook({bookId: book.id}));
    this.booksService.delete(book.id).subscribe(() => {
      // this.getBooks();
      // this.removeSelectedBook();

      this.store.dispatch(BooksApiActions.bookDeleted({ bookId: book.id }));
    });
  }
}
