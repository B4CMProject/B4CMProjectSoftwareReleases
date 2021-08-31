import { HttpErrorResponse } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { OperationsService } from 'src/app/services/operations.service';
import { PopupService } from 'src/app/services/popup.service';

@Component({
  selector: 'app-agreements',
  templateUrl: './agreements.component.html',
  styleUrls: ['./agreements.component.scss']
})
export class AgreementsComponent implements OnInit {

  allAgreements: any = [];
  config: any;

  constructor(
    private oprSrv: OperationsService,
    private popSrv: PopupService,
    private router: Router
  ) {
    this.config = {
      currentPage: 1,
      itemsPerPage: 10
    }
  }

  ngOnInit(): void {
    this.oprSrv.getAllAgreements().subscribe(res => {
      if (res == null) {
        this.allAgreements.length = 0;
      } else {
        this.allAgreements = res;
      }
    }, (error: HttpErrorResponse) => {
      this.popSrv.showError(error.error.errors.message);
    });
  }

  revoke(agrId: string) {
    const data = { agreement_id: agrId };
    this.oprSrv.revokeAgreement(data).subscribe(res => {
      if (res.result == '') {
        this.popSrv.showSuccess('Agreement Revoked');
        this.router.navigateByUrl('/', { skipLocationChange: true }).then(() => {
          this.router.navigate(['/home/agreements']);
        });
      } else {
        this.popSrv.showError('Something Failure !');
      }
    }, (error: HttpErrorResponse) => {
      this.popSrv.showError(error.message);
    })
  }

}
