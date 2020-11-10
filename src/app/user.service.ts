import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import {
  map,
  catchError,
  tap,
  distinctUntilChanged,
  mergeMap,
  filter,
  take,
} from 'rxjs/operators';
import { Observable, of, Subject, BehaviorSubject } from 'rxjs';
import { User } from '../model/user.model';
import { Router } from '@angular/router';

@Injectable({
  providedIn: 'root',
})
export class UserService {
  private API_URL = '/api';

  private currentUser$: Subject<User> = new BehaviorSubject(null);
  private redirectUrl: string = '/';
  private redirectParams: any = null;

  constructor(private http: HttpClient, private router: Router) {
    this.currentUser$
      .pipe(
        distinctUntilChanged(),
        filter((user) => !user),
        mergeMap(() => this.checkCookie())
      )
      .subscribe();
  }

  private checkCookie(): Observable<void> {
    return this.http
      .get(`${this.API_URL}/isLoggedIn`, {
        withCredentials: true,
      })
      .pipe(
        catchError(() => of(null)),
        tap((user) => this.currentUser$.next(user))
      );
  }

  public isLoggedIn(): Observable<boolean> {
    return this.currentUser$.pipe(map((user) => user != null));
  }

  public setRedirectUrl(url: string) {
    this.redirectUrl = url;
  }

  public login(email: string, password: string): void {
    this.http
      .post<User>(`${this.API_URL}/login`, {
        email: email,
        password: password,
      })
      .pipe(
        tap((user) => {
          this.currentUser$.next(user);
          if (this.redirectParams) {
            this.router.navigate([this.redirectUrl, this.redirectParams]);
          } else {
            this.router.navigate([this.redirectUrl]);
          }

          this.redirectParams = null;
          this.redirectUrl = '/';
        })
      )
      .subscribe();
  }

  public getFavorites(): Observable<string[]> {
    return this.currentUser$.pipe(
      map((user) => {
        if (user) {
          return user.favorite;
        } else {
          return [];
        }
      })
    );
  }

  public addToFavorites(id: string): Observable<boolean> {
    return this.isLoggedIn().pipe(
      take(1),
      mergeMap((isLoggedIn) => {
        if (isLoggedIn) {
          return this.http
            .post<User>(`${this.API_URL}/favorites/${id}`, {
              withCredentials: true,
            })
            .pipe(
              catchError(() => of(null)),
              tap((user) => this.currentUser$.next(user)),
              map((user) => !!user)
            );
        } else {
          this.redirectUrl = 'products';
          this.redirectParams = { pid: id };
          this.router.navigate(['login']);
          return of(false);
        }
      })
    );
  }
}
