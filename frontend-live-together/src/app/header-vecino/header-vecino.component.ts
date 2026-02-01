import { Component, OnInit } from '@angular/core';
import {IonicModule} from "@ionic/angular";

@Component({
  selector: 'app-header-vecino',
  templateUrl: './header-vecino.component.html',
  styleUrls: ['./header-vecino.component.scss'],
  standalone: true,
  imports: [
    IonicModule
  ]
})
export class HeaderVecinoComponent  implements OnInit {

  constructor() { }

  ngOnInit() {}

}
