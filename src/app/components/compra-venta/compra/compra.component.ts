import { Component, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Observable, Subject } from 'rxjs';
import { Router } from '@angular/router';
import { HttpClient } from '@angular/common/http';
import { takeUntil } from 'rxjs/operators';

import { BuySendService } from '../../../services/buy-send.service';

import { CoinUpdateService } from '../../../services/coin-update.service';
import { FiruValueService } from 'src/app/services/firu-value.service';
import { MatDialog } from '@angular/material/dialog';
import { TemplateRef } from '@angular/core';
import { ReCaptcha2Component } from 'ngx-captcha';

interface HtmlInputEvent extends Event {
  target: HTMLInputElement & EventTarget;
}

@Component({
  selector: 'app-compra',
  templateUrl: './compra.component.html',
  styleUrls: ['./compra.component.scss', '../../../app.component.scss'],
})
export class CompraComponent implements OnInit {
  convertorForm!: FormGroup;
  unsubscribe: Subject<void>;
  ventaImpAPI: string;
  firulaixValue: string;
  valorActualFiru!: number;

  photoBuySelected: string | ArrayBuffer;

  file: File;
  imageX = 'assets/no-image-2.png';

  sendBuyFormulary: FormGroup;

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
    private buySendService: BuySendService,
    private sendBuyFormBuilder: FormBuilder,
    private coinUpdateService: CoinUpdateService,
    private firuValueService: FiruValueService
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

    this.firuValueService
      .post()
      .subscribe(
        (firures) => (
          (this.firulaixValue = firures.result.price),
          console.log(this.firulaixValue)
        )
      );

    // SEND BUY FORM
    this.sendBuyFormulary = this.sendBuyFormBuilder.group({
      opFormControl: [
        '',
        [Validators.required, Validators.pattern(this.numOpPattern)],
      ],
      addressFormControl: ['', [Validators.required, Validators.minLength(42)]],
      emailBuyFormControl: [
        '',
        [Validators.required, Validators.pattern(this.emailPattern)],
      ],
      imageBuyFormControl: ['', [Validators.required]],
      // recaptchaBuyFormControl: ['', [Validators.required]],
    });
    // this.sendBuyFormulary.disable();
  }

  // CAPTCHA KEY
  siteKey: string = '6LfLp9wdAAAAAE6q8oH8HCvvW00tMlceGq6Iafgz';

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
              this.convertorForm.patchValue(
                {
                  resultado: (
                    parseFloat(this.firulaixValue) * parseFloat(tcambioSoles)
                  ).toFixed(6),
                },
                {
                  emitEvent: false,
                }
              );

              break;

            case 'dolares':
              let tcambioDolares: any = (+controls.valorIngresado).toFixed(5);
              this.convertorForm.patchValue(
                {
                  resultado: (
                    parseFloat(this.firulaixValue) * parseFloat(tcambioDolares)
                  ).toFixed(5),
                },
                {
                  emitEvent: false,
                }
              );

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

  onPhotoBuySelected(event): void {
    if (event.target.files && event.target.files[0]) {
      this.file = <File>event.target.files[0];

      // image preview
      const reader = new FileReader();
      reader.onload = (e) => (this.photoBuySelected = reader.result);
      reader.readAsDataURL(this.file);
    }
  }

  uploadBuy(
    numOp: HTMLInputElement,
    address: HTMLInputElement,
    email: HTMLInputElement
  ) {
    this.buySendService
      .createBuySend(numOp.value, address.value, email.value, this.file)
      .subscribe(
        (res) => {
          console.log(res);
          this.sendBuyFormulary.reset();
          (<HTMLImageElement>document.querySelector('#imageX')).src =
            this.imageX;
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
