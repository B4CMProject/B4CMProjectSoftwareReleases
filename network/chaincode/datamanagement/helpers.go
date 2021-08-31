package main

import (
	"fmt"
	"time"

	guuid "github.com/google/uuid"
	"github.com/hyperledger/fabric-chaincode-go/shim"
	"github.com/hyperledger/fabric-contract-api-go/contractapi"
)

func getClientOrgID(ctx contractapi.TransactionContextInterface, verifyOrg bool) (string, error) {
	clientOrgID, err := ctx.GetClientIdentity().GetMSPID()
	if err != nil {
		return "", fmt.Errorf("failed getting client's orgID: %v", err)
	}

	if verifyOrg {
		err = verifyClientOrgMatchesPeerOrg(clientOrgID)
		if err != nil {
			return "", err
		}
	}

	return clientOrgID, nil
}

// verifyClientOrgMatchesPeerOrg checks the client org id matches the peer org id.
func verifyClientOrgMatchesPeerOrg(clientOrgID string) error {
	peerOrgID, err := shim.GetMSPID()
	if err != nil {
		return fmt.Errorf("failed getting peer's orgID: %v", err)
	}

	if clientOrgID != peerOrgID {
		return fmt.Errorf("client from org %s is not authorized to read or write private data from an org %s peer",
			clientOrgID,
			peerOrgID,
		)
	}

	return nil
}

func (pm *dataManagement) ObjectExists(ctx contractapi.TransactionContextInterface, key string) (bool, error) {
	assetBytes, err := ctx.GetStub().GetState(key)
	if err != nil {
		return false, fmt.Errorf("failed to read Object %s from world state. %v", key, err)
	}

	return assetBytes != nil, nil
}

func generateUUID() string {

	id := guuid.New()
	return id.String()
}

func calculateDays(from, to string) float64 {
	format := "2006-01-02 15:04 MST"
	from += " 00:00 UTC"
	to += " 00:00 UTC"
	start, err := time.Parse(format, from)
	if err != nil {
		fmt.Println(err.Error())
	}
	end, err := time.Parse(format, to)
	if err != nil {
		fmt.Println(err.Error())
	}
	diff := end.Sub(start)
	return (diff.Hours() / 24)
}
