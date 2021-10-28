import { Component } from '@angular/core';
import { LoadScriptsService } from './services/load-scripts.service';



@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss'],
})
export class AppComponent {


  constructor(private _CargaScripts: LoadScriptsService) {
    _CargaScripts.Carga(["/meta-login"]);
  }
}
