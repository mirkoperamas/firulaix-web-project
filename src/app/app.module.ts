import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

// import { HttpModule } from '@angular/http';
import { TranslateHttpLoader } from '@ngx-translate/http-loader';
import { HttpClientModule, HttpClient } from '@angular/common/http';


import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';

import {MatCardModule} from '@angular/material/card';
import {MatInputModule} from '@angular/material/input';
import {MatFormFieldModule} from '@angular/material/form-field';
import {MatSelectModule} from '@angular/material/select';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import {MatToolbarModule} from '@angular/material/toolbar';
import {MatIconModule} from '@angular/material/icon';
import {MatButtonModule} from '@angular/material/button';
import {MatTabsModule} from '@angular/material/tabs';
import {MatListModule} from '@angular/material/list';
import {MatProgressSpinnerModule} from '@angular/material/progress-spinner';
import {MatExpansionModule} from '@angular/material/expansion';
import {MatTooltipModule} from '@angular/material/tooltip';


import{ LoadScriptsService } from './services/load-scripts.service';

import { NavigationComponent } from './components/navigation/navigation.component';
import { ColaborarComponent } from './components/colaborar/colaborar.component';
import { AdquiereComponent } from './components/adquiere/adquiere.component';
import { InicioComponent } from './components/inicio/inicio.component';

import { ClipboardModule } from '@angular/cdk/clipboard';

import {MatDialogModule} from '@angular/material/dialog';
import { FooterComponent } from './components/footer/footer.component';
import { TranslateLoader, TranslateModule } from '@ngx-translate/core';

import {MatSlideToggleModule} from '@angular/material/slide-toggle';

import { NgxCaptchaModule } from 'ngx-captcha';
import { AdminManagementCalculatorComponent } from './components/admin-management-calculator/admin-management-calculator.component';





export function HttpLoaderFactory(http: HttpClient){
  return new TranslateHttpLoader(http, './assets/i18n/', '.json');
}
 
@NgModule({
  declarations: [
    AppComponent,
    NavigationComponent,
    ColaborarComponent,
    AdquiereComponent,
    InicioComponent,
    FooterComponent,
    AdminManagementCalculatorComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    BrowserAnimationsModule,
    HttpClientModule,
    TranslateModule.forRoot({
      loader: {
        provide: TranslateLoader,
        useFactory: HttpLoaderFactory,
        deps: [HttpClient]
      }
    }),
    MatCardModule,
    MatInputModule,
    MatFormFieldModule,
    MatSelectModule,
    ReactiveFormsModule,
    NgxCaptchaModule,
    MatToolbarModule,
    MatIconModule,
    FormsModule,
    MatButtonModule,
    MatTabsModule,
    MatListModule,
    MatProgressSpinnerModule,
    MatExpansionModule,
    ClipboardModule,
    MatDialogModule,
    MatSlideToggleModule,
    MatTooltipModule
  ],
  providers: [LoadScriptsService],
  bootstrap: [AppComponent]
})
export class AppModule { }
