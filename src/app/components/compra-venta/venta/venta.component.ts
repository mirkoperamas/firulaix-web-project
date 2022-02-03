import { Component, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Observable, Subject } from 'rxjs';
import { Router } from '@angular/router';
import { HttpClient } from '@angular/common/http';
import { takeUntil } from 'rxjs/operators';

import { SellSendService } from '../../../services/sell-send.service';

import { TipoCambioService } from '../../../services/tipo-cambio.service';
import { MatDialog } from '@angular/material/dialog';
import { TemplateRef } from '@angular/core';

import Web3 from "web3";


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
  tipoCambioVenta: number;

  tipoCambioCalculado: string;
  tipoCambioImp: string;

  photoSellSelected: string | ArrayBuffer;

  file: File;
  imageY = 'assets/no-image-2.png';

  sendSellFormulary: FormGroup;

  emailPattern =
    /^(([^<>()\[\]\\.,;:\s@”]+(\.[^<>()\[\]\\.,;:\s@”]+)*)|(“.+”))@((\[[0–9]{1,3}\.[0–9]{1,3}\.[0–9]{1,3}\.[0–9]{1,3}])|(([a-zA-Z\-0–9]+\.)+[a-zA-Z]{2,}))$/;

  numTrPattern = /^[0-9]+$/;

  constructor(
    private http: HttpClient,
    private router: Router,
    private dialog: MatDialog,
    private calcformBuilder: FormBuilder,
    private sellSendService: SellSendService,
    private sendSellFormBuilder: FormBuilder,
    private tipoCambioService: TipoCambioService,
  ) {
    this.unsubscribe = new Subject();
    this.initForm();

  }

  ngOnInit() {
    // SUBSCRIBE FORM
    this.subscribeToForm();
    this.convertorForm.controls.resultado.disable();
    // this.convertorForm.controls.tipoMoneda.setValue('soles');
    this.convertorForm.controls.tipoToken.setValue('USDT');
    this.sendSellFormulary.controls.tokenFormControl.disable();
    // this.convertorForm.controls.valorIngresado.disable();

    this.tipoCambioService.getTipoCambio().subscribe((valueres) => {
      this.tipoCambioVenta = valueres.tc.bid;
      this.tipoCambioCalculado = (
        this.tipoCambioVenta +
        (this.tipoCambioVenta * 0.023)
      ).toFixed(6);
      this.tipoCambioImp = parseFloat(this.tipoCambioCalculado).toFixed(4);

      this.sendSellFormulary.patchValue({
        tCambioFormControl: this.tipoCambioImp,
      });
    });
  }


  getAmountOutMin (web3, contract, tokens, amount, decimals0, decimals1){
    const BigNumber = web3.utils.BN;
    const amountBig =  new BigNumber(amount * (Number(`1e+${decimals0}`)));
    return new Promise((resolve,reject) => {
        contract.methods.getAmountOutMin(tokens, amountBig).call(function (error, result) {
            resolve(result  / (Number(`1e+${decimals1}`)));
        }).catch((error) => {
            reject(error)
        })
    });
}

  submit() {
    console.warn(this.convertorForm.controls);
  }

  initForm(): void {
    this.convertorForm = this.calcformBuilder.group({
      valorIngresado: ['', [Validators.required]],
      // tipoMoneda: ['', [Validators.required]],
      tipoToken: ['', [Validators.required]],
      resultado: ['', [Validators.required]],
    });


    // SEND SELL FORM
    this.sendSellFormulary = this.sendSellFormBuilder.group({
      trFormControl: [
        '',
        [
          Validators.required,
          Validators.minLength(66),
          Validators.maxLength(66),
        ],
      ],
      bcpAccountFormControl: [
        '',
        [
          Validators.required,
          Validators.pattern(this.numTrPattern),
          Validators.minLength(16),
          Validators.maxLength(16),
        ],
      ],
      emailSellFormControl: [
        '',
        [Validators.required, Validators.pattern(this.emailPattern)],
      ],
      imageSellFormControl: ['', [Validators.required]],

      tCambioFormControl: ['', [Validators.required]],
      recaptchaFormControl: ['', [Validators.required]],

      amountFormControl: ['', [Validators.required]],
      tokenFormControl: ['', [Validators.required]]
    });

  }

  subscribeToForm(): void {
    this.convertorForm.valueChanges
      .pipe(takeUntil(this.unsubscribe))
      .subscribe((controls) => {
        if (controls?.valorIngresado && controls?.tipoToken) {
          switch (controls?.tipoToken) {
            case 'USDT':
              let tcUsdtSoles: number = parseFloat(this.tipoCambioCalculado);
              let tcambioUsdtSoles: string = (
                +controls.valorIngresado * +tcUsdtSoles
              ).toFixed(5);
              this.convertorForm.patchValue(
                {
                  resultado: tcambioUsdtSoles,
                },
                {
                  emitEvent: false,
                }
              );

              break;

            case 'FIRU':
              const web3 = new Web3("https://rpc.moonriver.moonbeam.network");

    const contract = new web3.eth.Contract([{"inputs":[{"internalType":"address[]","name":"_path","type":"address[]"},{"internalType":"uint256","name":"_amountIn","type":"uint256"}],"name":"getAmountOutMin","outputs":[{"internalType":"uint256","name":"","type":"uint256"}],"stateMutability":"view","type":"function"},{"inputs":[{"internalType":"address[]","name":"_token","type":"address[]"},{"internalType":"uint256","name":"_amountOut","type":"uint256"},{"internalType":"address","name":"_to","type":"address"}],"name":"swapExactETHForTokens","outputs":[],"stateMutability":"payable","type":"function"},{"inputs":[{"internalType":"address[]","name":"_token","type":"address[]"},{"internalType":"uint256","name":"_amountIn","type":"uint256"},{"internalType":"uint256","name":"_amountOutMin","type":"uint256"},{"internalType":"address","name":"_to","type":"address"}],"name":"swapExactTokensForETH","outputs":[],"stateMutability":"nonpayable","type":"function"},{"inputs":[{"internalType":"address[]","name":"_path","type":"address[]"},{"internalType":"uint256","name":"_amountIn","type":"uint256"},{"internalType":"uint256","name":"_amountOutMin","type":"uint256"},{"internalType":"address","name":"_to","type":"address"}],"name":"swapExactTokensForTokens","outputs":[],"stateMutability":"nonpayable","type":"function"}], "0x11b1c2956F207F5e0eeaa98dfCF2BF0f901a82e4");


          let tcFiruSoles: number = parseFloat(this.tipoCambioCalculado);

              this.getAmountOutMin(web3, contract, ["0x2fbe6b6f1e3e2efc69495f0c380a01c003e47225","0x98878b06940ae243284ca214f92bb71a2b032b8a", "0xE3F5a90F9cb311505cd691a46596599aA1A0AD7D"], +controls.valorIngresado, 8, 6).then((resolve: number) => {
                let IMP_RES: string = (resolve * tcFiruSoles).toFixed(5);

                this.convertorForm.patchValue(
                  {
                    resultado: IMP_RES,
                  },
                  {
                    emitEvent: false,
                  }
                );
              });


              break;

            default:
              break;
          }
        } else {
          this.convertorForm.patchValue(
            {
              resultado: '0.000',
            },
            {
              emitEvent: false,
            }
          );
        }
      });
  }

  openDialogWithRef(ref: TemplateRef<any>) {
    this.dialog.open(ref);
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
    email: HTMLInputElement,
    tCambio: HTMLInputElement,
    amount: HTMLInputElement,
    token: HTMLInputElement
  ) {
    this.sellSendService
      .createSellSend(
        numTr.value,
        bcpAccount.value,
        email.value,
        this.file,
        tCambio.value,
        amount.value,
        token.value
      )
      .subscribe(
        (res) => {
          console.log(res);
          window.location.reload();
        },
        (err) => console.log(err)
      );
    return false;
  }

  pasteToSell(){

    // console.log(this.convertorForm.value);
    this.sendSellFormulary.patchValue(
      {
        amountFormControl: this.convertorForm.value.valorIngresado,
        tokenFormControl: this.convertorForm.value.tipoToken,

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
