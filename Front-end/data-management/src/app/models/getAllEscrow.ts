export interface GetAllEscrow {
  consumer: string;
  producer: string;
  docType: string;
  id: string;
  providerDeposit: number;
  consumerDeposit: number;
  consumerPayment: number;
  released: boolean;
  offer_request_id: string;
  offer_id: string;
  status: string;
}
