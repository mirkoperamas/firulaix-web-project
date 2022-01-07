import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class CoinUpdateService {
  URI = 'https://firubuy-api.herokuapp.com/api/firu/tipo_cambio';


  constructor(private http: HttpClient) {}

  getCoinUpdate(): Observable<any> {
    return this.http.get<any>(this.URI);
  }

  putCoinUpdate(updatingCoin: any): Observable<any> {
    return this.http.put<any>(this.URI, updatingCoin);
  }
}
