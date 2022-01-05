import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class FiruValueService {
  constructor(private http: HttpClient) {}

  public post(): Observable<any> {
    return this.http.post('https://api.zenlink.pro/rpc', {
      jsonrpc: '2.0',
      id: 1,
      method: 'assetPrice.get',
      params: ['2023', '0x2fbe6b6f1e3e2efc69495f0c380a01c003e47225'],
    });
  }
}
