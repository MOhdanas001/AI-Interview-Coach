import { Module } from '@nestjs/common';
import { VoiceGateway } from './voice.gateway';

@Module({
  providers: [VoiceGateway],
  exports: [VoiceGateway],
})
export class VoiceModule {}
