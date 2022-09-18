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
import { ActivatedRoute } from '@angular/router';
import { Location } from '@angular/common';

@Component({
  selector: 'app-items',
  templateUrl: './items.component.html',
  styleUrls: ['./items.component.scss'],
})
export class ItemsComponent implements OnInit {
  allItems = new MatTableDataSource<Items>();
  displayedColumnsOne: string[] = ['name', 'category'];
  displayedColumnsTwo: string[] = ['name'];
  allMarket = new MatTableDataSource<Supermarket>();

  editMode: boolean = false;

  allCategory: any = [];

  editDataMode = false;

  @ViewChild('dialogRef') dialogRef!: TemplateRef<any>;
  @ViewChild('dialogRefTwo') dialogRefTwo!: TemplateRef<any>;
  @ViewChild('dialogRefThree') dialogRefThree!: TemplateRef<any>;
  itemForm!: FormGroup;
  marketForm!: FormGroup;
  categoryForm!: FormGroup;

  constructor(
    private dataservice: DataService,
    private dialog: MatDialog,
    private fb: FormBuilder,
    private location: Location
  ) {
    const url = this.location.path();
    if (url.includes('edit')) {
      this.displayedColumnsOne.push('action');
      this.displayedColumnsTwo.push('action');
      this.editDataMode = true;
    } else {
      this.editDataMode = false;
    }
  }

  ngOnInit(): void {
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
    this.categoryForm = new FormGroup({
      name: new FormControl('', [Validators.required]),
      active: new FormControl(true),
    });
  }

  onSubmit(val: any, type: string) {
    if (type === 'market') {
      this.dataservice
        .createMarket(val.value)
        .pipe(tap(() => this.dataservice.liveReload.next()))
        .subscribe(() => {
          // this.dataservice.setLoader(false);
        });
    } else if (type === 'items') {
      this.dataservice
        .createItems(val.value)
        .pipe(tap(() => this.dataservice.liveReload.next()))
        .subscribe(() => {
          // this.dataservice.setLoader(false);
        });
      this.itemForm.reset();
    } else {
      this.dataservice
        .createCategory(val.value)
        .pipe(tap(() => this.dataservice.liveReload.next()))
        .subscribe(() => {
          // this.dataservice.setLoader(false);
        });
      this.categoryForm.reset();
    }
  }

  getData() {
    this.dataservice.getItems().subscribe((res: any) => {
      this.allItems = res;
    });
    this.dataservice.getCategory().subscribe((res: any) => {
      this.allCategory = res;
    });
    this.dataservice.getMarket().subscribe((res: any) => {
      this.allMarket = res;
    });
    // this.dataservice.setLoader(false);
  }
  openDialog(value: string) {
    this.itemForm.reset();
    this.marketForm.reset();
    this.categoryForm.reset();
    this.editMode = false;

    if (value === 'dialogOne') {
      this.itemForm.patchValue({ active: true });
      this.dialog.open(this.dialogRef, {});
    } else if (value === 'dialogTwo') {
      this.marketForm.patchValue({ active: true });
      this.dialog.open(this.dialogRefTwo, {});
    } else {
      this.categoryForm.patchValue({ active: true });
      this.dialog.open(this.dialogRefThree, {});
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
    } else if (type === 'items') {
      let newData = {
        name: data.name,
        catID: data.category._id,
        active: data.active,
      };
      this.itemForm.patchValue(newData);
      this.editMode = true;
      this.dialog.open(this.dialogRef, { data: data._id });
    } else {
      let newData = {
        name: data.name,
        active: data.active,
      };
      this.categoryForm.patchValue(newData);
      this.editMode = true;
      this.dialog.open(this.dialogRefThree, { data: data._id });
    }
  }

  updateData(formValue: any, id: string, type?: string) {
    if (type === 'market') {
      let body = {
        name: formValue.name,
        active: formValue.active,
      };
      this.dataservice
        .updateMarket(id, body)
        .pipe(tap(() => this.dataservice.liveReload.next()))
        .subscribe(() => {
          // this.dataservice.setLoader(false);
        });
    } else if (type === 'items') {
      let body = {
        name: formValue.name,
        category: formValue.catID,
        active: formValue.active,
      };
      this.dataservice
        .updateItemData(id, body)
        .pipe(tap(() => this.dataservice.liveReload.next()))
        .subscribe(() => {
          // this.dataservice.setLoader(false);
        });
    } else {
      let body = {
        name: formValue.name,
        active: formValue.active,
      };
      this.dataservice
        .updateCategory(id, body)
        .pipe(tap(() => this.dataservice.liveReload.next()))
        .subscribe(() => {});
    }
  }

  deleteData(id: string, type?: string) {
    if (type === 'market') {
      this.dataservice
        .deleteMarket(id)
        .pipe(tap(() => this.dataservice.liveReload.next()))
        .subscribe((res) => {
          // this.dataservice.setLoader(false);
        });
    } else if (type === 'items') {
      this.dataservice
        .deleteItem(id)
        .pipe(tap(() => this.dataservice.liveReload.next()))
        .subscribe((res) => {
          // this.dataservice.setLoader(false);
        });
    } else {
      this.dataservice
        .deleteCategory(id)
        .pipe(tap(() => this.dataservice.liveReload.next()))
        .subscribe((res) => {
          // this.dataservice.setLoader(false);
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
