import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class CoinUpdateService {

  URI = 'https://knoxapi.ml/api/firu/tipo_cambio';

  constructor(private http: HttpClient) { }
  


  createCoinUpdate(compra: string, venta: string){
    const fd = new FormData();
    fd.append('coin_compra', compra);
    fd.append('coin_venta', venta);
    return this.http.put(this.URI, fd);

  }

}
