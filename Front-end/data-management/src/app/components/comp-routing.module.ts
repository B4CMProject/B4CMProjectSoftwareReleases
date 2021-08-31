import { SendRequestsComponent } from './send-requests/send-requests.component';
import { AllOffersComponent } from './all-offers/all-offers.component';
import { CostsComponent } from './costs/costs.component';
import { EscrowComponent } from './escrow/escrow.component';
import { AgreementsComponent } from './agreements/agreements.component';
import { HashValuesComponent } from './hash-values/hash-values.component';
import { NewHashValuesComponent } from './new-hash-values/new-hash-values.component';
import { RequestsComponent } from './requests/requests.component';
import { MyOffersComponent } from './my-offers/my-offers.component';
import { CompComponent } from './comp.component';
import { NewOfferComponent } from './new-offer/new-offer.component';
import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

const routes: Routes = [
  {
    path: '', component: CompComponent, children: [
      { path: '', redirectTo: 'new-offers', component: NewOfferComponent },
      { path: 'all-offers', component: AllOffersComponent },
      { path: 'send-requests', component: SendRequestsComponent },
      { path: 'new-offers', component: NewOfferComponent },
      { path: 'my-offers', component: MyOffersComponent },
      { path: 'requests', component: RequestsComponent },
      { path: 'new-hash-value', component: NewHashValuesComponent },
      { path: 'hash-values', component: HashValuesComponent },
      { path: 'agreements', component: AgreementsComponent },
      { path: 'escrow', component: EscrowComponent },
      { path: 'costs', component: CostsComponent },
    ]
  },
  // { path: '**', redirectTo: '', pathMatch: 'full' }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class CompRoutingModule { }
