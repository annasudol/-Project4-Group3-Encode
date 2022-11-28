import { HttpClient } from '@angular/common/http';
import { Component } from '@angular/core';
import { ethers } from 'ethers';
import tokenJson from '../assets/MyToken.json'
import ballotJson from '../assets/Ballot.json'
@Component({
    selector: 'app-root',
    templateUrl: './app.component.html',
    styleUrls: ['./app.component.scss']
})
export class AppComponent {
    wallet: ethers.Wallet | undefined;
    provider: ethers.providers.Provider;
    tokenContract: ethers.Contract | undefined;
    ballotContract: ethers.Contract | undefined;

    ethBalance: number | string | undefined;
    tokenBalance: number | string | undefined;
    votePower: number | string | undefined;

    ballotVotePower: number | string | undefined;
    ballotWinningProposal: number | string | undefined;
    ballotWinnerName: string | undefined;

    backendUrl: string | undefined;
    tokenContractAddress: string | undefined;
    ballotContractAddress: string | undefined;

    tokenRequestPending: boolean;
    errorMsg: string | undefined;

    constructor(private http: HttpClient) {
        this.provider = ethers.getDefaultProvider('goerli');
        this.tokenContractAddress = '0x6E3Ec7bD445F25Bf7Da411BAdd4Dac56A4E4Eaaf';
        this.tokenRequestPending = false;
    }

    setTokenContract() {
        if (this.tokenContractAddress) {
            this.tokenContract = new ethers.Contract(this.tokenContractAddress, tokenJson.abi, this.wallet);
        }
    }

    connectBallotContract(address: string) {
        this.ballotContractAddress = address;
        this.ballotContract = new ethers.Contract(address, ballotJson.abi, this.wallet);
        console.log(this.ballotContract, 'this.ballotContract ')
        this.updateValues();
    }

    createWallet() {
        this.wallet = ethers.Wallet.createRandom().connect(this.provider);
        if (this.tokenContractAddress) {
            this.setTokenContract();
            this.updateValues();
        }
    }

    updateValues() {
        [this.ethBalance, this.tokenBalance, this.votePower] = [
            'loading...',
            'loading...',
            'loading...'
        ];
        this.wallet?.getBalance().then((balance) => {
            this.ethBalance = parseFloat(ethers.utils.formatEther(balance));
            if (this.tokenContract) {
                this.tokenContract['balanceOf'](this.wallet?.address).then(
                    (balanceBN: ethers.BigNumberish) => {
                        this.tokenBalance = parseFloat(ethers.utils.formatEther(balanceBN));
                    }
                );
                this.tokenContract['getVotes'](this.wallet?.address).then(
                    (votePowerBN: ethers.BigNumberish) => {
                        this.votePower = parseFloat(ethers.utils.formatEther(votePowerBN));
                    }
                );
            }
            if (this.ballotContract) {
                console.log(this.ballotContract)
                this.ballotContract['votePower'](this.wallet?.address).then(
                    (ballotVotePowerBN: ethers.BigNumberish) => {
                        this.ballotVotePower = parseFloat(ethers.utils.formatEther(ballotVotePowerBN));
                    }
                );
                this.ballotContract['winningProposal']().then(
                    (ballotWinningProposal: number) => {
                        this.ballotWinningProposal = ballotWinningProposal;
                    }
                );
                this.ballotContract['winnerName']().then(
                    (ballotWinnerName: string) => {
                        this.ballotWinnerName = ethers.utils.parseBytes32String(ballotWinnerName);
                    }
                );
            }
        });
    }

    importWallet(secret: string, importMethod: string) {
        if (importMethod == 'mnemonic') {
            this.wallet = ethers.Wallet.fromMnemonic(secret ?? "").connect(this.provider);
        } else {
            this.wallet = new ethers.Wallet(secret ?? "").connect(this.provider);
        }
        if (this.wallet.address.length == 42) {
            this.setTokenContract();
            this.updateValues();
        } else {
            alert(this.errorMsg);
        }
    }


    requestTokensTen() {
        this.tokenRequestPending = true;
    }

    requestTokens(amount: string) {
        this.tokenRequestPending = true;
    }

    delegateTokens(to: string) {
        console.log(`you are delegating tokens to ${to}`);
        if (this.tokenContract) {
            this.tokenContract['delegate'](to).then(this.updateValues());
        }
    }

    transferTokens(to: string, amount: number | string) {
        if (this.tokenContract) {
            this.tokenContract['transfer'](to, amount).then(this.updateValues());
        }
    }

    vote(proposal: number | string, amount: number | string) {
        if (this.ballotContract) {
            this.ballotContract['vote'](proposal, amount).then(this.updateValues());
            console.log('voted successfully');
        }
    }

    connectWallet() {
    }

    disconnectWallet() {
        this.wallet = undefined;
    }
}
