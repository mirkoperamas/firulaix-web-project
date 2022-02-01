import { Component, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Observable, Subject } from 'rxjs';
import { Router } from '@angular/router';
import { HttpClient } from '@angular/common/http';
import { takeUntil } from 'rxjs/operators';

import Web3 from "web3";


import { BuySendService } from '../../../services/buy-send.service';

import { TipoCambioService } from '../../../services/tipo-cambio.service';
import { MatDialog } from '@angular/material/dialog';
import { TemplateRef } from '@angular/core';


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
  tipoCambioCompra: string;

  tipoCambioCalculado: string;
  tipoCambioImp: string;

  photoBuySelected: string | ArrayBuffer;

  file: File;
  imageX = 'assets/no-image-2.png';

  sendBuyFormulary: FormGroup;

  aeiou: string;

  emailPattern =
    /^(([^<>()\[\]\\.,;:\s@”]+(\.[^<>()\[\]\\.,;:\s@”]+)*)|(“.+”))@((\[[0–9]{1,3}\.[0–9]{1,3}\.[0–9]{1,3}\.[0–9]{1,3}])|(([a-zA-Z\-0–9]+\.)+[a-zA-Z]{2,}))$/;

  numOpPattern = /^[0-9]+$/;

  constructor(
    private http: HttpClient,
    private router: Router,
    private dialog: MatDialog,
    private calcformBuilder: FormBuilder,
    private buySendService: BuySendService,
    private sendBuyFormBuilder: FormBuilder,
    private tipoCambioService: TipoCambioService,
  ) {
    this.unsubscribe = new Subject();
    this.initForm();

  }

  

  ngOnInit() {
    // SUBSCRIBE FORM
    this.subscribeToForm();
    this.convertorForm.controls.resultado.disable();
    this.convertorForm.controls.tipoMoneda.setValue('soles');
    this.convertorForm.controls.tipoToken.setValue('usdt');
    // this.convertorForm.controls.valorIngresado.disable();

    this.tipoCambioService.getTipoCambio().subscribe((valueres) => {
      this.tipoCambioCompra = valueres.tc.ask;
      this.tipoCambioCalculado = (
        parseFloat(this.tipoCambioCompra) +
        parseFloat(this.tipoCambioCompra) * 0.01729
      ).toFixed(8);
      this.tipoCambioImp = parseFloat(this.tipoCambioCalculado).toFixed(4);

      this.sendBuyFormulary.patchValue({
        tCambioFormControl: this.tipoCambioImp,
      });
    });

    // SEND BUY FORM
    this.sendBuyFormulary = this.sendBuyFormBuilder.group({
      opFormControl: [
        '',
        [
          Validators.required,
          Validators.pattern(this.numOpPattern),
          Validators.minLength(8),
          Validators.maxLength(8),
        ],
      ],
      addressFormControl: ['', [Validators.required, Validators.minLength(42)]],
      emailBuyFormControl: [
        '',
        [Validators.required, Validators.pattern(this.emailPattern)],
      ],
      imageBuyFormControl: ['', [Validators.required]],
      tCambioFormControl: ['', [Validators.required]],
      recaptchaFormControl: ['', [Validators.required]],
    });
    // this.sendBuyFormulary.disable();


  //   const contractToken = () => {
  //     // return web3 ? new web3.eth.Contract(ERC20ABI, tokenAddress) : null;
  // }


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

  contractToken(){
    const web3 = new Web3("https://rpc.moonriver.moonbeam.network");

    const contract = new web3.eth.Contract([{"inputs":[{"internalType":"address[]","name":"_path","type":"address[]"},{"internalType":"uint256","name":"_amountIn","type":"uint256"}],"name":"getAmountOutMin","outputs":[{"internalType":"uint256","name":"","type":"uint256"}],"stateMutability":"view","type":"function"},{"inputs":[{"internalType":"address[]","name":"_token","type":"address[]"},{"internalType":"uint256","name":"_amountOut","type":"uint256"},{"internalType":"address","name":"_to","type":"address"}],"name":"swapExactETHForTokens","outputs":[],"stateMutability":"payable","type":"function"},{"inputs":[{"internalType":"address[]","name":"_token","type":"address[]"},{"internalType":"uint256","name":"_amountIn","type":"uint256"},{"internalType":"uint256","name":"_amountOutMin","type":"uint256"},{"internalType":"address","name":"_to","type":"address"}],"name":"swapExactTokensForETH","outputs":[],"stateMutability":"nonpayable","type":"function"},{"inputs":[{"internalType":"address[]","name":"_path","type":"address[]"},{"internalType":"uint256","name":"_amountIn","type":"uint256"},{"internalType":"uint256","name":"_amountOutMin","type":"uint256"},{"internalType":"address","name":"_to","type":"address"}],"name":"swapExactTokensForTokens","outputs":[],"stateMutability":"nonpayable","type":"function"}], "0x11b1c2956F207F5e0eeaa98dfCF2BF0f901a82e4");

    this.getAmountOutMin(web3, contract, ["0xE3F5a90F9cb311505cd691a46596599aA1A0AD7D","0x98878b06940ae243284ca214f92bb71a2b032b8a", "0x2fbe6b6f1e3e2efc69495f0c380a01c003e47225"], 1000, 6, 8).then(resolve => {
      console.log(resolve)
    });
    

  }

  

  submit() {
    console.warn(this.convertorForm.controls);
  }

  initForm(): void {
    this.convertorForm = this.calcformBuilder.group({
      valorIngresado: ['', [Validators.required]],
      tipoMoneda: ['', [Validators.required]],
      tipoToken: ['', [Validators.required]],
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
              let tcSoles: any = this.tipoCambioCalculado;
              let tcambioSoles: any = (
                +controls.valorIngresado / +tcSoles
              ).toFixed(4);
              this.convertorForm.patchValue(
                {
                  resultado: parseFloat(tcambioSoles).toFixed(5),
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
                    parseFloat(tcambioDolares) -
                    parseFloat(tcambioDolares) * 0.009
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
        } else {
          this.convertorForm.patchValue(
            {
              resultado: '0.00',
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
    email: HTMLInputElement,
    tCambio: HTMLInputElement
  ) {
    this.buySendService
      .createBuySend(
        numOp.value,
        address.value,
        email.value,
        this.file,
        tCambio.value
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

  ngOnDestroy() {
    this.unsubscribe.next();
    this.unsubscribe.complete();
  }
}


