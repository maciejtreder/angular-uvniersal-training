import { Component, OnInit } from '@angular/core';
import { FormGroup, FormControl } from '@angular/forms';
import { UserService } from '../user.service';

@Component({
  selector: 'app-login',
  template: `
    <form [formGroup]="loginForm" (ngSubmit)="logIn()">
      <div class="mb-3">
        <label for="email">Email</label>
        <input
          type="email"
          class="form-control"
          id="email"
          placeholder="you@example.com"
          formControlName="email"
        />
      </div>
      <div class="mb-3">
        <label for="password">Password</label>
        <input
          type="password"
          class="form-control"
          id="password"
          formControlName="password"
        />
      </div>

      <button class="btn btn-primary btn-lg btn-block" type="submit">
        Log in
      </button>
    </form>
  `,
  styles: [],
})
export class LoginComponent implements OnInit {
  loginForm = new FormGroup({
    email: new FormControl(''),
    password: new FormControl(''),
  });

  constructor(private us: UserService) {}

  ngOnInit(): void {}

  public logIn() {
    const login = this.loginForm.get('email').value;
    const password = this.loginForm.get('password').value;

    this.us.login(login, password);
  }
}
