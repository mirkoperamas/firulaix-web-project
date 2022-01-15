import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';


@Injectable({
  providedIn: 'root'
})
export class SellSendService {

   URI = 'https://firuswapfiatsell-api.herokuapp.com/api/knox';

  constructor(private http: HttpClient) { }

  createSellSend(numTr: string, bcpAccount: string, email: string, photo: File, tCambio: string){
    const fd = new FormData();
    fd.append('sell_numTr', numTr);
    fd.append('sell_bcpAccount', bcpAccount);
    fd.append('sell_email', email);
    fd.append('voucher', photo);
    fd.append('sell_tcambio', tCambio);
    return this.http.post(this.URI, fd);
  }

}