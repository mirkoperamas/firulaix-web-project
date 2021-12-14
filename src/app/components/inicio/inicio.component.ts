import { Component, OnInit } from '@angular/core';

import { TemplateRef } from '@angular/core';

import { MatDialog } from '@angular/material/dialog';

import { Router } from '@angular/router';


@Component({
  selector: 'app-inicio',
  templateUrl: './inicio.component.html',
  styleUrls: ['./inicio.component.scss', '../../app.component.scss']
})
export class InicioComponent implements OnInit {

  panelOpenState = false;

  copy = '0x2fbe6b6f1e3e2efc69495f0c380a01c003e47225';

  title = 'angular-fragment';

  
  constructor(private dialog: MatDialog,  private router: Router) { }


  openDialogWithRef(ref: TemplateRef<any>) {
    this.dialog.open(ref);
  }

  public buttonMoveSection(fragment: string):void{
    this.router.navigateByUrl('#' + fragment);
  }


  ngOnInit(): void {
  }
}
