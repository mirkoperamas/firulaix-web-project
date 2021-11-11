import { Component, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Observable, Subject } from 'rxjs';
import { Router } from '@angular/router'

import { HttpClient } from '@angular/common/http';

import { takeUntil } from 'rxjs/operators';

import { RegisterService } from '../../services/register.service';

import { CoinUpdateService } from '../../services/coin-update.service';

import { MatDialog } from '@angular/material/dialog';

import { TemplateRef } from '@angular/core';
import { ReCaptcha2Component } from 'ngx-captcha';


import { LoadScriptsService } from '../../services/load-scripts.service';



 
interface HtmlInputEvent extends Event{
  target: HTMLInputElement & EventTarget;
}


@Component({
  selector: 'app-migracion',
  templateUrl: './migracion.component.html',
  styleUrls: ['./migracion.component.scss', '../../app.component.scss']
})
export class MigracionComponent implements OnInit {
  

  convertorForm!: FormGroup;
  
  unsubscribe: Subject<void>;
  
  
  compraSunat!: number;
  ventaSunat!: number;
  compraImp!: string;
  ventaImp!: string;
  coinImpAPI: string;
  compraImpAPI: string;
  ventaImpAPI: string;
  
  valorActualFiru!: number;
  
  valorTo: number;
  
  photoSelected: string | ArrayBuffer;
  
  file: File;
  
  sendFormulary: FormGroup;
  
  filePreview: String
  
imageX = 'assets/no-image-2.png';



@ViewChild('captchaElem') captchaElem: ReCaptcha2Component;



emailPattern = /^(([^<>()\[\]\\.,;:\s@”]+(\.[^<>()\[\]\\.,;:\s@”]+)*)|(“.+”))@((\[[0–9]{1,3}\.[0–9]{1,3}\.[0–9]{1,3}\.[0–9]{1,3}])|(([a-zA-Z\-0–9]+\.)+[a-zA-Z]{2,}))$/;

numOpPattern = /^\d*$/;



  constructor( private http: HttpClient, private router: Router, private dialog: MatDialog, private calcformBuilder: FormBuilder, private registerService: RegisterService, private sendFormBuilder: FormBuilder, private coinUpdateService: CoinUpdateService, private _CargaScripts: LoadScriptsService) {

    this.unsubscribe = new Subject();
    this.initForm();

    _CargaScripts.Carga(["/meta-login"]);
   }

  
  ngOnInit() {
    
    // SUBSCRIBE FORM
    this.subscribeToForm();
    this.convertorForm.controls.resultado.disable();
    this.convertorForm.controls.tipoMoneda.setValue('soles');
    this.resultSunat();


    this.coinUpdateService.getCoinUpdate().subscribe( coinres => this.coinImpAPI = coinres.data[coinres.data.length-1]);
    this.coinUpdateService.getCoinUpdate().subscribe( coinres => this.compraImpAPI = coinres.data[coinres.data.length-1].compra);
    this.coinUpdateService.getCoinUpdate().subscribe( coinres => this.ventaImpAPI = coinres.data[coinres.data.length-1].venta);


    // SEND FORM


    this.sendFormulary = this.sendFormBuilder.group({
      opFormControl: ['', [Validators.required, Validators.minLength(42)]],
      emailFormControl: ['', [Validators.required, Validators.pattern(this.emailPattern)]],
      addressFormControl: ['', [Validators.required, Validators.minLength(42)]],
      imageFormControl: ['', [Validators.required]],
      recaptchaFormControl: ['', [Validators.required]],
    });

    // this.sendFormulary.disable();

  }



  // CAPTCHA KEY
  
  siteKey: string = "6Lcc8dscAAAAAHLqRIyxw4EhHhbPw-pZatfzKZir";
  


  addNewCoin(): void{
    const coinChange = {compra: this.compraImp, venta: this.ventaImp};
    this.coinUpdateService.putCoinUpdate(coinChange).subscribe(upcoin => console.log(upcoin));
  }

  submit() {
    console.warn(this.convertorForm.controls);
  }

  getSunat(): Observable<any> {
    const url = 'https://api.apis.net.pe/v1/tipo-cambio-sunat';
    return this.http.get<object>(url);
  }



  initForm(): void {
    this.convertorForm = this.calcformBuilder.group({
      valorIngresado: ['', [Validators.required]],
      tipoMoneda: ['', [Validators.required]],
      resultado: ['', [Validators.required]],
    });


  }

  


  resultSunat() {
    this.getSunat().subscribe((valor) => {
      this.compraSunat = valor.compra;
      this.ventaSunat = valor.venta;

      this.compraImp = (this.compraSunat * 1.009).toFixed(4);
      this.ventaImp = (this.ventaSunat * 1.009).toFixed(4);
  });
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

openDialogWithRef(ref: TemplateRef<any>) {
  this.dialog.open(ref);
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
    // console.log(this.valorActualFiru);

    this.convertorForm.patchValue(
      {
        resultado: (this.valorActualFiru / 100000000)

      },
      {
        emitEvent: false
      }
    );
  });
}



  onPhotoSelected(event): void {
    if (event.target.files && event.target.files[0]) {
      this.file = <File>event.target.files[0];
      
      // image preview
      const reader = new FileReader();
      reader.onload = e => this.photoSelected = reader.result;
      reader.readAsDataURL(this.file);
    }
  }

  uploadRegister(op: HTMLInputElement, address: HTMLInputElement, email: HTMLInputElement) {
    this.registerService
      .createRegister(op.value, address.value, email.value, this.file)
      .subscribe(
        res => {
          console.log(res);
          this.sendFormulary.reset();
          (<HTMLImageElement>document.querySelector("#imagex")).src = this.imageX;
          this.captchaElem.resetCaptcha();
        },
        err => console.log(err)
      );
    return false;

    
  }



  

  pasteAddress(){
    let addressUser : string = document.getElementById('token').innerHTML;

    this.sendFormulary.patchValue(
      {
        addressFormControl: addressUser
      },
      {
        emitEvent: false
      }
    );

  }



  ngOnDestroy() {
    this.unsubscribe.next();
    this.unsubscribe.complete();
  }
  

}
