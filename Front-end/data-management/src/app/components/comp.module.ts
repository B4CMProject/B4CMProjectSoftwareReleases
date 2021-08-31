import { NewOfferComponent } from './new-offer/new-offer.component';
import { CompComponent } from './comp.component';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { CompRoutingModule } from './comp-routing.module';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatProgressBarModule } from '@angular/material/progress-bar';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { MatRadioModule, MAT_RADIO_DEFAULT_OPTIONS } from '@angular/material/radio';
import { MatTabsModule } from '@angular/material/tabs';
import { MatIconModule } from '@angular/material/icon';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatNativeDateModule } from '@angular/material/core';
import { MatSidenavModule } from '@angular/material/sidenav';
import { MatListModule } from '@angular/material/list';
import { MyOffersComponent } from './my-offers/my-offers.component';
import { RequestsComponent } from './requests/requests.component';
import { NewHashValuesComponent } from './new-hash-values/new-hash-values.component';
import { HashValuesComponent } from './hash-values/hash-values.component';
import { AgreementsComponent } from './agreements/agreements.component';
import { EscrowComponent } from './escrow/escrow.component';
import { CostsComponent } from './costs/costs.component';
import { AllOffersComponent } from './all-offers/all-offers.component';
import { SendRequestsComponent } from './send-requests/send-requests.component';
import { MatMenuModule } from '@angular/material/menu';
import { CustomSnackbarComponent } from './custom-snackbar/custom-snackbar.component';
import { MatSnackBarModule } from '@angular/material/snack-bar';
import { NgxPaginationModule } from 'ngx-pagination';
import { MatTooltipModule } from '@angular/material/tooltip';

@NgModule({
  declarations: [
    CompComponent,
    NewOfferComponent,
    MyOffersComponent,
    RequestsComponent,
    NewHashValuesComponent,
    HashValuesComponent,
    AgreementsComponent,
    EscrowComponent,
    CostsComponent,
    AllOffersComponent,
    SendRequestsComponent,
    CustomSnackbarComponent
  ],
  imports: [
    CommonModule,
    CompRoutingModule,
    FormsModule,
    ReactiveFormsModule,
    NgxPaginationModule,
    MatToolbarModule,
    MatProgressBarModule,
    MatButtonModule,
    MatCardModule,
    MatInputModule,
    MatSelectModule,
    MatRadioModule,
    MatTabsModule,
    MatIconModule,
    MatDatepickerModule,
    MatNativeDateModule,
    MatSidenavModule,
    MatListModule,
    MatMenuModule,
    MatSnackBarModule,
    MatTooltipModule
  ],
  exports: [CustomSnackbarComponent],
  providers: [
    {
      provide: MAT_RADIO_DEFAULT_OPTIONS,
      useValue: { color: 'primary' },
    },
  ]
})
export class CompModule { }
