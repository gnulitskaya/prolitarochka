import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink, ActivatedRoute, Router } from '@angular/router';
import { BookService } from '../../../services/book.service';
import { AuthService } from '../../../services/auth.service';
import { Book } from '../../../shared/models/book.interface';
import { Observable, switchMap, map } from 'rxjs';

@Component({
  selector: 'app-book-detail',
  standalone: true,
  imports: [CommonModule, RouterLink],
  template: `
    <div class="container" *ngIf="book$ | async as book">
      <div class="glass-card book-detail">
        <div class="header">
          <h1>{{ book.title }}</h1>
          <div class="actions" *ngIf="(auth.currentUser$ | async)?.uid === book.userId">
            <button class="glass-button" [routerLink]="['/books', book.id, 'edit']">
              Edit
            </button>
            <button class="glass-button delete" (click)="deleteBook(book.id!)">
              Delete
            </button>
          </div>
        </div>

        <p class="author">by {{ book.author }}</p>
        
        <div class="rating">
          Rating: {{ book.rating }}/5
        </div>

        <div class="thoughts">
          {{ book.thoughts }}
        </div>

        <div class="metadata">
          <p>Added on: {{ book.createdAt | date:'medium' }}</p>
          <p *ngIf="book.updatedAt !== book.createdAt">
            Last updated: {{ book.updatedAt | date:'medium' }}
          </p>
        </div>

        <button class="glass-button back-button" routerLink="/books">
          Back to Books
        </button>
      </div>
    </div>
  `,
  styles: [`
    .container {
      padding: 20px;
      max-width: 800px;
      margin: 0 auto;
    }

    .book-detail {
      padding: 30px;
    }

    .header {
      display: flex;
      justify-content: space-between;
      align-items: center;
      margin-bottom: 20px;

      h1 {
        color: white;
        margin: 0;
      }

      .actions {
        display: flex;
        gap: 10px;
      }
    }

    .author {
      color: rgba(255, 255, 255, 0.8);
      font-style: italic;
      font-size: 1.2rem;
      margin-bottom: 20px;
    }

    .rating {
      color: white;
      font-size: 1.1rem;
      margin-bottom: 30px;
    }

    .thoughts {
      color: white;
      line-height: 1.6;
      margin-bottom: 30px;
      white-space: pre-wrap;
    }

    .metadata {
      color: rgba(255, 255, 255, 0.7);
      font-size: 0.9rem;
      margin-bottom: 30px;

      p {
        margin: 5px 0;
      }
    }

    .back-button {
      margin-top: 20px;
    }

    .delete {
      background: rgba(255, 0, 0, 0.2);
      &:hover {
        background: rgba(255, 0, 0, 0.3);
      }
    }
  `]
})
export class BookDetailComponent implements OnInit {
  book$: Observable<Book>;

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private bookService: BookService,
    public auth: AuthService
  ) {
    this.book$ = this.route.params.pipe(
      map(params => params['id']),
      switchMap(id => this.bookService.getBook(id))
    );
  }

  ngOnInit() {}

  async deleteBook(id: string) {
    if (confirm('Are you sure you want to delete this book?')) {
      try {
        await this.bookService.deleteBook(id);
        this.router.navigate(['/books']);
      } catch (error) {
        console.error('Error deleting book:', error);
      }
    }
  }
}
