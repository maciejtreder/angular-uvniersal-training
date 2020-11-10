import { Component, OnInit } from '@angular/core';
import { UserService } from '../user.service';
import { Observable } from 'rxjs';

@Component({
  selector: 'app-header',
  template: `
    <div class="navbar navbar-dark bg-dark shadow-sm">
      <div class="container d-flex justify-content-between">
        <a routerLink="/" class="navbar-brand d-flex align-items-center"
          ><strong>Welcome to the (work)shop!</strong></a
        >
        <a
          *ngIf="isLoggedIn$ | async"
          routerLink="favorites"
          class="btn btn-secondary my-2"
          >my favorite products</a
        >
        <a
          *ngIf="!(isLoggedIn$ | async)"
          routerLink="login"
          class="btn btn-secondary my-2"
          >login</a
        >
      </div>
    </div>
  `,
  styles: [],
})
export class HeaderComponent implements OnInit {
  public isLoggedIn$: Observable<boolean>;
  constructor(private us: UserService) {}

  ngOnInit(): void {
    this.isLoggedIn$ = this.us.isLoggedIn();
  }
}
