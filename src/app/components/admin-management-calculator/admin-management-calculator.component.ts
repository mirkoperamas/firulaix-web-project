import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { last, takeUntil } from 'rxjs/operators';
import { Observable, Subject } from 'rxjs';
import { HttpClient } from '@angular/common/http';

import { CoinUpdateService } from '../../services/coin-update.service';

@Component({
  selector: 'app-admin-management-calculator',
  templateUrl: './admin-management-calculator.component.html',
  styleUrls: ['./admin-management-calculator.component.css', '../general-style-components.css']
})
export class AdminManagementCalculatorComponent implements OnInit {
  convertorForm!: FormGroup;

  unsubscribe: Subject<void>;

  compraSunat!: number;
  ventaSunat!: number;
  compraImp!: string;
  ventaImp!: string;
  coinImpAPI: string;
  compraImpAPI: string;
  ventaImpAPI: string;

  valorActualImp!: string;


  valorActualFiru!: number;

  valorActualPriceFiru!: number;
  

  abc: string;

  constructor(private http: HttpClient, private calcformBuilder: FormBuilder, private coinUpdateService: CoinUpdateService,) { 
    this.unsubscribe = new Subject();
    this.initForm();

  }

  ngOnInit(): void {
    // SUBSCRIBE FORM
    this.subscribeToForm();
    this.convertorForm.controls.resultado.disable();
    this.convertorForm.controls.tipoMoneda.setValue('soles');
    this.resultSunat();

    this.coinUpdateService.getCoinUpdate().subscribe( coinres => this.coinImpAPI = coinres.data[coinres.data.length-1]);
    this.coinUpdateService.getCoinUpdate().subscribe( coinres => this.compraImpAPI = coinres.data[coinres.data.length-1].compra);
    this.coinUpdateService.getCoinUpdate().subscribe( coinres => this.ventaImpAPI = coinres.data[coinres.data.length-1].venta);

  }


  initForm(): void {
    this.convertorForm = this.calcformBuilder.group({
      valorIngresado: ['', [Validators.required]],
      tipoMoneda: ['', [Validators.required]],
      resultado: ['', [Validators.required]],
    });


  }


  addNewCoin(): void{
    const coinChange = {compra: this.compraImp, venta: this.ventaImp};
    this.coinUpdateService.putCoinUpdate(coinChange).subscribe(upcoin => console.log(upcoin));
  }

  submit() {
    console.warn(this.convertorForm.controls);
  }

  subscribeToForm(): void {
    this.convertorForm.valueChanges
      .pipe(takeUntil(this.unsubscribe))
      .subscribe((controls) => {
        if (controls?.valorIngresado && controls?.tipoMoneda) {
          switch (controls?.tipoMoneda) {
            case 'soles':
              let tcSoles: any = this.ventaImpAPI;
              let tcambioSoles: any = (
                +controls.valorIngresado / +tcSoles
              ).toFixed(4);

              let variableSoles: any = (tcambioSoles * 10000).toFixed(0);

              let resultSoles: any = variableSoles + '00000000000000';

              this.resultFiru(resultSoles); //llamar al servicio

              break;

            case 'dolares':
              let tcDolares: any = (+controls.valorIngresado ).toFixed(4);

              let variableDolares: any = (tcDolares * 10000).toFixed(0);

              let resultDolares: any = variableDolares + '00000000000000';

              this.resultFiru(resultDolares); //llamando al servicio
              break;

            default:
              break;
          }
        }
      });
  }


  getFiru(value?: string): Observable<any> {
    const url =
      'https://bsc.api.0x.org/swap/v1/quote?sellToken=0xe9e7CEA3DedcA5984780Bafc599bD69ADd087D56&buyToken=0xE16d271322273a77BA5748DF4FD9209C4bEA541F&sellAmount=' +
      value +'&excludedSources=BakerySwap';

    return this.http.get<object>(url);
  }

  resultFiru(value?: string) {
    this.getFiru(value).subscribe((valor) => {
      this.valorActualFiru = valor.orders[1].makerAmount;
      this.valorActualPriceFiru = valor.price;
      console.log(this.valorActualFiru);

      this.valorActualImp = (1 / this.valorActualPriceFiru).toFixed(5);

      this.convertorForm.patchValue(
        {
          resultado: (this.valorActualFiru / 100000000),

        },
        {
          emitEvent: false
        }
      );
    });
  }

  getSunat(): Observable<any> {
    const url = 'https://api.apis.net.pe/v1/tipo-cambio-sunat';
    return this.http.get<object>(url);
  }


  resultSunat() {
      this.getSunat().subscribe((valor) => {
        this.compraSunat = valor.compra;
        this.ventaSunat = valor.venta;

        this.compraImp = (this.compraSunat * 1.009).toFixed(4);
        this.ventaImp = (this.ventaSunat * 1.009).toFixed(4);
    });
  }



  ngOnDestroy() {
    this.unsubscribe.next();
    this.unsubscribe.complete();
  }

}
