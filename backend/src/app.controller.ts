import { Controller, Get, Param } from '@nestjs/common';
import { AppService } from './app.service';

@Controller()
export class AppController {
  constructor(private readonly appService: AppService) { }

  @Get('requestToken/:address')
  getBlock(@Param('address') address: string) {
    return this.appService.requestToken(address);
  }
}
