import Arweave from 'arweave/web';

const arweaveNode = Arweave.init({
    host: 'arweave.net',
    port: 443,           
    protocol: 'https',
    timeout: 50000,
    logging: false,
});

const readWallet = (wallet) => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onerror = () => {
        reader.abort()
        reject()
      }
      reader.onload = () => resolve(JSON.parse(reader.result))
      reader.readAsText(wallet)
    })
}

const getArweaveUser = async(walletFile) =>{
    return new Promise(async (resolve, reject) => {
        try{
            const wallet = await readWallet(walletFile)
            const address = await arweaveNode.wallets.jwkToAddress(wallet)
            const winstonBalance =  await arweaveNode.wallets.getBalance(address)
            const arweaveBalance = await arweaveNode.ar.winstonToAr(winstonBalance)
            const history = await getUserHistory(address)
            resolve({ wallet, address, winstonBalance, arweaveBalance, history })
        }catch(err){
            console.log(err)
            reject(err)
        }
    })
}

const generateNewHistoryTransaction = async(name, dateBorn, dateEnd, lifeHistory, userWallet) => {
    return new Promise(async (resolve, reject) => {
        try{
            const data = JSON.stringify({ name, dateBorn, dateEnd, lifeHistory })
            let transaction = await arweaveNode.createTransaction({data}, userWallet)
            await transaction.addTag('App-Name', 'people-memory-dev123');
            await arweaveNode.transactions.sign(transaction, userWallet)
            resolve(transaction)
        }catch(err){
            reject(err)
        }
    })
}

const sendArweaveTransaction = async(transaction) => {
    return new Promise(async (resolve, reject) => {
        try{
            await arweaveNode.transactions.post(transaction)
            resolve(transaction.id)
        }catch(err){
            reject(err)
        }
    })
}

const getUserHistory = async(arweaveAddress) => {
    try{
      const query = {
        op: 'and',
        expr1: {
            op: 'equals',
            expr1: 'from',
            expr2: arweaveAddress
        },
        expr2: {
            op: 'equals',
            expr1: 'App-Name',
            expr2: 'people-memory-dev123'
        }     
      }
      let result = []
      const transactions = await arweaveNode.arql(query);
      if(transactions.length === 0){
        return []
      }else{
        for (let x of transactions){
            const data = await getHistory(x)
            result.push(data)
        }
      }
      return result
    }catch(err){
      console.log(err)
      return []
    }  
}

const getHistory = async(transacionId) => {
    return new Promise(async (resolve, reject) => {
        try{
            const transaction = await arweaveNode.transactions.get(transacionId)
            let data = await JSON.parse(transaction.get('data', {decode: true, string: true}))
            data.transactionId = transacionId
            resolve(data)
        }catch(err){
            reject(err)
        }
    })
}


export{
    arweaveNode,
    getArweaveUser,
    generateNewHistoryTransaction,
    sendArweaveTransaction,
    getUserHistory,
    getHistory

}