import { Injectable, inject } from '@angular/core';
import { BehaviorSubject, Observable, from, of } from 'rxjs';
import { map, tap, catchError, switchMap } from 'rxjs/operators';
import {
  Firestore,
  collection,
  doc,
  setDoc,
  getDocs,
  updateDoc,
  query,
  where,
  onSnapshot,
  runTransaction,
} from '@angular/fire/firestore';
import {
  Auth,
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  signOut,
} from '@angular/fire/auth';

@Injectable({
  providedIn: 'root',
})
export class ProviderService {
  private firestore: Firestore = inject(Firestore);
  private auth: Auth = inject(Auth);
  private currentProviderSubject = new BehaviorSubject<any>(null);
  public currentProvider$ = this.currentProviderSubject.asObservable();

  constructor() {
    this.loadProviderFromStorage();
  }

  private loadProviderFromStorage() {
    if (typeof window !== 'undefined' && window.localStorage) {
      const saved = localStorage.getItem('chorepro_provider');
      if (saved) {
        try {
          this.currentProviderSubject.next(JSON.parse(saved));
        } catch (e) {
          // Error loading stored provider
        }
      }
    }
  }

  createAccount(providerData: any): Observable<any> {
    return from(
      createUserWithEmailAndPassword(
        this.auth,
        providerData.email,
        providerData.password,
      ),
    ).pipe(
      switchMap((userCredential) => {
        const uid = userCredential.user.uid;
        const providerProfile = {
          ...providerData,
          uid: uid,
          id: uid,
        };
        delete providerProfile.password;

        const providerDocRef = doc(this.firestore, 'providers', uid);
        return from(setDoc(providerDocRef, providerProfile)).pipe(
          tap(() => {
            this.saveToStorage(providerProfile);
            this.currentProviderSubject.next(providerProfile);
          }),
          map(() => providerProfile),
        );
      }),
      catchError((err) => {
        throw err;
      }),
    );
  }

  login(email: string, password?: string): Observable<boolean> {
    if (!password) {
      return of(false);
    }

    return from(signInWithEmailAndPassword(this.auth, email, password)).pipe(
      switchMap((userCredential) => {
        const uid = userCredential.user.uid;
        const q = query(
          collection(this.firestore, 'providers'),
          where('uid', '==', uid),
        );
        return from(getDocs(q)).pipe(
          map((snapshot) => {
            if (snapshot.empty) {
              return false;
            }
            const docData = snapshot.docs[0];
            const provider = { ...docData.data(), id: docData.id } as any;
            this.saveToStorage(provider);
            this.currentProviderSubject.next(provider);
            return true;
          }),
        );
      }),
      catchError(() => {
        return of(false);
      }),
    );
  }

  updateProvider(provider: any): Observable<any> {
    if (!provider.id) {
      return of(null);
    }
    const providerRef = doc(this.firestore, 'providers', provider.id);
    return from(updateDoc(providerRef, provider)).pipe(
      tap(() => {
        this.saveToStorage(provider);
        this.currentProviderSubject.next(provider);
      }),
      catchError((err) => {
        throw err;
      }),
    );
  }

  logout() {
    from(signOut(this.auth)).subscribe({
      next: () => {
        this.currentProviderSubject.next(null);
        if (typeof window !== 'undefined' && window.localStorage) {
          localStorage.removeItem('chorepro_provider');
        }
      },
      error: () => {},
    });
  }

  updateBookingStatus(
    bookingId: string,
    status: string,
    skillName: string,
  ): Observable<void> {
    const provider = this.currentProviderSubject.value;
    if (!provider || !skillName) return of(undefined);

    const bookingRef = doc(this.firestore, 'bookings', bookingId);

    return from(
      runTransaction(this.firestore, async (transaction) => {
        const bookingDoc = await transaction.get(bookingRef);
        if (!bookingDoc.exists()) throw 'Booking does not exist!';

        const bookingData = bookingDoc.data();
        const services = bookingData['services'] || {};
        const targetService = services[skillName];

        if (!targetService) throw `Service ${skillName} not found in booking!`;

        if (status === 'in-progress' && targetService.status !== 'pending') {
          throw 'This service has already been accepted by another provider!';
        }

        const updatePayload: any = { ...targetService, status: status };

        if (status === 'in-progress') {
          updatePayload.providerId = provider.uid || provider.id;
          updatePayload.providerName = provider.name;
          updatePayload.providerContact = provider.contact;
          updatePayload.providerSkill = provider.skill;
          updatePayload.acceptedAt = new Date().toISOString();
        }

        if (status === 'completed') {
          updatePayload.completedAt = new Date().toISOString();
        }

        services[skillName] = updatePayload;
        transaction.update(bookingRef, { services: services });
      }),
    ).pipe(
      catchError((err) => {
        throw err;
      }),
    );
  }

  getMatchingRequests(): Observable<any[]> {
    const provider = this.currentProviderSubject.value;
    if (!provider || !provider.skill) {
      return of([]);
    }

    const bookingsRef = collection(this.firestore, 'bookings');
    const q = query(
      bookingsRef,
      where('skills', 'array-contains', provider.skill),
    );

    return new Observable<any[]>((subscriber) => {
      const unsubscribe = onSnapshot(
        q,
        (snapshot) => {
          const requests = snapshot.docs.map((docData) => ({
            ...docData.data(),
            id: docData.id,
          }));

          const filteredRequests = requests.filter((req: any) => {
            const svc = req.services?.[provider.skill];
            if (!svc) return false;
            if (svc.status === 'pending') return true;
            return svc.providerId === (provider.uid || provider.id);
          });

          filteredRequests.sort(
            (a: any, b: any) =>
              new Date(b.createdAt || 0).getTime() -
              new Date(a.createdAt || 0).getTime(),
          );
          subscriber.next(filteredRequests);
        },
        (error) => subscriber.error(error),
      );

      return () => unsubscribe();
    });
  }

  private saveToStorage(provider: any) {
    if (typeof window !== 'undefined' && window.localStorage) {
      localStorage.setItem('chorepro_provider', JSON.stringify(provider));
    }
  }
}
