import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { BehaviorSubject } from 'rxjs';
import { tap } from 'rxjs/operators';

interface UsernameAvailableResponse {
  available: boolean;
}

interface SignupCredentials {
  username: string;
  password: string;
  passwordConfirmation: string;
}

interface SignupResponse {
  username: string;
}

interface SignedinResponse {
  authenticated: boolean;
  username: string;
}

interface SigninCredentials {
  username: string;
  password: string;
}

interface SigninResponse {
  username: string;
}

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  
  rootUrl = 'https://api.angular-email.com';
  signedIn$ = new BehaviorSubject(null);
  username = '';

  constructor(private http: HttpClient) { }

  usernameAvailable(username: string){
    return this.http.post<UsernameAvailableResponse>(`${this.rootUrl}/auth/username`, {
      username: username
    });
  }

  /**
   * 
   * , 
    {
      //withcredentials is used to persist the cookies in the http request.
      //default behavior for http is to discard the cookies
      withCredentials: true
    }
   */
  signUp(credentials: SignupCredentials){
    return this.http.post<SignupResponse>( `${this.rootUrl}/auth/signup`, credentials).pipe(
      tap((response) => {
        //errors coming out of this request will skip over the tap operator
        this.signedIn$.next(true);
        this.username = response.username;
      })
    );
  }

  checkAuth(){
    return this.http.get<SignedinResponse>(`${this.rootUrl}/auth/signedin`).pipe(
      tap(({ authenticated, username }) => {
        this.signedIn$.next(authenticated);
        this.username = username;
      })
    );
  }

  signOut(){
    return this.http.post(`${this.rootUrl}/auth/signout`, {}).pipe(
      tap(()=>{
        this.signedIn$.next(false);
      })
    );
  }

  signIn(credentials: SigninCredentials){
    return this.http.post<SigninResponse>(`${this.rootUrl}/auth/signin`, credentials).pipe(
      tap((response) => {
        this.signedIn$.next(true);
        this.username = response.username;
      })
    )
  }
}
