import { HttpErrorResponse } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { OperationsService } from 'src/app/services/operations.service';
import { PopupService } from 'src/app/services/popup.service';

@Component({
  selector: 'app-hash-values',
  templateUrl: './hash-values.component.html',
  styleUrls: ['./hash-values.component.scss']
})
export class HashValuesComponent implements OnInit {
  allAgreements: any = [];
  config: any;
  selectedId: string = '';
  userType: any;
  offersData: any = [];
  hashedData: any = [];
  constructor(
    private oprSrv: OperationsService,
    private popSrv: PopupService
  ) {
    this.config = {
      currentPage: 1,
      itemsPerPage: 10
    }
    this.userType = sessionStorage.getItem('uType');
  }

  ngOnInit(): void {
    this.oprSrv.getOffers().subscribe(res => {
      if (res == null) {
        this.offersData.length = 0;
      } else {
        this.offersData = res;
      }
    }, (error: HttpErrorResponse) => {
      this.popSrv.showError(error.error.errors.message);
    });
    this.oprSrv.getAllAgreements().subscribe(res => {
      this.allAgreements = res;
    }, (error: HttpErrorResponse) => {
      this.popSrv.showError(error.error.errors.message);
    });
  }

  getHashDatabyAgreementId() {
    const data = this.userType == 'Provider' ? {
      offer_id: this.selectedId
    } : {
      agreement_id: this.selectedId
    }
    this.oprSrv.getDataHashByOfferId(data, this.userType == 'Provider' ? 'GetDataHashByOffer' : 'GetDataHashByAgreementID').subscribe(res => {
      if (res == null) {
        this.hashedData.length = 0
      } else {
        this.hashedData = res;
      }
    }, (error: HttpErrorResponse) => {
      this.popSrv.showError(error.error.errors.message);
    });
  }

}
