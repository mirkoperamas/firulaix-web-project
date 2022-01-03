import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';


@Injectable({
  providedIn: 'root'
})
export class BuySendService {

   URI = 'https://firubuy-api.herokuapp.com/api/knox';

  constructor(private http: HttpClient) { }

  createBuySend(numOp: string, address: string, email: string, photo: File){
    const fd = new FormData();
    fd.append('buy_numOp', numOp);
    fd.append('buy_address', address);
    fd.append('buy_email', email);
    fd.append('voucher', photo);
    return this.http.post(this.URI, fd);
  }

}