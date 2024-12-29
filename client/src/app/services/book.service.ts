import { Injectable } from '@angular/core';
import { 
  Firestore, 
  collection, 
  addDoc, 
  updateDoc,
  deleteDoc,
  doc,
  query,
  where,
  orderBy,
  collectionData,
  docData 
} from '@angular/fire/firestore';
import { Observable, firstValueFrom } from 'rxjs';
import { AuthService } from './auth.service';

@Injectable({
  providedIn: 'root'
})
export class BookService {
  constructor(
    private firestore: Firestore,
    private auth: AuthService
  ) {
    console.log('BookService constructed');
  }

  async addBook(bookData: any) {
    console.log('BookService.addBook called with:', bookData);
    
    try {
      const user = await firstValueFrom(this.auth.currentUser$);
      console.log('Current user:', user);

      if (!user) {
        throw new Error('User must be logged in to add a book');
      }

      const booksCollection = collection(this.firestore, 'books');
      console.log('Books collection reference created');

      const bookToAdd = {
        ...bookData,
        userId: user.uid,
        createdAt: new Date(),
        updatedAt: new Date()
      };
      console.log('Prepared book data:', bookToAdd);

      const docRef = await addDoc(booksCollection, bookToAdd);
      console.log('Book added with ID:', docRef.id);
      
      return docRef;
    } catch (error) {
      console.error('Error in BookService.addBook:', error);
      throw error;
    }
  }

  getAllBooks(): Observable<any[]> {
    const booksCollection = collection(this.firestore, 'books');
    const booksQuery = query(booksCollection, orderBy('createdAt', 'desc'));
    return collectionData(booksQuery, { idField: 'id' });
  }

  getUserBooks(userId: string): Observable<any[]> {
    const booksCollection = collection(this.firestore, 'books');
    const userBooksQuery = query(
      booksCollection,
      where('userId', '==', userId),
      orderBy('createdAt', 'desc')
    );
    return collectionData(userBooksQuery, { idField: 'id' });
  }

  getBook(id: string): Observable<any> {
    const bookDoc = doc(this.firestore, `books/${id}`);
    return docData(bookDoc, { idField: 'id' });
  }

  updateBook(id: string, data: any) {
    const bookDoc = doc(this.firestore, `books/${id}`);
    return updateDoc(bookDoc, { ...data, updatedAt: new Date() });
  }

  deleteBook(id: string) {
    const bookDoc = doc(this.firestore, `books/${id}`);
    return deleteDoc(bookDoc);
  }
}
