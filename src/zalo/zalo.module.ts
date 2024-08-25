import { Module } from '@nestjs/common';
import { ZaloService } from './zalo.service';
import { WalletModule } from 'src/wallet/wallet.module';

@Module({
  providers: [ZaloService],
  exports: [ZaloService],
  imports: [
    WalletModule
  ]
})
export class ZaloModule { }
