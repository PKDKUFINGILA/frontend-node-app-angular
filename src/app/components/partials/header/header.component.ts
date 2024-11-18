import { Component, OnInit } from '@angular/core';
import {faPhoneVolume} from '@fortawesome/free-solid-svg-icons';
import {faWeightHanging} from '@fortawesome/free-solid-svg-icons';

@Component({
  selector: 'node-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.css']
})
export class HeaderComponent implements OnInit {
  faPhoneVolume = faPhoneVolume;
  faWeightHanging = faWeightHanging;
  constructor() { }

  ngOnInit(): void {
  }

}
