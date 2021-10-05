import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { RouterModule, Routes, ExtraOptions } from '@angular/router';

import { AdquiereComponent } from './components/adquiere/adquiere.component' ;
import { ColaborarComponent } from './components/colaborar/colaborar.component';
import  { InicioComponent } from './components/inicio/inicio.component';

const routes: Routes = [

  {
    path: '',
    redirectTo: 'inicio',
    pathMatch: 'full'
  },
  {
    path: 'adquiere',
    component: AdquiereComponent
  },
  {
    path: 'colaborar',
    component: ColaborarComponent
  },
  {
    path: 'inicio',
    component: InicioComponent
  }

];


const routerOptions: ExtraOptions = {
  anchorScrolling: "enabled",
  scrollPositionRestoration: 'enabled'
}



@NgModule({
  imports: [RouterModule.forRoot(routes, routerOptions), BrowserModule],
  exports: [RouterModule]
})
export class AppRoutingModule { }
