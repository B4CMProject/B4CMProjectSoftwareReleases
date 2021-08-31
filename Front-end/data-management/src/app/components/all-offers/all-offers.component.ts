import { Router } from '@angular/router';
import { GetExistingOffer } from './../../models/getAllExistingOffer';
import { OperationsService } from './../../services/operations.service';
import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-all-offers',
  templateUrl: './all-offers.component.html',
  styleUrls: ['./all-offers.component.scss']
})
export class AllOffersComponent implements OnInit {

  existingOfferData: any = [];
  config: any;
  constructor(
    private oprSrv: OperationsService,
    private router: Router
  ) {
    this.config = {
      currentPage: 1,
      itemsPerPage: 10
    }
    this.oprSrv.getAllExistingOffer().subscribe(res => {
      this.existingOfferData = res;
    });
  }

  offerRequest(offerID: string, deposit: number, price: number) {
    this.router.navigate(['/home/send-requests'], { queryParams: { offer_id: offerID, deposit: deposit, price: price } });
  }

  ngOnInit(): void {
  }

}
