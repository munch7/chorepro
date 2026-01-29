import { ApplicationConfig, provideZoneChangeDetection } from '@angular/core';
import { provideRouter } from '@angular/router';
import { provideAnimationsAsync } from '@angular/platform-browser/animations/async';
import { LocationStrategy, HashLocationStrategy } from '@angular/common';
import { provideHttpClient } from '@angular/common/http';
import {
  getApp,
  getApps,
  initializeApp,
  provideFirebaseApp,
} from '@angular/fire/app';
import { getFirestore, provideFirestore } from '@angular/fire/firestore';
import { getAuth, provideAuth } from '@angular/fire/auth';
import { environment } from '../environments/environment';

import { routes } from './app.routes';
import { provideClientHydration } from '@angular/platform-browser';

export const appConfig: ApplicationConfig = {
  providers: [
    provideZoneChangeDetection({ eventCoalescing: true }),
    provideRouter(routes),
    provideHttpClient(),
    provideClientHydration(),
    provideAnimationsAsync(),
    provideFirebaseApp(() => {
      const apps = getApps();
      if (apps.length > 0) {
        return getApp();
      }
      return initializeApp(environment.firebaseConfig);
    }),
    provideFirestore(() => getFirestore()),
    provideAuth(() => getAuth()),
    { provide: LocationStrategy, useClass: HashLocationStrategy },
  ],
};
