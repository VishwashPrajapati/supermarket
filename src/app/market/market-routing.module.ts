import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { MarketComponent } from './market.component';
import { SupermarketComponent } from './supermarket/supermarket.component';

const routes: Routes = [
  {
    path: '',
    component: MarketComponent,
  },
  {
    path: ':id',
    component: SupermarketComponent,
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class MarketRoutingModule {}
