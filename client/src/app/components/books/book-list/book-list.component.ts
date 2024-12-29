import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { BookService } from '../../../services/book.service';
import { AuthService } from '../../../services/auth.service';
import { Book } from '../../../shared/models/book.interface';
import { Observable, switchMap, of } from 'rxjs';

@Component({
  selector: 'app-book-list',
  standalone: true,
  imports: [CommonModule, RouterLink],
  template: `
    <div class="container">
      <div class="header">
        <!-- <h1>Book Thoughts</h1> -->
        <div class="filters">
          <button class="glass-button" (click)="showAllBooks()">All Books</button>
          <button class="glass-button" (click)="showMyBooks()">My Books</button>
        </div>
      </div>

      <div class="books-grid">
        <div *ngFor="let book of books$ | async" class="glass-card book-card">
          <h3>{{ book.title }}</h3>
          <p class="author">by {{ book.author }}</p>
          <div class="rating">
            Rating: {{ book.rating }}/5
          </div>
          <p class="thoughts">{{ book.thoughts | slice:0:150 }}...</p>
          <div class="actions">
            <a [routerLink]="['/books', book.id]" class="glass-button">Read More</a>
            <a *ngIf="(auth.currentUser$ | async)?.uid === book.userId" 
               [routerLink]="['/books', book.id, 'edit']" 
               class="glass-button">
              Edit
            </a>
          </div>
        </div>
      </div>
    </div>
  `,
  styles: [`
    .container {
      padding: 20px;
      max-width: 1200px;
      margin: 0 auto;
    }

    .header {
      margin-bottom: 30px;
      // padding: 20px;
      display: flex;
      justify-content: space-between;
      align-items: center;

      h1 {
        color: white;
        margin: 0;
      }

      .filters {
        display: flex;
        gap: 10px;
      }
    }

    .books-grid {
      display: grid;
      grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
      gap: 20px;
    }

    .book-card {
      padding: 20px;
      
      h3 {
        color: white;
        margin: 0 0 10px 0;
      }

      .author {
        color: rgba(255, 255, 255, 0.8);
        font-style: italic;
        margin-bottom: 15px;
      }

      .rating {
        color: white;
        margin-bottom: 15px;
      }

      .thoughts {
        color: rgba(255, 255, 255, 0.9);
        margin-bottom: 20px;
      }

      .actions {
        display: flex;
        gap: 10px;
      }
    }
  `]
})
export class BookListComponent implements OnInit {
  books$: Observable<Book[]> = new Observable<Book[]>();
  showingUserBooks = false;

  constructor(
    private bookService: BookService,
    public auth: AuthService
  ) {}

  ngOnInit() {
    this.showAllBooks();
  }

  showAllBooks() {
    this.showingUserBooks = false;
    this.books$ = this.bookService.getAllBooks();
  }

  showMyBooks() {
    this.showingUserBooks = true;
    this.books$ = this.auth.currentUser$.pipe(
      switchMap(user => {
        if (user) {
          return this.bookService.getUserBooks(user.uid);
        }
        return of([]);
      })
    );
  }
}
