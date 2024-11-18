import { Component, OnInit } from '@angular/core';
import {faPhoneVolume} from '@fortawesome/free-solid-svg-icons';

@Component({
  selector: 'node-footer',
  templateUrl: './footer.component.html',
  styleUrls: ['./footer.component.css']
})
export class FooterComponent implements OnInit {
  faPhoneVolume = faPhoneVolume;
  constructor() { }

  ngOnInit(): void {
  }

}
