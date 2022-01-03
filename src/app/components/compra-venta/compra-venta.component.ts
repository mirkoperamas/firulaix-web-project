import { Component, OnInit } from '@angular/core';
interface HtmlInputEvent extends Event {
  target: HTMLInputElement & EventTarget;
}

@Component({
  selector: 'app-compra-venta',
  templateUrl: './compra-venta.component.html',
  styleUrls: ['../../app.component.scss'],
})
export class CompraVentaComponent implements OnInit {
  ngOnInit(): void {}
}
