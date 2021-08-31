import { Router } from '@angular/router';
import { GetAllOffers } from './../../models/getAllOffers';
import { OperationsService } from './../../services/operations.service';
import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { PopupService } from 'src/app/services/popup.service';
import { HttpErrorResponse } from '@angular/common/http';

@Component({
  selector: 'app-my-offers',
  templateUrl: './my-offers.component.html',
  styleUrls: ['./my-offers.component.scss']
})
export class MyOffersComponent implements OnInit {

  offersData: any = [];
  config: any;
  isEdit = false;
  setVal: boolean = true;
  public offerForm: FormGroup;
  constructor(
    private fBuilder: FormBuilder,
    private popSrv: PopupService,
    private oprSrv: OperationsService,
    private router: Router
  ) {
    this.config = {
      currentPage: 1,
      itemsPerPage: 10
    };
    this.offerForm = this.fBuilder.group({
      id: [{ value: '', disabled: true }],
      validity: true,
      dataOwner: '',
      equipment: ['', [Validators.required, this.noWhitespaceValidator]],
      monitoredAsset: ['', [Validators.required, this.noWhitespaceValidator]],
      processingLevel: ['', [Validators.required, this.noWhitespaceValidator]],
      price: [null, Validators.required],
      deposit: [null, Validators.required]
    });
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
  }

  public noWhitespaceValidator(control: FormControl) {
    const isWhitespace = (control.value || '').trim().length === 0;
    const isValid = !isWhitespace;
    return isValid ? null : { 'whitespace': true };
  }


  setValidity(validity: boolean) {
    this.setVal = validity;
    this.offerForm.controls.validity.setValue(validity);
  }

  cancelUpdate() {
    this.isEdit = false;
    this.offerForm.controls.id.setValue(''),
      this.offerForm.controls.validity.setValue(false),
      this.offerForm.controls.dataOwner.setValue(''),
      this.offerForm.controls.equipment.setValue(''),
      this.offerForm.controls.monitoredAsset.setValue(''),
      this.offerForm.controls.processingLevel.setValue(''),
      this.offerForm.controls.price.setValue(''),
      this.offerForm.controls.deposit.setValue('')
  }

  updateOffer(rowData: any) {
    this.isEdit = true;
    this.setVal = rowData.Record.validity;
    this.offerForm.patchValue({
      id: rowData.Record.id,
      validity: rowData.Record.validity,
      dataOwner: rowData.Record.dataOwner,
      equipment: rowData.Record.equipment,
      monitoredAsset: rowData.Record.monitoredAsset,
      processingLevel: rowData.Record.processingLevel,
      price: rowData.Record.price,
      deposit: rowData.Record.deposit
    });
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
    this.oprSrv.updateOffer(data).subscribe(res => {
      if (res.result !== undefined || res.result !== null) {
        this.popSrv.showSuccess('Offer Updated Successfully!');
        this.router.navigateByUrl('/', { skipLocationChange: true }).then(() => {
          this.router.navigate(['/home/my-offers']);
        });
      }
    }, (error: HttpErrorResponse) => {
      this.popSrv.showError(error.error.errors.message);
    });
  }

}
