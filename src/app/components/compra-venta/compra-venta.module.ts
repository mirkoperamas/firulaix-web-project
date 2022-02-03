import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { CompraComponent } from './compra/compra.component';
import { VentaComponent } from './venta/venta.component';
import { MatCardModule } from '@angular/material/card';
import { MatFormFieldModule } from '@angular/material/form-field';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatSelectModule } from '@angular/material/select';
import { MatDialogModule } from '@angular/material/dialog';
// import { NgxCaptchaModule } from 'ngx-captcha';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import {MatIconModule} from '@angular/material/icon';
// import { RecaptchaModule } from 'ng-recaptcha';


import { RECAPTCHA_SETTINGS, RecaptchaFormsModule, RecaptchaModule, RecaptchaSettings } from 'ng-recaptcha'
// import { environment } from '../../../environments/environment';



@NgModule({
  declarations: [CompraComponent, VentaComponent],
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    // NgxCaptchaModule,
    MatCardModule,
    MatFormFieldModule,
    MatInputModule,
    MatSelectModule,
    MatDialogModule,
    MatButtonModule,
    // RecaptchaModule,
    RecaptchaModule,
    RecaptchaFormsModule,
    MatIconModule
  ],
  exports: [CompraComponent, VentaComponent],
})
export class CompraVentaModule {}
