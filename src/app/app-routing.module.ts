import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { DashboardComponent } from './dashboard/dashboard.component';

const routes: Routes = [
  {
    path: 'items',
    loadChildren: () =>
      import('./items/items.module').then((m) => m.ItemsModule),
  },
  {
    path: 'market',
    loadChildren: () =>
      import('./market/market.module').then((m) => m.MarketModule),
  },
  {
    path: 'compare',
    loadChildren: () =>
      import('./compare/compare.module').then((m) => m.CompareModule),
  },
  {
    path: 'home',
    component: DashboardComponent,
  },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule],
})
export class AppRoutingModule {}
