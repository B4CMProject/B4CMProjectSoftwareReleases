package main

import (
	"encoding/json"
	"fmt"
	"strconv"
	"strings"
	"time"

	"github.com/hyperledger/fabric-contract-api-go/contractapi"
	"github.com/hyperledger/fabric/common/flogging"
)

var logger = flogging.MustGetLogger("datamanagement_cc")

// dataManagement the chaincode interface implementation to manage
type dataManagement struct {
	contractapi.Contract
}

// Init initialize chaincode with mapping between actions and real methods
func (pm *dataManagement) InitLedger(ctx contractapi.TransactionContextInterface) error {

	var fee Fees

	fee.DocType = "fees"
	fee.ID = "feeAll"
	fee.EC, _ = strconv.ParseFloat("50.00", 64)
	fee.EP, _ = strconv.ParseFloat("50.00", 64)
	feeAsBytes, _ := json.Marshal(fee)
	err := ctx.GetStub().PutState(fee.ID, feeAsBytes)
	if err != nil {
		return fmt.Errorf("Failed to add Fee catch: %s", fee.ID)
	}
	return nil
}

// insertDataOffer inserts DataOffer into ledger
func (pm *dataManagement) InsertDataOffer(ctx contractapi.TransactionContextInterface, dataOffer string) (map[string]interface{}, error) {

	var details DataOffer
	logger.Info(dataOffer)
	response := make(map[string]interface{})
	response["txId"] = ctx.GetStub().GetTxID()
	err := json.Unmarshal([]byte(dataOffer), &details)
	if err != nil {
		response["message"] = "Error occured while Unmarshal"
		return response, fmt.Errorf("Failed while unmarshling Order %s", err.Error())
	}

	exists, err := pm.ObjectExists(ctx, details.ID)
	if err != nil {
		response["message"] = "failed to get Offer"
		return response, fmt.Errorf("failed to get Offer: %v", err)
	}
	if exists {
		response["message"] = "DataOffer already exists"
		return response, fmt.Errorf("DataOffer already exists")
	}
	clientOrgID, err := getClientOrgID(ctx, false)
	if err != nil {
		return response, fmt.Errorf("failed to get verified OrgID: %v", err)
	}
	details.DocType = DATA_OFFER
	details.OwnerOrg = clientOrgID
	detailsAsBytes, _ := json.Marshal(details)
	err = ctx.GetStub().PutState(details.ID, detailsAsBytes)
	if err != nil {
		response["message"] = "Error occured while storing data"
		return response, fmt.Errorf("Failed to add DataOffer catch: %s", details.ID)
	}

	return response, nil

}

func (pm *dataManagement) UpdateDataOffer(ctx contractapi.TransactionContextInterface, dataOffer string) (map[string]interface{}, error) {

	var details DataOffer
	logger.Info(dataOffer)
	response := make(map[string]interface{})
	response["txId"] = ctx.GetStub().GetTxID()
	err := json.Unmarshal([]byte(dataOffer), &details)
	if err != nil {
		response["message"] = "Error occured while Unmarshal"
		return response, fmt.Errorf("Failed while unmarshling Order. %s", err.Error())
	}
	logger.Info(details)
	exists, err := pm.ObjectExists(ctx, details.ID)
	if err != nil {
		response["message"] = "failed to get Offer"
		return response, fmt.Errorf("failed to get Offer: %v", err)
	}
	if !exists {
		response["message"] = "No Record found"
		return response, fmt.Errorf("Data Offer does not exists")
	}

	var _offer DataOffer
	_offerAsBytes, _ := ctx.GetStub().GetState(details.ID)
	err = json.Unmarshal(_offerAsBytes, &_offer)
	if err != nil {
		return response, err
	}
	details.DocType = DATA_OFFER
	details.OwnerOrg = _offer.OwnerOrg
	details.Creator = _offer.Creator

	detailsAsBytes, _ := json.Marshal(details)
	clientOrgID, err := getClientOrgID(ctx, false)
	if err != nil {
		return response, fmt.Errorf("failed to get verified OrgID: %v", err)
	}
	logger.Info("clientOrgID : %s", clientOrgID)
	logger.Info("details.OwnerOrg : %s", details.OwnerOrg)
	//if details.OwnerOrg != clientOrgID {
	//	return response, fmt.Errorf("a client from %s is not allowed to update %s", clientOrgID, details.ID)
	//}

	err = ctx.GetStub().PutState(details.ID, detailsAsBytes)
	if err != nil {
		response["message"] = "Error occured while updating data"
		return response, fmt.Errorf("Failed to update Data offer catch: %s", details.ID)
	}

	return response, nil
}

func (pm *dataManagement) GetAllOffers(ctx contractapi.TransactionContextInterface, creator string) ([]QueryResult, error) {

	var queryString string
	logger.Info(creator)
	if len(creator) == 0 {
		queryString = fmt.Sprintf(`{"selector":{"docType":"%s"}}`, DATA_OFFER)
	} else {
		queryString = fmt.Sprintf(`{"selector":{"docType":"%s","creator":"%s"}}`, DATA_OFFER, creator)
	}

	logger.Info(queryString)

	resultsIterator, err := ctx.GetStub().GetQueryResult(queryString)
	if err != nil {
		return nil, err
	}
	defer resultsIterator.Close()
	var results []QueryResult

	for resultsIterator.HasNext() {
		queryResponse, err := resultsIterator.Next()

		if err != nil {
			return nil, err
		}

		var dataOffer DataOffer
		err = json.Unmarshal(queryResponse.Value, &dataOffer)
		if err != nil {
			return nil, err
		}

		queryResult := QueryResult{Key: queryResponse.Key, Record: &dataOffer}
		results = append(results, queryResult)
	}

	return results, nil
}

// OfferRequest

func (pm *dataManagement) CreateOfferRequest(ctx contractapi.TransactionContextInterface, offerRequest string) (map[string]interface{}, error) {
	var _offerRequest OfferRequest
	response := make(map[string]interface{})
	response["txId"] = ctx.GetStub().GetTxID()
	err := json.Unmarshal([]byte(offerRequest), &_offerRequest)
	if err != nil {
		response["message"] = "Failed to unmarshal offer request"
		return response, fmt.Errorf("Failed to unmarshal offer request %s", err.Error())
	}

	exist, err := pm.ObjectExists(ctx, _offerRequest.OfferID)
	if err != nil {
		response["message"] = "Failed to get offer"
		return response, fmt.Errorf("Failed to get offer %s", err.Error())
	}
	if !exist {
		response["message"] = fmt.Sprintf("No such offer exist with offer id %s", _offerRequest.OfferID)
		return response, fmt.Errorf("No such offer exist with offer id %s: %s", _offerRequest.OfferID, err.Error())
	}

	clientOrgID, err := getClientOrgID(ctx, false)
	if err != nil {
		response["message"] = "Failed to get offer ID"
		return response, fmt.Errorf("Failed to get offer ID %s", err.Error())
	}
	var offer DataOffer
	offerAsBytes, err := ctx.GetStub().GetState(_offerRequest.OfferID)

	err = json.Unmarshal(offerAsBytes, &offer)
	if err != nil {
		response["message"] = "Failed to unmarshal"
		return response, fmt.Errorf("Failed to unmarshal %s", err.Error())
	}
	//if offer.Deposit != _offerRequest.CDeposit {
	//	response["message"] = "Failed to send request, catch: Deposit amount mismatch"
	//	return response, fmt.Errorf("Failed to send request, catch: Deposit amount mismatch!")
	//}
	//
	//if offer.Deposit > _offerRequest.CPayment {
	//	response["message"] = "Failed to send request, catch: Payment must be equal to or greater than Deposit"
	//	return response, fmt.Errorf("Failed to send request, catch: Payment must be equal to or greater than Deposit")
	//}

	escrowID := generateUUID()
	_offerRequest.OfferRequestID = generateUUID()
	_offerRequest.DocType = OFFER_REQUEST
	_offerRequest.OwnerOrg = clientOrgID
	_offerRequest.DataProvider = offer.Creator
	_offerRequest.Status = CREATED
	_offerRequest.EscrowID = escrowID
	_offerRequest.PDeposit = offer.Deposit
	_offerRequest.OfferDetails = offer

	offerRequestAsBytes, _ := json.Marshal(_offerRequest)

	err = ctx.GetStub().PutState(_offerRequest.OfferRequestID, offerRequestAsBytes)
	if err != nil {
		response["message"] = "Failed to do put state for offer request"
		return response, err
	}

	// create escrow
	escrow := Escrow{
		Status:          CREATED,
		Consumer:        _offerRequest.DataConsumer,
		Provider:        _offerRequest.DataProvider,
		DocType:         ESCROW,
		ID:              escrowID,
		ProviderDeposit: offer.Deposit,
		ConsumerDeposit: _offerRequest.CDeposit,
		ConsumerPayment: offer.Price,
		Released:        false,
		OfferRequestID:  _offerRequest.OfferRequestID,
		OfferID:         _offerRequest.OfferID,
	}
	escrowAsBytes, _ := json.Marshal(escrow)
	err = ctx.GetStub().PutState(escrow.ID, escrowAsBytes)
	if err != nil {
		response["message"] = "Failed to do put state for escrow"
		return response, err
	}
	response["message"] = fmt.Sprintf("Offer Request ID: %s, Escrow ID: %s", _offerRequest.OfferRequestID, escrow.ID)
	return response, nil
}

func (pm *dataManagement) GetAllOfferRequest(ctx contractapi.TransactionContextInterface) ([]*OfferRequest, error) {

	queryString := fmt.Sprintf(`{"selector":{"docType":"%s"}}`, OFFER_REQUEST)
	resultsIterator, err := ctx.GetStub().GetQueryResult(queryString)

	if err != nil {
		return nil, err
	}
	defer resultsIterator.Close()

	var offerRequest []*OfferRequest
	for resultsIterator.HasNext() {
		queryResponse, err := resultsIterator.Next()
		if err != nil {
			return nil, err
		}

		var request OfferRequest
		err = json.Unmarshal(queryResponse.Value, &request)
		if err != nil {
			return nil, err
		}
		logger.Info(request.OfferID)

		offerRequest = append(offerRequest, &request)
	}

	return offerRequest, nil

}

func (pm *dataManagement) AcceptOfferRequest(ctx contractapi.TransactionContextInterface, offerID, offerRequestID string, isAccepted bool) (map[string]interface{}, error) {

	response := make(map[string]interface{})

	// Get the offer details from offerID
	var offer DataOffer
	offerAsBytes, err := ctx.GetStub().GetState(offerID)
	if err != nil {
		return response, err
	}

	err = json.Unmarshal(offerAsBytes, &offer)
	if err != nil {
		return response, err
	}

	// Get the offer Request from the offerRequestID
	var offerRequest OfferRequest
	offerRequestAsBytes, err := ctx.GetStub().GetState(offerRequestID)
	if err != nil {
		return response, err
	}
	err = json.Unmarshal(offerRequestAsBytes, &offerRequest)
	if err != nil {
		return response, err
	}
	// Get the escrow details
	escrowID := offerRequest.EscrowID
	var escrow Escrow
	escrowAsBytes, err := ctx.GetStub().GetState(escrowID)
	if err != nil {
		return response, err
	}
	err = json.Unmarshal(escrowAsBytes, &escrow)
	if err != nil {
		return response, err
	}

	// Business Logic Here
	if isAccepted {
		agreementId := generateUUID()
		offerRequest.AgreementID = agreementId
		offerRequest.Status = ACTIVE
		escrow.Status = ACTIVE
		escrow.AgreementID = agreementId
		escrow.StartDate = offerRequest.StartDate
		escrow.EndDate = offerRequest.EndDate
		escrow.ProviderDeposit = offer.Deposit
		dataAgreement := DataAgreement{
			DocType:         DATA_AGREEMENT,
			ID:              agreementId,
			DataProvider:    offerRequest.DataProvider,
			DataConsumer:    offerRequest.DataConsumer,
			EscrowID:        escrowID,
			State:           isAccepted,
			OfferRequestID:  offerRequestID,
			OfferID:         offerID,
			StartDate:       offerRequest.StartDate,
			EndDate:         offerRequest.EndDate,
			OfferDataHashID: []string{},
			ProviderDeposit: offerRequest.PDeposit,
			ConsumerDeposit: offerRequest.CDeposit,
		}
		dataAgreementAsBytes, err := json.Marshal(dataAgreement)
		if err != nil {
			response["message"] = "Failed to marshal Agreement"
			return response, err
		}
		err = ctx.GetStub().PutState(agreementId, dataAgreementAsBytes)
		if err != nil {
			response["message"] = "Failed to Putstate Agreement"
			return response, err
		}
	} else {
		escrow.Status = REJECTED
		offerRequest.Status = REJECTED
	}

	offerRequestAsBytes, err = json.Marshal(offerRequest)
	err = ctx.GetStub().PutState(offerRequest.OfferRequestID, offerRequestAsBytes)
	if err != nil {
		return response, err
	}

	escrowAsBytes, err = json.Marshal(escrow)
	err = ctx.GetStub().PutState(escrow.ID, escrowAsBytes)
	if err != nil {
		return response, err
	}

	return response, nil
}

func (pm *dataManagement) GetOfferRequestByID(ctx contractapi.TransactionContextInterface, key string) (*OfferRequest, error) {

	assetJSON, err := ctx.GetStub().GetState(key)
	if err != nil {
		return nil, fmt.Errorf("failed to read from world state: %v", err)
	}
	if assetJSON == nil {
		return nil, fmt.Errorf("the asset %s does not exist", key)
	}

	var asset OfferRequest
	err = json.Unmarshal(assetJSON, &asset)
	if err != nil {
		return nil, err
	}

	return &asset, nil
}

// ESCROW
func (pm *dataManagement) GetAllEscrow(ctx contractapi.TransactionContextInterface) ([]*Escrow, error) {

	queryString := fmt.Sprintf(`{"selector":{"%s":"%s"}}`, DOC_TYPE, ESCROW)

	resultsIterator, err := ctx.GetStub().GetQueryResult(queryString)
	if err != nil {
		return nil, err
	}
	defer resultsIterator.Close()

	var offerRequest []*Escrow
	for resultsIterator.HasNext() {
		queryResponse, err := resultsIterator.Next()
		if err != nil {
			return nil, err
		}

		var request Escrow
		err = json.Unmarshal(queryResponse.Value, &request)
		if err != nil {
			return nil, err
		}
		offerRequest = append(offerRequest, &request)
	}

	return offerRequest, nil

}

func (pm *dataManagement) GetEscrowByID(ctx contractapi.TransactionContextInterface, dataProvider, dataConsumer, operator string) ([]*Escrow, error) {
	if len(operator) == 0 {
		operator = "$or"
		logger.Info("No Operator found.... Defaulting to $OR operator")
	}

	queryString := fmt.Sprintf(`{"selector":{"%s":"%s","%s":[{"consumer":"%s"},{"producer":"%s"}]}}`, DOC_TYPE, ESCROW, operator, dataConsumer, dataProvider)

	resultsIterator, err := ctx.GetStub().GetQueryResult(queryString)
	if err != nil {
		return nil, err
	}
	defer resultsIterator.Close()

	var offerRequest []*Escrow
	for resultsIterator.HasNext() {
		queryResponse, err := resultsIterator.Next()
		if err != nil {
			return nil, err
		}

		var request Escrow
		err = json.Unmarshal(queryResponse.Value, &request)
		if err != nil {
			return nil, err
		}
		offerRequest = append(offerRequest, &request)
	}

	return offerRequest, nil

}

// UPLAOD DATA HASH

func (pm *dataManagement) InsertDataHash(ctx contractapi.TransactionContextInterface, offerID, hashID, dataHash, filename, entrydate string) error {

	offerAsBytes, err := ctx.GetStub().GetState(offerID)
	if err != nil {
		return err
	}
	if len(offerAsBytes) == 0 {
		return fmt.Errorf("No Such Offer Exists")
	}

	query := fmt.Sprintf(`{"selector":{"%s":"%s","offer_id":"%s"}}`, DOC_TYPE, DATA_HASH, offerID)
	currentTime := time.Now()
	today := currentTime.Format("2006-01-02")
	query2 := fmt.Sprintf(`{"selector":{"%s":"%s","offer_id":"%s","end_date":{"$gte":"%s"},"state": %t}}`, DOC_TYPE, DATA_AGREEMENT, offerID, today, true)

	resultsIterator, err := ctx.GetStub().GetQueryResult(query)
	if err != nil {
		return err
	}
	defer resultsIterator.Close()

	var offerDataHashes []*OfferDataHash
	for resultsIterator.HasNext() {
		queryResponse, err := resultsIterator.Next()
		if err != nil {
			return err
		}

		var hash OfferDataHash
		err = json.Unmarshal(queryResponse.Value, &hash)
		if err != nil {
			return err
		}
		offerDataHashes = append(offerDataHashes, &hash)
	}
	logger.Info(query)
	logger.Info(offerDataHashes)
	resultsIterator2, err := ctx.GetStub().GetQueryResult(query2)
	if err != nil {
		return err
	}
	defer resultsIterator2.Close()

	var dataAgreement []*DataAgreement
	for resultsIterator2.HasNext() {
		queryResponse, err := resultsIterator2.Next()
		if err != nil {
			return err
		}

		var agreement DataAgreement
		err = json.Unmarshal(queryResponse.Value, &agreement)
		if err != nil {
			return err
		}
		dataAgreement = append(dataAgreement, &agreement)
	}
	logger.Info(query2)
	logger.Info(dataAgreement)
	data := DataHash{
		DocType:   DATA_HASH_VALUE,
		ID:        hashID,
		Hash:      dataHash,
		FileName:  filename,
		EntryDate: entrydate,
	}
	if len(offerDataHashes) == 0 {
		// TODO Create new Offer datahash
		var offer DataOffer
		err := json.Unmarshal(offerAsBytes, &offer)
		if err != nil {
			return err
		}
		offerDataHash := OfferDataHash{
			ID:           generateUUID(),
			DataHashes:   []DataHash{},
			OfferID:      offerID,
			DocType:      DATA_HASH,
			DataProvider: offer.Creator,
		}

		offerDataHash.DataHashes = append(offerDataHash.DataHashes, data)
		offerDataHashAsBytes, err := json.Marshal(offerDataHash)
		if err != nil {
			return err
		}
		err = ctx.GetStub().PutState(offerDataHash.ID, offerDataHashAsBytes)
		if err != nil {
			return err
		}
	} else {

		offerDataHashes[0].DataHashes = append(offerDataHashes[0].DataHashes, data)

		offerDataHashAsBytes, err := json.Marshal(offerDataHashes[0])
		if err != nil {
			return err
		}
		err = ctx.GetStub().PutState(offerDataHashes[0].ID, offerDataHashAsBytes)
		if err != nil {
			return err
		}
	}

	for _, _agreement := range dataAgreement {
		_agreement.OfferDataHashID = append(_agreement.OfferDataHashID, hashID)
		_aggrementAsBytes, err := json.Marshal(_agreement)
		if err != nil {
			return err
		}
		err = ctx.GetStub().PutState(_agreement.ID, _aggrementAsBytes)
		if err != nil {
			return err
		}
	}

	return nil
}
func (pm *dataManagement) GetDataHashByOfferID(ctx contractapi.TransactionContextInterface, id string, provider string) ([]*OfferDataHash, error) {

	query := fmt.Sprintf(`{"selector":{"%s":"%s","offer_id":"%s","data_provider":"%s"}}`, DOC_TYPE, DATA_HASH, id, provider)
	logger.Info(query)
	resultsIterator, err := ctx.GetStub().GetQueryResult(query)
	if err != nil {
		return nil, err
	}
	defer resultsIterator.Close()

	var offerDataHashes []*OfferDataHash
	for resultsIterator.HasNext() {
		queryResponse, err := resultsIterator.Next()
		if err != nil {
			return nil, err
		}

		var hash OfferDataHash
		err = json.Unmarshal(queryResponse.Value, &hash)
		if err != nil {
			return nil, err
		}
		offerDataHashes = append(offerDataHashes, &hash)
	}
	logger.Info(len(offerDataHashes))
	return offerDataHashes, nil

}

func (pm *dataManagement) GetDataHashByAgreementID(ctx contractapi.TransactionContextInterface, agreementID string) (*AgreementHash, error) {
	logger.Info("GetDataHashByAgreementID")
	var agreement DataAgreement
	agreementAsBytes, err := ctx.GetStub().GetState(agreementID)
	if err != nil {
		return nil, err
	}
	err = json.Unmarshal(agreementAsBytes, &agreement)
	if err != nil {
		return nil, err
	}
	if len(agreement.OfferDataHashID) == 0 {
		return nil, nil
	}

	query := fmt.Sprintf(`{"selector":{"%s":"%s","offer_id": "%s" }}`, DOC_TYPE, DATA_HASH, agreement.OfferID)
	logger.Info(query)
	resultsIterator, err := ctx.GetStub().GetQueryResult(query)
	if err != nil {
		return nil, err
	}
	defer resultsIterator.Close()
	var dataHashes []*OfferDataHash
	for resultsIterator.HasNext() {
		queryResponse, err := resultsIterator.Next()
		if err != nil {
			return nil, err
		}

		var hash OfferDataHash
		err = json.Unmarshal(queryResponse.Value, &hash)
		if err != nil {
			return nil, err
		}
		dataHashes = append(dataHashes, &hash)
	}
	result := &AgreementHash{
		Hashes:    dataHashes,
		Agreement: &agreement,
	}
	return result, nil

}

// AGREEMENT
func (pm *dataManagement) GetAllAgreements(ctx contractapi.TransactionContextInterface, dataProvider, dataConsumer, operator string) ([]*DataAgreement, error) {

	if len(operator) == 0 {
		operator = "$or"
		logger.Info("No Operator found.... Defaulting to $OR operator")
	}

	queryString := fmt.Sprintf(`{"selector":{"%s":"%s","%s":[{"dataConsumer":"%s"},{"dataProvider":"%s"}]}}`, DOC_TYPE, DATA_AGREEMENT, operator, dataConsumer, dataProvider)

	resultsIterator, err := ctx.GetStub().GetQueryResult(queryString)
	if err != nil {
		return nil, err
	}
	defer resultsIterator.Close()

	var offerRequest []*DataAgreement
	for resultsIterator.HasNext() {
		queryResponse, err := resultsIterator.Next()
		if err != nil {
			return nil, err
		}

		var request DataAgreement
		err = json.Unmarshal(queryResponse.Value, &request)
		if err != nil {
			return nil, err
		}
		offerRequest = append(offerRequest, &request)
	}

	return offerRequest, nil
}

func (pm *dataManagement) GetAllCost(ctx contractapi.TransactionContextInterface, dataProvider, dataConsumer, operator string) ([]*OfferRequest, error) {

	if len(operator) == 0 {
		operator = "$or"
		logger.Info("No Operator found.... Defaulting to $OR operator")
	}
	currentTime := time.Now()
	today := currentTime.Format("2006-01-02")
	queryString := fmt.Sprintf(`{"selector":{"%s":"%s","%s":[{"dataConsumer":"%s"},{"dataProvider":"%s"}], "endDate":{"$lte":"%s"}}}`, DOC_TYPE, OFFER_REQUEST, operator, dataConsumer, dataProvider, today)
	logger.Info(queryString)
	fmt.Println(queryString)
	resultsIterator, err := ctx.GetStub().GetQueryResult(queryString)
	if err != nil {
		return nil, err
	}
	defer resultsIterator.Close()

	var offerRequest []*OfferRequest
	for resultsIterator.HasNext() {
		queryResponse, err := resultsIterator.Next()
		if err != nil {
			return nil, err
		}

		var request OfferRequest
		err = json.Unmarshal(queryResponse.Value, &request)
		if err != nil {
			return nil, err
		}
		offerRequest = append(offerRequest, &request)
	}

	return offerRequest, nil
}

func (pm *dataManagement) GetCostFromEscrow(ctx contractapi.TransactionContextInterface, dataProvider, dataConsumer, operator string) ([]*Escrow, error) {
	if len(operator) == 0 {
		operator = "$or"
		logger.Info("No Operator found.... Defaulting to $OR operator")
	}
	currentTime := time.Now()
	today := currentTime.Format("2006-01-02")
	queryString := fmt.Sprintf(`{"selector":{"%s":"%s","%s":[{"provider":"%s"},{"consumer":"%s"}], "endDate":{"$lte":"%s"}}}`, DOC_TYPE, ESCROW, operator, dataConsumer, dataProvider, today)
	logger.Info(queryString)
	fmt.Println(queryString)
	resultsIterator, err := ctx.GetStub().GetQueryResult(queryString)
	if err != nil {
		return nil, err
	}
	defer resultsIterator.Close()

	var escrows []*Escrow
	for resultsIterator.HasNext() {
		queryResponse, err := resultsIterator.Next()
		if err != nil {
			return nil, err
		}

		var escrow Escrow
		err = json.Unmarshal(queryResponse.Value, &escrow)
		if err != nil {
			return nil, err
		}
		escrows = append(escrows, &escrow)
	}

	return escrows, nil
}

func (pm *dataManagement) GetTotalCost(ctx contractapi.TransactionContextInterface, dataProvider, dataConsumer, operator string) ([]*Costs, error) {

	queryString := fmt.Sprintf(`{"selector":{"%s":"%s","%s":[{"dataProvider":"%s"},{"dataConsumer":"%s"}]}}`, DOC_TYPE, COST, operator, dataProvider, dataConsumer)
	logger.Info(queryString)
	fmt.Println(queryString)
	resultsIterator, err := ctx.GetStub().GetQueryResult(queryString)
	if err != nil {
		return nil, err
	}
	defer resultsIterator.Close()

	var costs []*Costs
	for resultsIterator.HasNext() {
		queryResponse, err := resultsIterator.Next()
		if err != nil {
			return nil, err
		}

		var cost Costs
		err = json.Unmarshal(queryResponse.Value, &cost)
		if err != nil {
			return nil, err
		}
		costs = append(costs, &cost)
	}

	return costs, nil

}
func (pm *dataManagement) RevokeAgreement(ctx contractapi.TransactionContextInterface, agreementId string) error {

	var agreement DataAgreement

	exists, err := pm.ObjectExists(ctx, agreementId)
	if err != nil {
		return err
	}
	if !exists {
		return fmt.Errorf("No Such agreement exist")
	}

	agreementAsBytes, err := ctx.GetStub().GetState(agreementId)
	if err != nil {
		return err
	}
	err = json.Unmarshal(agreementAsBytes, &agreement)
	if err != nil {
		return err
	}
	agreement.State = false
	var escrow Escrow

	escrowAsBytes, err := ctx.GetStub().GetState(agreement.EscrowID)
	if err != nil {
		return err
	}
	err = json.Unmarshal(escrowAsBytes, &escrow)
	if err != nil {
		return err
	}
	escrow.Status = REVOKED
	escrow.Released = true

	err = pm.ReleaseEscrow(ctx, escrow.ID)
	if err != nil {
		return err
	}

	agreementAsBytes, err = json.Marshal(agreement)
	if err != nil {
		return err
	}
	err = ctx.GetStub().PutState(agreement.ID, agreementAsBytes)
	if err != nil {
		return err
	}
	escrowAsBytes, err = json.Marshal(escrowAsBytes)
	if err != nil {
		return err
	}
	err = ctx.GetStub().PutState(escrow.ID, escrowAsBytes)
	if err != nil {
		return err
	}
	return nil
}

func (pm *dataManagement) ReleaseEscrow(ctx contractapi.TransactionContextInterface, escrowId string) error {

	var escrow Escrow
	escrowAsBytes, err := ctx.GetStub().GetState(escrowId)

	if err != nil {
		return err
	}
	err = json.Unmarshal(escrowAsBytes, &escrow)
	if err != nil {
		return err
	}
	currentTime := time.Now()
	today := currentTime.Format("2006-01-02")

	cost := Costs{
		DocType:               COST,
		ID:                    generateUUID(),
		Agreement:             escrow.AgreementID,
		ProviderReimbursement: escrow.ProviderDeposit,
		ConsumerRefund:        escrow.ConsumerDeposit,
		EscrowID:              escrowId,
		DataConsumer:          escrow.Consumer,
		DataProvider:          escrow.Provider,
		OfferRequestID:        escrow.OfferRequestID,
	}

	if escrow.Status == ACTIVE && escrow.EndDate == today {
		escrow.Released = true
		escrowAsBytes, err = json.Marshal(escrow)
		if err != nil {
			return err
		}

		err = ctx.GetStub().PutState(escrow.ID, escrowAsBytes)
		if err != nil {
			return err
		}
	} else {
		cost.ProviderReimbursement = 0
	}

	costAsBytes, err := json.Marshal(cost)
	if err != nil {
		return err
	}
	err = ctx.GetStub().PutState(cost.ID, costAsBytes)
	if err != nil {
		return err
	}
	return nil
}

func (pm *dataManagement) CalculateCost(ctx contractapi.TransactionContextInterface, agreementID, actionCode string) bool {

	docID := generateUUID()

	agreementAsBytes, _ := ctx.GetStub().GetState(agreementID)

	var dataAgreement DataAgreement
	err := json.Unmarshal(agreementAsBytes, &dataAgreement)
	if err != nil {
		return false
	}

	if dataAgreement.State == false {
		return false
	}

	escrowAsBytes, _ := ctx.GetStub().GetState(dataAgreement.EscrowID)

	var escrow Escrow
	err = json.Unmarshal(escrowAsBytes, &escrow)
	if err != nil {
		return false
	}

	rate := escrow.ProviderDeposit + escrow.ConsumerDeposit
	dPrice := rate / 30

	var actPrice float64
	var reimb float64
	var refund float64
	ep := escrow.ProviderDeposit
	ec := escrow.ConsumerDeposit

	switch actionCode {
	case CODE_A:
		actPrice = dPrice * calculateDays(dataAgreement.StartDate, dataAgreement.EndDate)
		reimb = actPrice
		refund = (escrow.ConsumerPayment - actPrice) + ep + ec
	case CODE_B:
		actPrice = dPrice * calculateDays(dataAgreement.StartDate, dataAgreement.EndDate)
		reimb = actPrice + ep + ec
		refund = escrow.ConsumerPayment - actPrice
	case CODE_C:
		actPrice = dPrice * calculateDays(dataAgreement.StartDate, dataAgreement.EndDate)
		reimb = actPrice + ep
		refund = (escrow.ConsumerPayment - actPrice) + ec
	default:
		fmt.Println("Something went wrong")
		return false
	}

	reimb = float64(int(reimb*100)) / 100
	refund = float64(int(refund*100)) / 100

	var details Costs

	details.ID = docID
	details.DocType = COST
	details.Agreement = agreementID
	details.ConsumerRefund = refund
	details.ProviderReimbursement = reimb
	details.DataProvider = escrow.Provider
	details.DataConsumer = escrow.Consumer
	details.EscrowID = escrow.ID
	details.OfferRequestID = escrow.OfferRequestID

	detailsAsBytes, _ := json.Marshal(details)
	err = ctx.GetStub().PutState(docID, detailsAsBytes)
	if err != nil {
		return false
	}

	dataAgreement.State = false
	ddataAgreementAsBytes, err := json.Marshal(dataAgreement)
	err = ctx.GetStub().PutState(agreementID, ddataAgreementAsBytes)
	if err != nil {
		return false
	}

	escrow.Released = true
	escrowAsBytes, _ = json.Marshal(escrow)
	err = ctx.GetStub().PutState(escrow.ID, escrowAsBytes)
	if err != nil {
		return false
	}

	return true
}

func (pm *dataManagement) DeleteData(ctx contractapi.TransactionContextInterface, keys string) {

	s := strings.Split(keys, ",")
	logger.Info(s)
	for _, key := range s {
		err := ctx.GetStub().DelState(key)
		if err != nil {
			logger.Error(err)
			return
		}
	}
	return
}

func main() {
	chaincode, err := contractapi.NewChaincode(&dataManagement{})
	if err != nil {
		logger.Info("Error creating chaincode: %v", err)
	}

	if err := chaincode.Start(); err != nil {
		logger.Info("Error starting chaincode: %v", err)
	}
}
