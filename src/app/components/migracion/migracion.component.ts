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

    this.initForm();

    _CargaScripts.Carga(["/meta-login"]);
   }

  
  ngOnInit() {

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




  initForm(): void {
  }



openDialogWithRef(ref: TemplateRef<any>) {
  this.dialog.open(ref);
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
  }
  

}
