import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class TipoCambioService {
  URI = 'https://api.kambista.com/v1/exchange/calculates?originCurrency=USD&destinationCurrency=PEN&amount=1500&active=S';

  constructor(private http: HttpClient) { }

  getTipoCambio(): Observable<any> {
    return this.http.get<any>(this.URI);
  }
}
