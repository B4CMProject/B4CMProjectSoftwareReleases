export interface GetAllRequest {
  docType:          string;
  offer_request_id: string;
  offer_id:         string;
  dataConsumer:     string;
  dataProvider:     string;
  price:            number;
  pDeposit:         number;
  cDeposit:         number;
  cPayment:         number;
  startDate:        Date;
  endDate:          Date;
  status:           string;
  owner_org:        string;
  escrow_id:        string;
}
