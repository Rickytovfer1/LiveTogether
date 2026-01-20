import { Component, OnInit } from '@angular/core';
import {IonicModule} from "@ionic/angular";

@Component({
  selector: 'app-footer',
  templateUrl: './footer.component.html',
  styleUrls: ['./footer.component.scss'],
  standalone: true,
  imports: [
    IonicModule
  ]
})
export class FooterComponent  implements OnInit {

  popoverId = 'popover-agregar-' + Math.random().toString(36).substring(2, 11);

  constructor() { }

  ngOnInit() {}

}
