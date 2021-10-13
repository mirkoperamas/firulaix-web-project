import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';


@Injectable({
  providedIn: 'root'
})
export class RegisterService {

   URI = 'http://192.168.0.21:5500/api/knox'

  constructor(private http: HttpClient) { }

  createRegister(op: string, address: string, email: string, photo: File){
    const fd = new FormData();
    fd.append('operation', op);
    fd.append('chain_address', address);
    fd.append('e_mail', email);
    fd.append('voucher', photo);
    return this.http.post(this.URI, fd);

  }

}

