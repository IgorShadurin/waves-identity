const testEmail = 'zzz1@com.com';
const oracleContract = '3N9UfhqeB5hRaKF9LvQrT3naVFJ8cPUAo1m';
describe('Identity test suite', () => {
    it('Add email to check', async function(){
        const tx = invokeScript({dappAddress: oracleContract, call:{function:"emailPlease",args:[{type: "string", value: testEmail}]}, payment: []});
        await broadcast(tx)
        await waitForTx(tx.id)
    })

    // if this test fail - add verification code from oracle for this email
    it('Validate email', async function(){
        const tx = invokeScript({dappAddress: oracleContract, call:{function:"validateEmail",args:[{type: "string", value: testEmail}, {type: "string", value: btoa("123")}]}, payment: []});
        await broadcast(tx)
        await waitForTx(tx.id)
    })

    it('Validate transfer by email', async function(){
        const tx = invokeScript({dappAddress: oracleContract, call:{function:"payToEmail",args:[{type: "string", value: testEmail}]}, payment: [{amount: 1110000, asset:null }]});
        await broadcast(tx)
        await waitForTx(tx.id)
    })
})
