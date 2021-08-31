import { Gateway, Wallets } from "fabric-network";
import helper from "./helper";
import logger from "./logger";


const invokeTransaction = async (channelName: string, chaincodeName: string, fcn: string, args: any, username: string, org_name: string) => {
    try {

        logger.info(channelName);
        logger.info(chaincodeName);
        logger.info(fcn);
        logger.info(args);
        logger.info(username);
        logger.info(org_name);
        const ccp = await helper.getCCP(org_name);

        const walletPath = await helper.getWalletPath(org_name);
        const wallet = await Wallets.newFileSystemWallet(walletPath);
        console.log(`Wallet path: ${walletPath}`);

        let identity = await wallet.get(username);
        if (!identity) {
            console.log(`An identity for the user ${username} does not exist in the wallet, so registering user`);
            await helper.getRegisteredUser(username, org_name);
            identity = await wallet.get(username);
            console.log("Run the registerUser.js application before retrying");
            return;
        }


        const connectOptions = {
            wallet, identity: username, discovery: { enabled: true, asLocalhost: true },

        };

        const gateway = new Gateway();
        await gateway.connect(ccp, connectOptions);

        const network = await gateway.getNetwork(channelName);
        const contract = network.getContract(chaincodeName);
        let result;
        if (typeof args === "string") { result = await contract.submitTransaction(fcn, args); }
        else { result = await contract.submitTransaction(fcn, ...args); }



        gateway.disconnect();

        // result = JSON.parse(result.toString());

        const response = {

            result: result.toLocaleString()
        };

        return response;


    } catch (error) {

        console.log(`Getting error: ${error}`);
        return error.message;

    }
};

export default invokeTransaction;