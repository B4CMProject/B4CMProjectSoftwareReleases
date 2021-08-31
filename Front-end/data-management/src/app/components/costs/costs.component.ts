import { HttpErrorResponse } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { OperationsService } from 'src/app/services/operations.service';
import { PopupService } from 'src/app/services/popup.service';

@Component({
  selector: 'app-costs',
  templateUrl: './costs.component.html',
  styleUrls: ['./costs.component.scss']
})
export class CostsComponent implements OnInit {

  costData: any = []
  // userType: any;
  config: any;
  constructor(
    private oprSrv: OperationsService,
    private popSrv: PopupService
  ) {
    this.config = {
      currentPage: 1,
      itemsPerPage: 10
    }
  }

  ngOnInit(): void {
    // this.userType = sessionStorage.getItem('uType');
    this.oprSrv.getCosts().subscribe(res => {
      if (res == null) {
        this.costData.length = 0;
      } else {
        this.costData = res
      }
    }), (error: HttpErrorResponse) => {
      this.popSrv.showError(error.message);
    };
  }

}
