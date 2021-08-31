import { UploadDocResponse } from './../../models/uploadDocResponse';
import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { OperationsService } from 'src/app/services/operations.service';
import { PopupService } from 'src/app/services/popup.service';
import { HttpErrorResponse } from '@angular/common/http';
import { Router } from '@angular/router';

@Component({
  selector: 'app-new-hash-values',
  templateUrl: './new-hash-values.component.html',
  styleUrls: ['./new-hash-values.component.scss']
})
export class NewHashValuesComponent implements OnInit {

  public newHashForm: FormGroup;
  docRes: UploadDocResponse | undefined;
  allRequests: any = [];
  fileToUpload: File | any;
  // public userFile: FileUploader = new FileUploader({ isHTML5: true, itemAlias: 'file' });
  fileName: string = 'No file choosen ...';
  constructor(
    private fBuilder: FormBuilder,
    private oprSrv: OperationsService,
    private popSrv: PopupService,
    private router: Router
  ) {
    this.newHashForm = this.fBuilder.group({
      offer_id: ['', Validators.required],
      hash_id: '',
      data_hash: ['', Validators.required],
      doc_file: ''
    });
  }

  ngOnInit(): void {
    this.oprSrv.getOffers().subscribe(res => {
      this.allRequests = res;
    }, (error: HttpErrorResponse) => {
      this.popSrv.showError(error.statusText);
    });
    const hash = this.oprSrv.generate_HASH_ID();
    this.newHashForm.controls.hash_id.setValue(hash);
  }

  // getFileName(val: any) {
  //   const dd = val.split('fakepath\\');
  //   return dd[1];
  // }

  uploadDoc(event: any) {
    const file: File = event.target.files[0];
    if (file) {
      this.fileName = file.name;
      const formData = new FormData();
      formData.append("file", file, this.fileName);
      this.oprSrv.uploadFile(formData).subscribe(res => {
        this.docRes = res;
        this.newHashForm.controls.data_hash.setValue(res.md5);
      }, (error: HttpErrorResponse) => {
        this.popSrv.showError(error.error.errors.message);
      });
    }
  }

  submitForm() {
    const tDate = Date();
    const data = {
      offer_id: this.newHashForm.controls.offer_id.value,
      hash_id: this.newHashForm.controls.hash_id.value,
      datahash: this.docRes?.md5,
      filename: this.docRes?.filename,
      entrydate: this.oprSrv.formatDate(tDate, 'yyyy-MM-dd')
    }
    this.oprSrv.setNewHashOffer(data).subscribe(res => {
      if (res.result === '') {
        this.popSrv.showSuccess("Hash value Saved");
        this.router.navigateByUrl('/', { skipLocationChange: true }).then(() => {
          this.router.navigate(['/home/new-hash-value']);
        });
      } else {
        this.popSrv.showError("Something error happens");
        this.router.navigateByUrl('/', { skipLocationChange: true }).then(() => {
          this.router.navigate(['/home/new-hash-value']);
        });
      }
    }, (error: HttpErrorResponse) => {
      this.popSrv.showError(error.error.errors.message);
    });
  }

}
