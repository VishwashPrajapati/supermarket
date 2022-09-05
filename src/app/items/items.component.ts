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

  editMode: boolean = false;

  allCategory: any = [];

  @ViewChild('dialogRef') dialogRef!: TemplateRef<any>;
  @ViewChild('dialogRefTwo') dialogRefTwo!: TemplateRef<any>;
  itemForm!: FormGroup;
  marketForm!: FormGroup;

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
    this.marketForm = new FormGroup({
      name: new FormControl('', [Validators.required]),
      active: new FormControl(true),
    });
  }

  onSubmit(val: any, type: string) {
    this.dataservice.setLoader(true);
    if (type === 'market') {
      this.dataservice
        .createMarket(val.value)
        .pipe(tap(() => this.dataservice.liveReload.next()))
        .subscribe(() => {
          this.dataservice.setLoader(false);
        });
    } else {
      this.dataservice
        .createItems(val.value)
        .pipe(tap(() => this.dataservice.liveReload.next()))
        .subscribe(() => {
          this.dataservice.setLoader(false);
        });
      this.itemForm.reset();
    }
  }

  getData() {
    const newArray = forkJoin({
      items: this.dataservice.getAllItems().pipe(map((res: any) => res.Data)),
      market: this.dataservice.getAllMarket().pipe(map((res: any) => res.Data)),
      category: this.dataservice
        .getAllCategory()
        .pipe(map((res: any) => res.Data)),
    });

    newArray.pipe().subscribe((res: any) => {
      this.allItems = res.items;
      this.allMarket = res.market;
      this.allCategory = res.category;
      this.dataservice.setLoader(false);
    });
  }
  openDialog(value: string) {
    this.itemForm.reset();
    this.marketForm.reset();
    this.editMode = false;

    if (value === 'dialogOne') {
      this.itemForm.patchValue({ active: true });
      this.dialog.open(this.dialogRef, {});
    } else {
      this.marketForm.patchValue({ active: true });
      this.dialog.open(this.dialogRefTwo, {});
    }
  }

  editData(data: any, type?: string) {
    if (type === 'market') {
      let newData = {
        name: data.name,
        active: data.active,
      };
      this.marketForm.patchValue(newData);
      this.editMode = true;
      this.dialog.open(this.dialogRefTwo, { data: data._id });
    } else {
      let newData = {
        name: data.name,
        catID: data.category._id,
        active: data.active,
      };
      this.itemForm.patchValue(newData);
      this.editMode = true;
      this.dialog.open(this.dialogRef, { data: data._id });
    }
  }

  updateData(formValue: any, id: string, type?: string) {
    this.dataservice.setLoader(true);

    if (type === 'market') {
      let body = {
        name: formValue.name,
        active: formValue.active,
      };
      this.dataservice
        .updateMarket(id, body)
        .pipe(tap(() => this.dataservice.liveReload.next()))
        .subscribe(() => {
          this.dataservice.setLoader(false);
        });
    } else {
      let body = {
        name: formValue.name,
        category: formValue.catID,
        active: formValue.active,
      };
      this.dataservice
        .updateItemData(id, body)
        .pipe(tap(() => this.dataservice.liveReload.next()))
        .subscribe(() => {
          this.dataservice.setLoader(false);
        });
    }
  }

  deleteData(id: string, type?: string) {
    this.dataservice.setLoader(true);
    if (type === 'market') {
      this.dataservice
        .deleteMarket(id)
        .pipe(tap(() => this.dataservice.liveReload.next()))
        .subscribe((res) => {
          this.dataservice.setLoader(false);
        });
    } else {
      this.dataservice
        .deleteItem(id)
        .pipe(tap(() => this.dataservice.liveReload.next()))
        .subscribe((res) => {
          this.dataservice.setLoader(false);
        });
    }
  }
}

export interface Items {
  name: string;
  category: string;
}
export interface Supermarket {
  name: string;
}
