import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { BehaviorSubject, Subject } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class DataService {
  loading = new BehaviorSubject(false);

  headers = {
    'content-type': 'application/json',
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Methods': 'GET,HEAD,OPTIONS,POST,PUT',
    'Access-Control-Allow-Headers':
      'Access-Control-Allow-Headers, Origin,Accept, X-Requested-With, Content-Type, Access-Control-Request-Method, Access-Control-Request-Headers',
  };

  liveReload = new Subject<void>();

  baseURL = 'https://marketcompare.herokuapp.com';

  constructor(private http: HttpClient) {}

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

  // Supermarket Service
  getAllMarket() {
    return this.http.get(`${this.baseURL}/supermarket`);
  }

  getSuperMarket(id: string) {
    return this.http.get(`${this.baseURL}/supermarket/${id}`);
  }

  // Category Service
  getAllCategory() {
    return this.http.get(`${this.baseURL}/category`);
  }
}
