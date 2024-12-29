import { ApplicationConfig } from '@angular/core';
import { provideRouter } from '@angular/router';
import { routes } from './app.routes';
import { initializeApp, provideFirebaseApp } from '@angular/fire/app';
import { getAuth, provideAuth } from '@angular/fire/auth';
import { getFirestore, provideFirestore } from '@angular/fire/firestore';

const firebaseConfig = {
  // Add your Firebase configuration here
  apiKey: "AIzaSyAKhawi3mZfSoH5c5fMGWrnaBXqS1hTpSY",
  authDomain: "proletarochka.firebaseapp.com",
  projectId: "proletarochka",
  storageBucket: "proletarochka.firebasestorage.app",
  messagingSenderId: "423989191120",
  appId: "1:423989191120:web:4cb0d79170ecb5c60619d5"
};

export const appConfig: ApplicationConfig = {
  providers: [
    provideRouter(routes),
    provideFirebaseApp(() => initializeApp(firebaseConfig)),
    provideAuth(() => getAuth()),
    provideFirestore(() => getFirestore())
  ]
};
