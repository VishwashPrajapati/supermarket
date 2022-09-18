import { Component } from '@angular/core';
import { forkJoin, map, tap } from 'rxjs';
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
    this.getData()
    this.dataservice.liveReload.subscribe((e) => {
      this.getData()
    })
  }

  getData(){
    this.dataservice.setLoader(true)
    const newArray = forkJoin({
      items: this.dataservice.getAllItems().pipe(map((res: any) => res.Data)),
      market: this.dataservice.getAllMarket().pipe(map((res: any) => res.Data)),
      category: this.dataservice
        .getAllCategory()
        .pipe(map((res: any) => res.Data)),
    });

    newArray.subscribe((res: any) => {
      this.dataservice.setLoader(false)
      this.dataservice.ITEMS.next(res.items)
      this.dataservice.CATEGORY.next(res.category)
      this.dataservice.MARKETS.next(res.market)
    });
  }
}
