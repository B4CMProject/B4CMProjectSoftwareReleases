import { OperationsService } from './../../services/operations.service';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Component, OnInit } from '@angular/core';
import { PopupService } from 'src/app/services/popup.service';
import { ActivatedRoute, Router } from '@angular/router';

@Component({
  selector: 'app-send-requests',
  templateUrl: './send-requests.component.html',
  styleUrls: ['./send-requests.component.scss']
})
export class SendRequestsComponent implements OnInit {

  public requestForm: FormGroup;
  current_Date = new Date();
  offersList: any = [];
  filterOffersList: any = [];
  constructor(
    private fBuilder: FormBuilder,
    private oprSrv: OperationsService,
    private popSrv: PopupService,
    private actiRoute: ActivatedRoute,
    private router: Router
  ) {
    this.requestForm = this.fBuilder.group({
      offer_id: '',
      startDate: ['', Validators.required],
      endDate: ['', Validators.required],
      cDeposit: [{ value: null, disabled: true }],
      price: [{ value: null, disabled: true }],
    });
    this.actiRoute.queryParams.subscribe(res => {
      if (res.offer_id === undefined || res.offer_id === null) {
      } else {
        this.requestForm.controls.offer_id.setValue(res.offer_id);
        this.requestForm.controls.cDeposit.setValue(parseInt(res.deposit));
        this.requestForm.controls.price.setValue(parseInt(res.price));
        this.requestForm.controls.offer_id.disable();
      }
    })
  }

  ngOnInit(): void {
    this.oprSrv.getAllExistingOffer().subscribe(res => {
      this.filterOffersList = this.offersList = res;
    });
  }

  onOfferIdChange(offerID: string) {
    const filter_obj = this.filterOffersList.filter((res: { Record: { id: string; }; }) => res.Record.id === offerID);
    this.requestForm.controls.cDeposit.setValue(filter_obj[0].Record.deposit);
    this.requestForm.controls.price.setValue(filter_obj[0].Record.price);
  }

  onStartDateChange() {
    this.requestForm.controls.endDate.setValue('');
  }

  submitRequest() {
    const data = {
      offer_id: this.requestForm.controls.offer_id.value,
      price: this.requestForm.controls.price.value,
      cDeposit: this.requestForm.controls.cDeposit.value,
      startDate: this.oprSrv.formatDate(this.requestForm.controls.startDate.value, 'yyyy-MM-dd'),
      endDate: this.oprSrv.formatDate(this.requestForm.controls.endDate.value, 'yyyy-MM-dd')
    }
    this.oprSrv.sendRequest(data).subscribe(res => {
      this.popSrv.showSuccess('New Request Sent Successfully');
      this.router.navigateByUrl('/', { skipLocationChange: true }).then(() => {
        this.router.navigate(['/home/send-requests']);
      });
    });
  }

}
