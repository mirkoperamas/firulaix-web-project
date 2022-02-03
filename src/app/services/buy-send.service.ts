import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';


@Injectable({
  providedIn: 'root'
})
export class BuySendService {

   URI = 'https://firuswapfiatbuy-api.herokuapp.com/api/knox';

  constructor(private http: HttpClient) { }

  createBuySend(numOp: string, address: string, email: string, photo: File, tCambio: string, amount: string, token: string){
    const fd = new FormData();
    fd.append('buy_numOp', numOp);
    fd.append('buy_address', address);
    fd.append('buy_email', email);
    fd.append('voucher', photo);
    fd.append('buy_tcambio', tCambio);
    fd.append('buy_amount', amount);
    fd.append('buy_token', token);
    return this.http.post(this.URI, fd);
  }

}