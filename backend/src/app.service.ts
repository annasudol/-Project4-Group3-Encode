import * as dotenv from 'dotenv';
dotenv.config();
import { Injectable } from '@nestjs/common';
import { ethers, Wallet } from 'ethers';
import { ConfigService } from '@nestjs/config';
import * as ballotJson from './assets/Ballot.json';
import * as myTokenJson from './assets/MyToken.json';
const ETHERSCAN_API_KEY = process.env.ETHERSCAN_API_KEY;
const MNEMONIC = process.env.MNEMONIC;
@Injectable()
export class AppService {
  provider: ethers.providers.BaseProvider;

  constructor(private configService: ConfigService) {
    this.provider = ethers.getDefaultProvider('goerli');
  }

  async requestToken(address: string) {
    const signer = await SetupSigner();
    const contract = new ethers.Contract(
      '0xA5a68F4a956D366711321FB3642cF100bD34018C',
      myTokenJson.abi,
      signer,
    );
    const tx = await contract?.mint(address, ethers.utils.parseEther('1'));
    tx.wait();

    return tx;
  }
}
export async function SetupSigner(): Promise<Wallet> {
  if (ETHERSCAN_API_KEY && MNEMONIC) {
    const provider = ethers.getDefaultProvider('goerli', {
      etherscan: ETHERSCAN_API_KEY,
    });
    const wallet = ethers.Wallet.fromMnemonic(MNEMONIC);

    return wallet.connect(provider);
  } else {
    throw new Error('missing MNEMONIC and ETHERSCAN_API_KEY');
  }
}
