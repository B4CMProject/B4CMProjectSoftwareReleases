import { Router } from '@angular/router';
import { OperationsService } from './../../services/operations.service';
import { Component, OnInit } from '@angular/core';
import { PopupService } from 'src/app/services/popup.service';
import { HttpErrorResponse } from '@angular/common/http';

@Component({
  selector: 'app-requests',
  templateUrl: './requests.component.html',
  styleUrls: ['./requests.component.scss']
})
export class RequestsComponent implements OnInit {

  allRequests: any = [];
  config: any;
  constructor(
    private oprSrv: OperationsService,
    private router: Router,
    private popSrv: PopupService
  ) {
    this.config = {
      currentPage: 1,
      itemsPerPage: 10
    }
  }

  ngOnInit(): void {
    this.oprSrv.getAllRequests().subscribe(res => {
      if (res == null) {
        this.allRequests.length = 0;
      } else {
        this.allRequests = res;
      }
    }, (error: HttpErrorResponse) => {
      this.popSrv.showError(error.statusText);
    });
  }

  onAcceptReject(offerID: string, offerReqID: string, isAccept: boolean) {
    const data = { "offerID": offerID, "offerRequestID": offerReqID, "isAccepted": isAccept }
    isAccept ? this.popSrv.showSuccess('Request Accepted') : this.popSrv.showSuccess('Request Rejected')
    this.oprSrv.onAcceptRejectRequest(data).subscribe(res => {
      this.router.navigateByUrl('/', { skipLocationChange: true }).then(() => {
        this.router.navigate(['/home/requests']);
      });
    }, (error: HttpErrorResponse) => {
      this.popSrv.showError(error.statusText);
    });
  }

}
