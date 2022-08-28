import { Component } from '@angular/core';
import { DataService } from './data.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss'],
})
export class AppComponent {
  title = 'smarket';

  loader!: boolean;
  constructor(private dataservice: DataService) {
    this.dataservice.getLoader().subscribe((value: boolean) => {
      setTimeout(() => {
        this.loader = value;
      }, 0);
    });
  }
}
