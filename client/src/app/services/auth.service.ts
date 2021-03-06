import { Injectable } from '@angular/core';
import { Http, Headers, RequestOptions } from '@angular/http';
import { map } from 'rxjs/operators';


@Injectable({
  providedIn: 'root'
})

export class AuthService {

  domain = 'http://localhost:8080'; // dev domain - not needed in prod
  authToken;
  user;
  options;


  constructor(
    private http: Http
  ) { }

  loadToken() {
    const token = localStorage.getItem('token');
    this.authToken = token;
  }

  createAuthenticationHeaders() {
    this.loadToken();
    this.options = new RequestOptions({
      headers: new Headers({
        'Content-Type': 'application/json',
        'authorization': this.authToken
      })
    });
  }

  registerUser(user) {
    return this.http.post(this.domain + '/authentication/register', user).pipe(map(res => res.json()));
  }

  // Function to check if username is taken
  checkUsername(username) {
    return this.http.get(this.domain + '/authentication/checkUsername/' + username).pipe(map(res => res.json()));
  }

  // Function to check if e-mail is taken
  checkEmail(email) {
    return this.http.get(this.domain + '/authentication/checkEmail/' + email).pipe(map(res => res.json()));
  }

  login(user) {
    return this.http.post(this.domain + '/authentication/login', user).pipe(map(res => res.json()));
  }

  storeUserData(token, user) {
    localStorage.setItem('token', token);
    localStorage.setItem('user', JSON.stringify(user));
    this.authToken = token;
    this.user = user;
  }

  getProfile() {
    this.createAuthenticationHeaders();
    return this.http.get(this.domain + '/authentication/profile', this.options).pipe(map(res => res.json()));
  }

  loggedIn() {
    if (this.authToken == null || this.authToken == undefined) {
      return false;
    } else {
      return true;
    }
  }


  logout() {
    this.authToken = null;
    this.user = null;
    localStorage.clear();
  }
}
