import {
  WebSocketGateway,
  WebSocketServer,
  SubscribeMessage,
  OnGatewayConnection,
  OnGatewayDisconnect,
  MessageBody,
  ConnectedSocket,
} from '@nestjs/websockets';
import { Server, Socket } from 'socket.io';
import { Logger } from '@nestjs/common';

@WebSocketGateway({
  cors: {
    origin: '*',
  },
  namespace: 'voice',
})
export class VoiceGateway implements OnGatewayConnection, OnGatewayDisconnect {
  private readonly logger = new Logger(VoiceGateway.name);

  @WebSocketServer()
  server: Server;

  handleConnection(client: Socket) {
    this.logger.log(`Voice client connected: ${client.id}`);
    client.emit('session_established', {
      sessionId: client.id,
      status: 'READY',
      audioCodec: 'audio/webm;codecs=opus',
    });
  }

  handleDisconnect(client: Socket) {
    this.logger.log(`Voice client disconnected: ${client.id}`);
  }

  @SubscribeMessage('audio_chunk')
  handleAudioChunk(
    @ConnectedSocket() client: Socket,
    @MessageBody() payload: { chunk: string; sequence: number },
  ) {
    this.logger.debug(
      `Received audio chunk ${payload.sequence} from ${client.id}`,
    );

    // Echo back audio visualizer feedback waveform spectrum values
    const mockSpectrum = Array.from({ length: 16 }, () =>
      Math.floor(Math.random() * 80 + 20),
    );

    client.emit('speech_visualizer', {
      volume: Math.floor(Math.random() * 40 + 60),
      spectrum: mockSpectrum,
      state: 'LISTENING',
    });
  }

  @SubscribeMessage('end_speech')
  handleEndSpeech(@ConnectedSocket() client: Socket) {
    client.emit('transcription_result', {
      text: 'Candidate speech completed. Processing response...',
      isFinal: true,
    });
  }
}
