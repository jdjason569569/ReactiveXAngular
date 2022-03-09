import { Component, OnInit } from '@angular/core';
import { ObsService } from 'src/app/services/obs.service';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']
})
export class HomeComponent implements OnInit {
  message:string = '';

  constructor(private obsService: ObsService) { }

  ngOnInit(): void {
    this.getUpdatedMessage() 
  }

  getUpdatedMessage() {
    this.obsService.messageSubject.subscribe(
      (res) => {
        this.message = res;
      }
    )
  }

}
