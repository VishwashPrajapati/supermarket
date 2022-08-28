import { Component, OnInit, ViewChild, ElementRef } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { DataService } from 'src/app/data.service';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { tap } from 'rxjs';

export interface UserData {
  name: string;
  price: string;
  category: string;
}

@Component({
  selector: 'app-supermarket',
  templateUrl: './supermarket.component.html',
  styleUrls: ['./supermarket.component.scss'],
})
export class SupermarketComponent implements OnInit {
  marketName: string = '';
  marketId: string = '';
  priceValue: number = 0;
  displayedColumns: string[] = ['srno', 'name', 'category', 'price'];
  dataSource!: MatTableDataSource<UserData>;

  @ViewChild(MatPaginator) paginator!: MatPaginator;
  @ViewChild(MatSort) sort!: MatSort;
  @ViewChild('price') price!: ElementRef;

  constructor(
    private dataservice: DataService,
    private activeRoute: ActivatedRoute
  ) {
    this.dataservice.setLoader(true);
    this.activeRoute.paramMap.subscribe((res: any) => {
      this.dataservice.getSuperMarket(res.params.id).subscribe((res: any) => {
        this.marketName = res.Data.name;
        this.marketId = res.Data._id;
        this.dataSource = new MatTableDataSource(res.Data.items);

        this.dataSource.filterPredicate = (data: any, filter: string) => {
          const accumulator = () => {
            return data.category.name + data.name + data.price;
          };
          const dataStr = Object.keys(data)
            .reduce(accumulator, '')
            .toLowerCase();

          // Transform the filter by converting it to lowercase and removing whitespace.
          const transformedFilter = filter.trim().toLowerCase();
          return dataStr.indexOf(transformedFilter) !== -1;
        };

        this.dataSource.paginator = this.paginator;
        this.dataSource.sort = this.sort;
        this.dataservice.setLoader(false);
      });
    });
  }

  ngOnInit(): void {}

  applyFilter(event: Event) {
    const filterValue = (event.target as HTMLInputElement).value;
    this.dataSource.filter = filterValue;

    if (this.dataSource.paginator) {
      this.dataSource.paginator.firstPage();
    }
  }

  updateItem(itemid: string) {
    this.dataservice.setLoader(true);
    this.dataservice
      .updateItem(itemid, {
        s_id: this.marketId,
        price: this.price.nativeElement.value,
      })
      .pipe(tap(() => this.dataservice.liveReload.next()))
      .subscribe((res) => {
        this.dataservice.setLoader(false);
      });
  }
}
