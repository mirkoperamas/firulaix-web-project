import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';


@Injectable({
  providedIn: 'root'
})
export class RegisterService {

   URI = 'http://localhost:4000/api/registers'

  constructor(private http: HttpClient) { }

  createRegister(op: string, address: string, email: string, photo: File){
    const fd = new FormData();
    fd.append('op', op);
    fd.append('address', address);
    fd.append('email', email);
    fd.append('register', photo);
    return this.http.post(this.URI, fd);

  }

}

