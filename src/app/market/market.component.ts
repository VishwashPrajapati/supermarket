import { Component, OnInit } from '@angular/core';
import { DataService } from '../data.service';

@Component({
  selector: 'app-market',
  templateUrl: './market.component.html',
  styleUrls: ['./market.component.scss'],
})
export class MarketComponent implements OnInit {
  allMarket: any = [];
  constructor(private dataservice: DataService) {}

  ngOnInit(): void {
    this.dataservice.setLoader(true);
    this.dataservice.getMarket().subscribe((e:any) => {
      this.dataservice.setLoader(false);
      this.allMarket = e;
    })
    
  }
}
