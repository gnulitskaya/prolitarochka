import { inject, Injectable } from '@angular/core';
import { 
  Auth, 
  signInWithEmailAndPassword, 
  createUserWithEmailAndPassword, 
  signOut, 
  user 
} from '@angular/fire/auth';

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  private auth: Auth = inject(Auth);
  currentUser$ = user(this.auth);

  login(email: string, password: string) {
    return signInWithEmailAndPassword(this.auth, email, password);
  }

  register(email: string, password: string) {
    return createUserWithEmailAndPassword(this.auth, email, password);
  }

  logout() {
    return signOut(this.auth);
  }
}
