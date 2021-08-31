export interface GetExistingOffer {
  Key: string;
  Record: Record;
}

export interface Record {
  docType: string;
  id: string;
  validity: boolean;
  dataOwner: string;
  equipment: string;
  monitoredAsset: string;
  processingLevel: string;
  price: number;
  deposit: number;
  creator: string;
  owner_org: string;
}
