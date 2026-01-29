import { Injectable, inject } from '@angular/core';
import { Firestore, doc, onSnapshot } from '@angular/fire/firestore';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class ClientService {
  private firestore: Firestore = inject(Firestore);

  getBookingStatus(bookingId: string): Observable<any> {
    const bookingRef = doc(this.firestore, 'bookings', bookingId);

    return new Observable<any>((subscriber) => {
      const unsubscribe = onSnapshot(
        bookingRef,
        (snapshot) => {
          if (snapshot.exists()) {
            subscriber.next({ id: snapshot.id, ...snapshot.data() });
          } else {
            subscriber.next(null);
          }
        },
        (error) => subscriber.error(error),
      );

      return () => unsubscribe();
    });
  }

  saveBookingToStorage(bookingId: string) {
    if (typeof window === 'undefined' || !window.localStorage) return;

    let bookings = this.getAllBookings();
    const newEntry = { id: bookingId, timestamp: Date.now() };

    // Add to front, keep unique, limit to 5
    bookings = [newEntry, ...bookings.filter((b) => b.id !== bookingId)].slice(
      0,
      5,
    );
    localStorage.setItem('chorepro_bookings', JSON.stringify(bookings));
  }

  getAllBookings(): any[] {
    if (typeof window === 'undefined' || !window.localStorage) return [];

    const raw = localStorage.getItem('chorepro_bookings');
    if (!raw) return [];

    try {
      const bookings = JSON.parse(raw);
      const thirtyDays = 30 * 24 * 60 * 60 * 1000;
      const now = Date.now();

      // Filter out expired (30 days)
      return bookings.filter((b: any) => now - b.timestamp < thirtyDays);
    } catch (e) {
      return [];
    }
  }

  getLastBookingId(): string | null {
    const bookings = this.getAllBookings();
    return bookings.length > 0 ? bookings[0].id : null;
  }
}
