import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { RouterModule, Routes, ExtraOptions } from '@angular/router';

import { AdminManagementCalculatorComponent } from './components/admin-management-calculator/admin-management-calculator.component';
import { ColaboracionComponent } from './components/colaboracion/colaboracion.component';
import  { CompraVentaComponent } from './components/compra-venta/compra-venta.component';

const routes: Routes = [

  {
    path: 'colaboracion',
    component: ColaboracionComponent
  },
  {
    path: 'admin-management-calculator',
    component: AdminManagementCalculatorComponent
  },
  {
    path: 'compra-venta',
    component: CompraVentaComponent
  },
  {
    path: '**',
    redirectTo: 'compra-venta',
    pathMatch: 'full'
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
