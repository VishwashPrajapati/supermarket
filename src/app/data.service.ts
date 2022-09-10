import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { BehaviorSubject, Subject } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class DataService {
  loading = new BehaviorSubject(false);

  MARKETS = new BehaviorSubject('')
  ITEMS = new BehaviorSubject('')
  CATEGORY = new BehaviorSubject('')


  liveReload = new Subject<void>();

  baseURL = 'https://marketcompare.herokuapp.com';

  constructor(private http: HttpClient) {}

  getMarket(){
    return this.MARKETS.asObservable()   
  }
  getItems(){
    return this.ITEMS.asObservable()  
  }
  getCategory(){
    return this.CATEGORY.asObservable()  
  }

  getLoader() {
    return this.loading.asObservable();
  }
  setLoader(value: boolean) {
    this.loading.next(value);
  }

  // item Service
  createItems(body: any) {
    return this.http.post(`${this.baseURL}/items`, body);
  }

  getAllItems() {
    return this.http.get(`${this.baseURL}/items`);
  }

  deleteItem(id: string) {
    return this.http.delete(`${this.baseURL}/items/${id}`);
  }

  updateItem(id: string, body: any) {
    return this.http.patch(`${this.baseURL}/items/${id}`, body);
  }

  updateItemData(id: string, body: any) {
    return this.http.patch(`${this.baseURL}/items/data/${id}`, body);
  }

  // Supermarket Service

  createMarket(body: any) {
    return this.http.post(`${this.baseURL}/supermarket`, body);
  }

  getAllMarket() {
    return this.http.get(`${this.baseURL}/supermarket`);
  }

  getSuperMarket(id: string) {
    return this.http.get(`${this.baseURL}/supermarket/${id}`);
  }

  deleteMarket(id: string) {
    return this.http.delete(`${this.baseURL}/supermarket/${id}`);
  }

  updateMarket(id: string, body: any) {
    return this.http.patch(`${this.baseURL}/supermarket/${id}`, body);
  }

  // Category Service
  getAllCategory() {
    return this.http.get(`${this.baseURL}/category`);
  }
}
