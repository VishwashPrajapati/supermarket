import { Component, OnInit, ViewChild, ElementRef } from '@angular/core';
import { DataService } from 'src/app/data.service';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { map, tap } from 'rxjs';

export interface UserData {
  name: string;
  price: string;
  compare: string;
}

@Component({
  selector: 'app-compare',
  templateUrl: './compare.component.html',
  styleUrls: ['./compare.component.scss'],
})
export class CompareComponent implements OnInit {
  marketName: string = '';
  marketId: string = '';
  priceValue: number = 0;
  displayedColumns: string[] = ['srno', 'name'];
  dataSource!: MatTableDataSource<UserData>;

  @ViewChild(MatPaginator) paginator!: MatPaginator;
  @ViewChild(MatSort) sort!: MatSort;
  @ViewChild('price') price!: ElementRef;

  newData: any = [];
  compare: any = [];
  constructor(private dataservice: DataService) {
    this.dataservice.getMarket().subscribe((res: any) => {
      res.forEach((ele: any) => {
        this.displayedColumns.push(ele.name);
        ele.items.forEach((e: any, index: any) => {
          const ids = this.newData.findIndex(
            (newname: any) => newname.name === e.name
          );
          if (ids === -1) {
            this.newData.push({
              name: e.name,
              compare: [{ name: ele.name, price: e.price }],
            });
          } else {
            this.newData[index].compare.push({
              name: ele.name,
              price: e.price,
            });
          }
        });
      });
      this.dataSource = new MatTableDataSource(this.newData);

      this.dataSource.filterPredicate = (data: any, filter: string) => {
        const accumulator = (e: any) => {
          return data.name;
        };
        const dataStr = Object.keys(data).reduce(accumulator, '').toLowerCase();

        // Transform the filter by converting it to lowercase and removing whitespace.
        const transformedFilter = filter.trim().toLowerCase();
        return dataStr.indexOf(transformedFilter) !== -1;
      };
      setTimeout(() => {
        this.dataSource.paginator = this.paginator;
        this.dataSource.sort = this.sort;
        // this.dataservice.setLoader(false);
      }, 100);
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
    this.dataservice
      .updateItem(itemid, {
        s_id: this.marketId,
        price: this.price.nativeElement.value,
      })
      .pipe(tap(() => this.dataservice.liveReload.next()))
      .subscribe();
  }
}
