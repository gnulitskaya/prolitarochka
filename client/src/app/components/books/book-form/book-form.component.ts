import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink, ActivatedRoute, Router } from '@angular/router';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { BookService } from '../../../services/book.service';

@Component({
  selector: 'app-book-form',
  standalone: true,
  imports: [CommonModule, RouterLink, ReactiveFormsModule],
  template: `
    <div class="container">
      <div class="glass-card book-form">
        <h1>{{ isEditing ? 'Edit' : 'Add' }} Book</h1>
        
        <div class="error-message" *ngIf="error">
          {{ error }}
        </div>

        <form [formGroup]="bookForm" (ngSubmit)="onSubmit()">
          <div class="form-group">
            <label for="title">Title</label>
            <input
              id="title"
              type="text"
              formControlName="title"
              class="glass-input"
              placeholder="Book title"
            />
          </div>

          <div class="form-group">
            <label for="author">Author</label>
            <input
              id="author"
              type="text"
              formControlName="author"
              class="glass-input"
              placeholder="Book author"
            />
          </div>

          <div class="form-group">
            <label for="rating">Rating</label>
            <select
              id="rating"
              formControlName="rating"
              class="glass-input"
            >
              <option value="1">1</option>
              <option value="2">2</option>
              <option value="3">3</option>
              <option value="4">4</option>
              <option value="5">5</option>
            </select>
          </div>

          <div class="form-group">
            <label for="thoughts">Your Thoughts</label>
            <textarea
              id="thoughts"
              formControlName="thoughts"
              class="glass-input"
              rows="6"
              placeholder="Share your thoughts about the book..."
            ></textarea>
          </div>

          <div class="form-actions">
            <button type="button" class="glass-button" routerLink="/books">
              Cancel
            </button>
            <button 
              type="submit" 
              class="glass-button submit"
              [disabled]="!bookForm.valid || submitting"
            >
              {{ submitting ? 'Saving...' : (isEditing ? 'Update' : 'Add') }} Book
            </button>
          </div>
        </form>
      </div>
    </div>
  `,
  styles: [`
    .container {
      padding: 20px;
      max-width: 600px;
      margin: 0 auto;
    }

    .book-form {
      padding: 30px;

      h1 {
        color: white;
        margin: 0 0 30px 0;
      }
    }

    .form-group {
      margin-bottom: 20px;

      label {
        display: block;
        color: white;
        margin-bottom: 8px;
      }

      input, select, textarea {
        width: 100%;
        box-sizing: border-box;
      }

      textarea {
        resize: vertical;
      }
    }

    .form-actions {
      display: flex;
      justify-content: flex-end;
      gap: 10px;
      margin-top: 30px;
    }

    .submit {
      background: rgba(100, 255, 100, 0.2);
      &:hover:not(:disabled) {
        background: rgba(100, 255, 100, 0.3);
      }
      &:disabled {
        opacity: 0.5;
        cursor: not-allowed;
      }
    }

    .error-message {
      background: rgba(255, 0, 0, 0.1);
      border: 1px solid rgba(255, 0, 0, 0.2);
      color: white;
      padding: 10px;
      border-radius: 8px;
      margin-bottom: 20px;
    }
  `]
})
export class BookFormComponent implements OnInit {
  bookForm: FormGroup;
  isEditing = false;
  submitting = false;
  bookId: string | null = null;
  error: string | null = null;

  constructor(
    private fb: FormBuilder,
    private bookService: BookService,
    private route: ActivatedRoute,
    private router: Router
  ) {
    console.log('BookFormComponent constructed');
    this.bookForm = this.fb.group({
      title: ['', Validators.required],
      author: ['', Validators.required],
      rating: [5, [Validators.required, Validators.min(1), Validators.max(5)]],
      thoughts: ['', [Validators.required, Validators.minLength(10)]]
    });
  }

  ngOnInit() {
    console.log('BookFormComponent initialized');
  }

  async onSubmit() {
    console.log('Submit button clicked');
    console.log('Form valid:', this.bookForm.valid);
    console.log('Form values:', this.bookForm.value);

    if (this.bookForm.valid) {
      this.submitting = true;
      this.error = null;

      try {
        const bookData = {
          ...this.bookForm.value,
          rating: Number(this.bookForm.value.rating)
        };
        
        console.log('Attempting to add book:', bookData);
        const result = await this.bookService.addBook(bookData);
        console.log('Book added successfully:', result);
        
        await this.router.navigate(['/books']);
      } catch (error) {
        console.error('Error in onSubmit:', error);
        this.error = error instanceof Error ? error.message : 'Failed to save book';
      } finally {
        this.submitting = false;
      }
    } else {
      console.log('Form is invalid');
      console.log('Form errors:', this.bookForm.errors);
      Object.keys(this.bookForm.controls).forEach(key => {
        const control = this.bookForm.get(key);
        if (control?.errors) {
          console.log(`${key} errors:`, control.errors);
        }
      });
    }
  }
}