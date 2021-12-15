import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';


@Injectable({
  providedIn: 'root'
})
export class CollaborationService {

   URI = 'https://firubuy-api.herokuapp.com/api/knox';

  constructor(private http: HttpClient) { }

  createCollaboration(op: string, address: string, email: string, photo: File){
    const fd = new FormData();
    fd.append('operation', op);
    fd.append('chain_address', address);
    fd.append('e_mail', email);
    fd.append('voucher', photo);
    return this.http.post(this.URI, fd);
  }

}

