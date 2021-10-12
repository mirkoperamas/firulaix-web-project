import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators, FormControl } from '@angular/forms';
import { Observable, Subject } from 'rxjs';
import {Router} from '@angular/router'

import { HttpClient } from '@angular/common/http';

import { takeUntil } from 'rxjs/operators';

import {RegisterService} from '../../services/register.service'



 
interface HtmlInputEvent extends Event{
  target: HTMLInputElement & EventTarget;
}


@Component({
  selector: 'app-colaborar',
  templateUrl: './colaborar.component.html',
  styleUrls: ['./colaborar.component.css','../general-style-components.css']
})
export class ColaborarComponent implements OnInit {

convertorForm!: FormGroup;

unsubscribe: Subject<void>;


ventaSunat!: number;

valorActualFiru!: number;


photoSelected: string | ArrayBuffer;

file: File;


formularioRegistro = new FormGroup({
  op: new FormControl('', [Validators.required, Validators.minLength(6)]),
  adres: new FormControl('', [Validators.required, Validators.minLength(42)]),
  correo: new FormControl('', [Validators.required, Validators.email]),
});






opFormControl = new FormControl('', [
  Validators.required,
  Validators.minLength(6)
]);

emailFormControl = new FormControl('', [
  Validators.required,
  Validators.email
]);

addressFormControl = new FormControl('', [
  Validators.required,
  Validators.minLength(42)
]);


imageFormControl = new FormControl('', [
  Validators.required
])





  constructor(private formBuilder: FormBuilder, private http: HttpClient, private registerService: RegisterService, private router: Router) {

    this.unsubscribe = new Subject();
    this.initForm();
   }


  

  ngOnInit() {
    this.subscribeToForm();
    this.convertorForm.controls.resultado.disable();
    this.convertorForm.controls.tipoMoneda.setValue('soles');
    this.resultSunat();
  }

  initForm(): void {
    this.convertorForm = this.formBuilder.group({
      valorIngresado: ['', [Validators.required]],
      tipoMoneda: ['', [Validators.required]],
      resultado: ['', [Validators.required]],
    });
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
              let tcSoles: any = (this.ventaSunat * 1.008).toFixed(4);
              let tcambioSoles: any = (
                +controls.valorIngresado / +tcSoles
              ).toFixed(4);

              let variableSoles: any = (tcambioSoles * 10000).toFixed(0);

              let resultSoles: any = variableSoles + '00000000000000';

              this.resultFiru(resultSoles); //llamar al servicio

              break;

            case 'dolares':
              let tcDolares: any = (+controls.valorIngresado ).toFixed(4);
              // let tcambioDolares: any = (
              //   +controls.valorIngresado / +tcDolares
              // ).toFixed(4);

              let variableDolares: any = (tcDolares * 10000).toFixed(0);

              let resultDolares: any = variableDolares + '00000000000000';

              this.resultFiru(resultDolares); //llamar al servicio
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
      console.log(this.valorActualFiru);

      this.convertorForm.patchValue(
        {
          resultado: (this.valorActualFiru / 100000000)*1.06

        },
        {
          emitEvent: false,
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
        this.ventaSunat = valor.venta;
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
          // this.router.navigate(['/registers'])
        },
        err => console.log(err)
      );
    return false;
  }



  guardar(){
    console.log(this.formularioRegistro.value);
  }


  btnAddress(){
    alert('hola')
    console.log('hola')
  }

  ngOnDestroy() {
    this.unsubscribe.next();
    this.unsubscribe.complete();
  }

}
