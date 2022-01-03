import { Component, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Observable, Subject } from 'rxjs';
import { Router } from '@angular/router';
import { HttpClient } from '@angular/common/http';
import { takeUntil } from 'rxjs/operators';

// import { CollaborationService } from '../../services/collaboration.service';

import { SellSendService } from '../../../services/sell-send.service';

import { CoinUpdateService } from '../../../services/coin-update.service';
import { MatDialog } from '@angular/material/dialog';
import { TemplateRef } from '@angular/core';
import { ReCaptcha2Component } from 'ngx-captcha';

interface HtmlInputEvent extends Event {
  target: HTMLInputElement & EventTarget;
}

@Component({
  selector: 'app-venta',
  templateUrl: './venta.component.html',
  styleUrls: ['./venta.component.scss', '../../../app.component.scss'],
})
export class VentaComponent implements OnInit {
  convertorForm!: FormGroup;
  unsubscribe: Subject<void>;
  ventaImpAPI: string;
  valorActualFiru!: number;

  photoSellSelected: string | ArrayBuffer;

  file: File;
  imageY = 'assets/no-image-2.png';

  sendSellFormulary: FormGroup;

  @ViewChild('captchaElem') captchaElem: ReCaptcha2Component;

  emailPattern =
    /^(([^<>()\[\]\\.,;:\s@”]+(\.[^<>()\[\]\\.,;:\s@”]+)*)|(“.+”))@((\[[0–9]{1,3}\.[0–9]{1,3}\.[0–9]{1,3}\.[0–9]{1,3}])|(([a-zA-Z\-0–9]+\.)+[a-zA-Z]{2,}))$/;

  numOpPattern = /^\d*$/;
  numTrPattern = /^\d*$/;

  constructor(
    private http: HttpClient,
    private router: Router,
    private dialog: MatDialog,
    private calcformBuilder: FormBuilder,
    private sellSendService: SellSendService,
    private coinUpdateService: CoinUpdateService,
    private sendSellFormBuilder: FormBuilder
  ) {
    this.unsubscribe = new Subject();
    this.initForm();
  }

  ngOnInit() {
    // SUBSCRIBE FORM
    this.subscribeToForm();
    this.convertorForm.controls.resultado.disable();
    this.convertorForm.controls.tipoMoneda.setValue('soles');
    // this.convertorForm.controls.valorIngresado.disable();

    this.coinUpdateService
      .getCoinUpdate()
      .subscribe(
        (coinres) =>
          (this.ventaImpAPI = coinres.data[coinres.data.length - 1].venta)
      );

    // SEND SELL FORM
    this.sendSellFormulary = this.sendSellFormBuilder.group({
      trFormControl: [
        '',
        [Validators.required, Validators.pattern(this.numTrPattern)],
      ],
      bcpAccountFormControl: [
        '',
        [
          Validators.required,
          // Validators.minLength(16),
          Validators.maxLength(16),
          Validators.pattern(this.numTrPattern)
        ],
      ],
      emailSellFormControl: [
        '',
        [Validators.required, Validators.pattern(this.emailPattern)],
      ],
      imageSellFormControl: ['', [Validators.required]],
      // recaptchaSellFormControl: ['', [Validators.required]],
    });
    // this.sendSellFormulary.disable();
  }

  // CAPTCHA KEY
  siteKey: string = '6LfLp9wdAAAAAE6q8oH8HCvvW00tMlceGq6Iafgz';
  // siteKey2: string = "6Lcc8dscAAAAAHLqRIyxw4EhHhbPw-pZatfzKZir";

  submit() {
    console.warn(this.convertorForm.controls);
  }

  initForm(): void {
    this.convertorForm = this.calcformBuilder.group({
      valorIngresado: ['', [Validators.required]],
      tipoMoneda: ['', [Validators.required]],
      resultado: ['', [Validators.required]],
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

              this.resultFiru(resultSoles); //call service

              break;

            case 'dolares':
              let tcDolares: any = (+controls.valorIngresado).toFixed(4);

              let variableDolares: any = (tcDolares * 10000).toFixed(0);

              let resultDolares: any = variableDolares + '00000000000000';

              this.resultFiru(resultDolares); //call service
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
      value +
      '&excludedSources=BakerySwap';

    return this.http.get<object>(url);
  }

  resultFiru(value?: string) {
    this.getFiru(value).subscribe((valor) => {
      this.valorActualFiru = valor.orders[1].makerAmount;
      // console.log(this.valorActualFiru);
      this.convertorForm.patchValue(
        {
          resultado: this.valorActualFiru / 100000000,
        },
        {
          emitEvent: false,
        }
      );
    });
  }

  onPhotoSellSelected(event): void {
    if (event.target.files && event.target.files[0]) {
      this.file = <File>event.target.files[0];

      // image preview
      const reader = new FileReader();
      reader.onload = (e) => (this.photoSellSelected = reader.result);
      reader.readAsDataURL(this.file);
    }
  }

  uploadSell(
    numTr: HTMLInputElement,
    bcpAccount: HTMLInputElement,
    email: HTMLInputElement
  ) {
    this.sellSendService
      .createSellSend(numTr.value, bcpAccount.value, email.value, this.file)
      .subscribe(
        (res) => {
          console.log(res);
          this.sendSellFormulary.reset();
          (<HTMLImageElement>document.querySelector('#imageY')).src =
            this.imageY;
          this.captchaElem.resetCaptcha();
        },
        (err) => console.log(err)
      );
    return false;
  }

  ngOnDestroy() {
    this.unsubscribe.next();
    this.unsubscribe.complete();
  }
}
