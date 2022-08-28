import { Component, OnInit, TemplateRef, ViewChild } from '@angular/core';
import { DataService } from '../data.service';
import { MatTableDataSource } from '@angular/material/table';
import { forkJoin, map, tap } from 'rxjs';
import { MatDialog } from '@angular/material/dialog';
import {
  FormBuilder,
  FormControl,
  FormGroup,
  Validators,
} from '@angular/forms';

@Component({
  selector: 'app-items',
  templateUrl: './items.component.html',
  styleUrls: ['./items.component.scss'],
})
export class ItemsComponent implements OnInit {
  allItems = new MatTableDataSource<Items>();
  displayedColumnsOne: string[] = ['name', 'category', 'action'];
  allMarket = new MatTableDataSource<Supermarket>();
  displayedColumnsTwo: string[] = ['name', 'action'];

  allCategory: any = [];

  @ViewChild('dialogRef') dialogRef!: TemplateRef<any>;

  itemForm!: FormGroup;

  constructor(
    private dataservice: DataService,
    private dialog: MatDialog,
    private fb: FormBuilder
  ) {}

  ngOnInit(): void {
    this.dataservice.setLoader(true);
    this.getData();
    this.dataservice.liveReload.subscribe((e) => {
      this.getData();
    });

    this.itemForm = new FormGroup({
      name: new FormControl('', [Validators.required]),
      catID: new FormControl('', [Validators.required]),
      active: new FormControl(true),
    });
  }

  onSubmit(val: any) {
    this.dataservice.setLoader(true);

    this.dataservice
      .createItems(val.value)
      .pipe(tap(() => this.dataservice.liveReload.next()))
      .subscribe((res) => {
        this.dataservice.setLoader(false);
      });
    this.itemForm.reset();
  }

  getData() {
    const newArray = forkJoin({
      items: this.dataservice.getAllItems().pipe(map((res: any) => res.Data)),
      market: this.dataservice.getAllMarket().pipe(map((res: any) => res.Data)),
      category: this.dataservice
        .getAllCategory()
        .pipe(map((res: any) => res.Data)),
    });

    newArray.subscribe((res: any) => {
      this.allItems = res.items;
      this.allMarket = res.market;
      this.allCategory = res.category;
      this.dataservice.setLoader(false);
    });
  }
  openDialog() {
    this.dialog.open(this.dialogRef, {});
  }

  deleteData(id: string) {
    this.dataservice.setLoader(true);
    this.dataservice
      .deleteItem(id)
      .pipe(tap(() => this.dataservice.liveReload.next()))
      .subscribe((res) => {
        this.dataservice.setLoader(false);
      });
  }
}

export interface Items {
  name: string;
  category: string;
}
export interface Supermarket {
  name: string;
}
