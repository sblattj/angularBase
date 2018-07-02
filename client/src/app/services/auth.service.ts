import { Injectable } from '@angular/core';
import { Http, Headers, RequestOptions } from '@angular/http';
import { map } from 'rxjs/operators';


@Injectable({
  providedIn: 'root'
})

export class AuthService {

  domain = "http://localhost:8080"

  constructor(
    private http: Http
  ) { }

  registerUser(user) {
    return this.http.post(this.domain + '/authentication/register', user)
    .pipe(
      map(res => res.json())
    );
  };

  // Function to check if e-mail is taken
  checkUsername(username) {
    return this.http.get(this.domain + '/authentication/checkUsername/' + username).pipe(map(res => res.json()));
  };

  // Function to check if e-mail is taken
  checkEmail(email) {
    return this.http.get(this.domain + '/authentication/checkEmail/' + email).pipe(map(res => res.json()));
  };


}
