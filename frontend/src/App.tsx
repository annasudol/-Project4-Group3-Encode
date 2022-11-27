import React, { useEffect } from 'react'

import './App.css'
import { ethers } from 'ethers'
import Button from '@mui/material/Button'
import Stack from '@mui/material/Stack'
import TextField from '@mui/material/TextField';
import Boxes from './Boxes'
import TokenizedBaloutJSON from './assets/TokenizedBalout.json';
import MyTokenJSON from './assets/MyToken.json'
const tokenBaloutAddress = '0xA5a68F4a956D366711321FB3642cF100bD34018C';
const voteAddress = '0x6E3Ec7bD445F25Bf7Da411BAdd4Dac56A4E4Eaaf';
const backendUrl = 'http://localhost:3000';

function App() {
    const [wallet, setWallet] = React.useState<ethers.Wallet | undefined>()
    const [provider, setProvider] = React.useState<ethers.providers.Provider | undefined>()
    const [contractBalout, setContractBalout] = React.useState<ethers.Contract | undefined>();
    const [contractToken, setContractToken] = React.useState<ethers.Contract | undefined>();

    const [ethBalance, setEthBalance] = React.useState<string | undefined>();
    const [tokenBalance, setTokenBalance] = React.useState<string | undefined>();
    const [votePower, setVotePower] = React.useState<string | undefined>();
    const [mnemonic, setMnemonic] = React.useState<string | undefined>();
    const [error, setError] = React.useState<string | undefined>();


    useEffect(() => {
        setProvider(ethers.getDefaultProvider('goerli'))
        const tokenBalout = new ethers.Contract(
            tokenBaloutAddress,
            TokenizedBaloutJSON.abi,
            wallet
        )
        setContractBalout(tokenBalout);
        const tokenVote = new ethers.Contract(
            voteAddress,
            MyTokenJSON.abi,
            wallet
        )
        setContractToken(tokenVote);
    }, [wallet])

    const createWallet = () => {
        const myWallet = provider && ethers.Wallet.createRandom().connect(provider);
        setWallet(myWallet)
        myWallet?.address && updateValues(myWallet?.address);
    }

    const updateValues = async (walletAddress: string) => {
        try {
            const balanceBN: ethers.BigNumberish | undefined = await provider?.getBalance(walletAddress);
            const balance =  balanceBN && parseFloat(ethers.utils.formatEther(balanceBN)).toString();
            setEthBalance(balance)
            if(contractBalout !== undefined) {
                // const vp = await contractBalout.targetBlockNumber();
                // console.log(typeof contractBalout === null', 'contractBalout')
                // contractBalout?.emit.targetBlockNumber().then((res: any)=> console.log(res))
                console.log(contractBalout.methods)
            }

        } catch(err) {
            console.log(err)
        }
    }

    const importWallet = async () => {
        try{
            setError(undefined)
            const myWallet = provider && mnemonic && ethers.Wallet.fromMnemonic(mnemonic);
            if(myWallet) {
                setWallet(myWallet)
                myWallet?.address && updateValues(myWallet?.address);
            }
        } catch(err) {
            setError('error with importing wallet')
        }

    }

    const connectBallotcontractBalout = (address: string) => {
        // TODO: create ballot contractBalout instance to this address
        // TODO: fetch information of that ballot to be displayed in the page
        // this.ballotcontractBaloutAddress = address;
    }

    const requestTokensTen = () => {
        // TODO: request 10 tokens to be minted in the backend
        // this.tokenRequestPending = true;
    }
    const requestTokens = (amount: string) => {
        //this.tokenRequestPending = true;
    }



    return (
        <div className="app">
            <header className="App-header">
                <h1>Tokenized Ballot app</h1>
                {wallet?.address !== undefined ? <p>{`Your wallet address is ${wallet.address}`}</p> : (
                <Stack spacing={2} direction="column">
                    <Stack spacing={2} direction="row">
                        <Button variant="contained" color="success" onClick={createWallet}>create wallet</Button>
                        <Button variant="contained" color="secondary" disabled={mnemonic?.split(' ').length !== 12} onClick={importWallet}>import wallet</Button>
                        <Button variant="contained" disabled>connect wallet</Button>
                    </Stack>
                    <TextField id="outlined-basic" label="mnemonic" variant="outlined" onChange={(e)=> setMnemonic(e.target.value)} />
                </Stack>
      )}
                {/* {wallet && <Boxes />} */}
                <p>ethBalance {ethBalance}ETH</p>
            </header>
            <p>{error}</p>
        </div>
    )
}

export default App
