import React, { useEffect } from 'react'

import './App.css'
import { ethers } from 'ethers'
import Button from '@mui/material/Button'
import Stack from '@mui/material/Stack'
import Boxes from './Boxes'
import tokenJSOn from './assets/TokenizedBalout.json'
const tokenAddress = ''
const backendUrl = 'http://localhost:3000'
function App() {
    const [wallet, setWallet] = React.useState<ethers.Wallet | undefined>()
    const [provider, setProvider] = React.useState<ethers.providers.Provider>(
        ethers.getDefaultProvider('goerli')
    )
    const [contract, setContract] = React.useState<
        ethers.Contract | undefined
    >()
    const [ethValues, setEthValues] = React.useState<{
        ethBalance: string | undefined
        tokenBalance: string | undefined
        votePower: string | undefined
    }>({ ethBalance: undefined, tokenBalance: undefined, votePower: undefined })

    useEffect(() => {
        setProvider(ethers.getDefaultProvider('goerli'))
        const tokenContract = new ethers.Contract(
            tokenAddress,
            tokenJSOn.abi,
            wallet
        )
        setContract(tokenContract)
    }, [wallet])

    const createWallet = () => {
        const myWallet = ethers.Wallet.createRandom().connect(provider)
        setWallet(myWallet)
    }

    const updateValues = () => {
        setEthValues({
            ethBalance: 'loading...',
            tokenBalance: 'loading...',
            votePower: 'loading...',
        })
        wallet?.getBalance().then((balance) => {
            const ethBalance = parseFloat(
                ethers.utils.formatEther(balance)
            ).toString()
            let tokenBalance = ''
            let votePower = ''
            if (contract) {
                contract['balanceOf'](wallet?.address).then(
                    (balanceBN: ethers.BigNumberish) => {
                        tokenBalance = parseFloat(
                            ethers.utils.formatEther(balanceBN)
                        ).toString()
                    }
                )
                contract['getVotes'](wallet?.address).then(
                    (votePowerBN: ethers.BigNumberish) => {
                        votePower = parseFloat(
                            ethers.utils.formatEther(votePowerBN)
                        ).toString()
                    }
                )
            }
            console.log(tokenBalance, tokenBalance, votePower)
        })
    }

    const importWallet = (privateKey: string) => {
        // TODO (optional): make this.wallet to be imported from a privateKey
        updateValues()
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
            <Stack spacing={2} direction="row">
              <Button variant="contained" color="success" onClick={createWallet}>create wallet</Button>
              <Button variant="contained" color="secondary" disabled>import wallet</Button>
              <Button variant="contained" disabled>connect wallet</Button>
            </Stack>
      )}
                {/* {wallet && <Boxes />} */}
            </header>
        </div>
    )
}

export default App
