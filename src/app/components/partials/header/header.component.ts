import { Component, OnInit } from '@angular/core';
import {faPhoneVolume} from '@fortawesome/free-solid-svg-icons';
import {faWeightHanging} from '@fortawesome/free-solid-svg-icons';
import { AuthService } from 'src/app/services/auth.service';

@Component({
  selector: 'node-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.css']
})
export class HeaderComponent implements OnInit {
  faPhoneVolume = faPhoneVolume;
  faWeightHanging = faWeightHanging;
  isAuth!: boolean;
  constructor(private auth: AuthService) { }

  ngOnInit(): void {
    this.auth.isAuth$.subscribe(
      (bool: boolean)=>{
        this.isAuth = bool;
      }
    )
  }

  logout(): void{
    this.auth.logout();
  }

}
