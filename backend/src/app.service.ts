import { Injectable } from '@nestjs/common';
import { ethers } from 'ethers';
import { ConfigService } from '@nestjs/config';
import * as ballotJson from './assets/Ballot.json';
import * as myTokenJson from './assets/MyToken.json';

@Injectable()
export class AppService {
  provider: ethers.providers.BaseProvider;

  constructor(private configService: ConfigService) {
    this.provider = ethers.getDefaultProvider('goerli');
  }
  async getBalances(address: string) {
    const contactBalout = new ethers.Contract(
      '0xA5a68F4a956D366711321FB3642cF100bD34018C',
      ballotJson.abi,
      this.provider,
    );

    const constractToken = new ethers.Contract(
      '0x6E3Ec7bD445F25Bf7Da411BAdd4Dac56A4E4Eaaf',
      myTokenJson.abi,
      this.provider,
    );
    const VPbn = await contactBalout?.votePower(address);
    const balanceBn = await constractToken?.balanceOf(address);

    return {
      votePower: ethers.utils.formatEther(VPbn),
      balance: ethers.utils.formatEther(balanceBn),
    };
  }
}
