import React, { useEffect } from 'react'

import './App.css'
import { ethers } from 'ethers'
import Button from '@mui/material/Button'
import Stack from '@mui/material/Stack'
import TextField from '@mui/material/TextField';
import Boxes from './Boxes'
import tokenJSOn from './assets/TokenizedBalout.json'
const tokenAddress = '0xA5a68F4a956D366711321FB3642cF100bD34018C'
const backendUrl = 'http://localhost:3000'
function App() {
    const [wallet, setWallet] = React.useState<ethers.Wallet | undefined>()
    const [provider, setProvider] = React.useState<ethers.providers.Provider | undefined>()
    const [contract, setContract] = React.useState<
        ethers.Contract | undefined
    >();
    const [ethBalance, setEthBalance] = React.useState<string | undefined>();
    const [tokenBalance, setTokenBalance] = React.useState<string | undefined>();
    const [votePower, setVotePower] = React.useState<string | undefined>();
    const [mnemonic, setMnemonic] = React.useState<string | undefined>();
    const [error, setError] = React.useState<string | undefined>();


    useEffect(() => {
        setProvider(ethers.getDefaultProvider('goerli'))
        const tokenContract = new ethers.Contract(
            tokenAddress,
            tokenJSOn.abi,
            wallet
        )
        setContract(tokenContract);
        // updateValues();
    // eslint-disable-next-line @typescript-eslint/no-use-before-define
    console.log('that olive candy yellow void certain burden result spike leader dose news'.split(' ').length, 'zz')

    
    }, [wallet])

    const createWallet = () => {
        const myWallet = provider && ethers.Wallet.createRandom().connect(provider)
        setWallet(myWallet)
    }

    const updateValues = React.useCallback(() => {

        wallet?.getBalance().then((balance: any) => {
            const ethBalance = parseFloat(ethers.utils.formatEther(balance)).toString();
                setEthBalance(ethBalance)
        });

        console.log('that olive candy yellow void certain burden result spike leader dose news'.split(' ').length, 'zz')
        //     console.log(ethBalance, 'ethBalance')
        //     let tokenBalance = ''
        //     let votePower = ''
        //     if (contract) {
        //         contract['balanceOf'](wallet?.address).then(
        //             (balanceBN: ethers.BigNumberish) => {
        //                 tokenBalance = parseFloat(
        //                     ethers.utils.formatEther(balanceBN)
        //                 ).toString()
        //             }
        //         )
        //         contract['getVotes'](wallet?.address).then(
        //             (votePowerBN: ethers.BigNumberish) => {
        //                 votePower = parseFloat(
        //                     ethers.utils.formatEther(votePowerBN)
        //                 ).toString()
        //             }
        //         )
        //     }
        //     console.log(tokenBalance, tokenBalance, votePower)
        // })
    }, [contract, wallet])

    const importWallet = async () => {
        try{
            const myWallet = provider && mnemonic && ethers.Wallet.fromMnemonic(mnemonic);
            myWallet && setWallet(myWallet)
        } catch(err) {
            setError('error with importing wallet')
        }

    }

    const connectBallotContract = (address: string) => {
        // TODO: create ballot contract instance to this address
        // TODO: fetch information of that ballot to be displayed in the page
        // this.ballotContractAddress = address;
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
                {wallet ? <p>{`Your wallet address is ${wallet.address}`}</p> : (
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
                <p>ethBalance {ethBalance}</p>
            </header>
        </div>
    )
}

export default App
