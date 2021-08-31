import { Gateway, Wallets } from "fabric-network";
import helper from "./helper";


const queryLedger = async (channelName: string, chaincodeName: string, fcn: string, args: any, username: string, org_name: string) => {

    try {
       
        const ccp = await helper.getCCP(org_name);

        const walletPath = await helper.getWalletPath(org_name);
        const wallet = await Wallets.newFileSystemWallet(walletPath);
        console.log(`Wallet path: ${walletPath}`);

        // Check to see if we've already enrolled the user.
        let identity = await wallet.get(username);
        if (!identity) {
            console.log(`An identity for the user ${username} does not exist in the wallet, so registering user`);
            await helper.getRegisteredUser(username, org_name);
            identity = await wallet.get(username);
            console.log("Run the registerUser.js application before retrying");
            return;
        }

        const gateway = new Gateway();
        await gateway.connect(ccp, {
            wallet, identity: username, discovery: { enabled: true, asLocalhost: true }
        });

        const network = await gateway.getNetwork(channelName);

        // Get the contract from the network.
        const contract = network.getContract(chaincodeName);
        let result;
        if (typeof args === "string") { result = await contract.evaluateTransaction(fcn, args); }
        else {
            result = await contract.evaluateTransaction(fcn, ...args);

        }
        console.log(result);
        gateway.disconnect();
        console.log(`Transaction has been evaluated, result is: ${result}`);
        console.log(typeof result);
        if (result.toString() == "") {
            result = "";
        } else
            result = JSON.parse(result.toString());
        return result;
    } catch (error) {
        console.error(`Failed to evaluate transaction: ${error}`);
        return error.message;

    }
};

export default queryLedger;