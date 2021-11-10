import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { RouterModule, Routes, ExtraOptions } from '@angular/router';
import { AdminManagementCalculatorComponent } from './components/admin-management-calculator/admin-management-calculator.component';

import { AdquirirComponent } from './components/adquirir/adquirir.component' ;
import { ColaboracionComponent } from './components/colaboracion/colaboracion.component';
import  { InicioComponent } from './components/inicio/inicio.component';

const routes: Routes = [

  {
    path: '',
    redirectTo: 'inicio',
    pathMatch: 'full'
  },
  {
    path: 'adquirir',
    component: AdquirirComponent
  },
  {
    path: 'colaboracion',
    component: ColaboracionComponent
  },
  {
    path: 'inicio',
    component: InicioComponent
  },
  {
    path: 'admin-management-calculator',
    component: AdminManagementCalculatorComponent
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
