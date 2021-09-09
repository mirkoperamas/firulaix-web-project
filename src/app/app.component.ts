import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, NgForm, Validators, FormControl } from '@angular/forms';
import { Observable, Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';
import { HttpClient } from '@angular/common/http';

import { LoadScriptsService } from './services/load-scripts.service';
import { UploadService } from './services/upload.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css'],
})
export class AppComponent implements OnInit {
  unsubscribe: Subject<void>;
  convertorForm!: FormGroup;
  valorActualFiru!: number;
  ventaSunat!: number;

  imageSrc: string = '';

  uploadedFiles!: Array <File>;



  emailFormControl = new FormControl('', [
    Validators.required,
    Validators.email
  ]);

  nameFormControl = new FormControl('', [
    Validators.required,
    Validators.minLength(42)
  ]);


  captureFormControl = new FormControl('', [
    Validators.required
  ])

  



  constructor(private formBuilder: FormBuilder, private http: HttpClient, private _CargaScripts: LoadScriptsService, private uploadService: UploadService) {
    this.unsubscribe = new Subject();
    this.initForm();

    _CargaScripts.Carga(["/meta-login"]);
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



  handleInputChange(e:any) {
    var file = e.dataTransfer ? e.dataTransfer.files[0] : e.target.files[0];
    var pattern = /image-*/;
    var reader = new FileReader();
    if (!file.type.match(pattern)) {
      alert('invalid format');
      return;
    }
    reader.onload = this._handleReaderLoaded.bind(this);
    reader.readAsDataURL(file);


  }
  _handleReaderLoaded(e:any) {
    let reader = e.target;
    this.imageSrc = reader.result;
    // console.log(this.imageSrc);
    
  }


  // SaveData(form:any){
  //   console.log(form.value, this.imageSrc);
  // }


  // register(){

  //   let resultadoData = {
  //     token: this.nameFormControl.value,
  //     email: this.emailFormControl.value,
  //     captura: this.imageSrc
  //   }

  //   console.log(this.nameFormControl.value, this.emailFormControl.value, this.imageSrc)
  //   console.log(resultadoData);
    
  // }


  onUpload(){
    let formData = new FormData();
    for(let i = 0; i < this.uploadedFiles.length; i++){ 
      formData.append("uploads[]", this.uploadedFiles[i], this.uploadedFiles[i].name);
      console.log(this.uploadedFiles)
    }
    // Call service
    this.uploadService.uploadFile(formData).subscribe((res) => {
      console.log('Response: ', res)
    });

    console.log(this.nameFormControl.value, this.emailFormControl.value, this.imageSrc)
  }

  
  onFileChange(e?:any){
    this.uploadedFiles = e.target.files;
  }


  ngOnDestroy() {
    this.unsubscribe.next();
    this.unsubscribe.complete();
  }

}
