import { PopupService } from './../../services/popup.service';
import { OperationsService } from './../../services/operations.service';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { HttpErrorResponse } from '@angular/common/http';

@Component({
  selector: 'app-new-offer',
  templateUrl: './new-offer.component.html',
  styleUrls: ['./new-offer.component.scss']
})
export class NewOfferComponent implements OnInit {

  public offerForm: FormGroup;
  setVal: boolean = true;

  constructor(
    private fBuilder: FormBuilder,
    private router: Router,
    private oprSrv: OperationsService,
    private popSrv: PopupService
  ) {
    this.offerForm = this.fBuilder.group({
      id: [{ value: 'OFFER_' + this.oprSrv.generate_UUID(), disabled: true }],
      validity: true,
      dataOwner: [{ value: '', disabled: true }, Validators.required],
      equipment: ['', Validators.required],
      monitoredAsset: ['', Validators.required],
      processingLevel: ['', Validators.required],
      price: [null, Validators.required],
      deposit: [null, Validators.required]
    });
  }

  ngOnInit(): void {
    const uName = sessionStorage.getItem('uEmail');
    this.offerForm.controls.dataOwner.setValue(uName);
  }

  setValidity(validity: boolean) {
    this.setVal = validity;
    this.offerForm.controls.validity.setValue(validity);
  }

  submitOffer() {
    const data = {
      id: this.offerForm.controls.id.value,
      validity: this.offerForm.controls.validity.value,
      dataOwner: this.offerForm.controls.dataOwner.value,
      equipment: this.offerForm.controls.equipment.value,
      monitoredAsset: this.offerForm.controls.monitoredAsset.value,
      processingLevel: this.offerForm.controls.processingLevel.value,
      price: this.offerForm.controls.price.value,
      deposit: this.offerForm.controls.deposit.value
    }
    this.oprSrv.submitOffer(data).subscribe(res => {
      if (res.result !== undefined || res.result !== null) {
        this.popSrv.showSuccess('New Offer Created Successfully');
        this.router.navigateByUrl('/', { skipLocationChange: true }).then(() => {
          this.router.navigate(['/home/new-offers']);
        });
      }
    }, (error: HttpErrorResponse) => {
      this.popSrv.showError(error.error.errors.message);
    });
  }
  // getPath(val: any) {
  //   return val.queue[0] === undefined ? 'No File Chosen' : val.queue[val.queue.length - 1]._file.name;
  // }
}
