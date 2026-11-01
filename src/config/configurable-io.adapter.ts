import { INestApplicationContext } from '@nestjs/common';
import { IoAdapter } from '@nestjs/platform-socket.io';
import { ConfigService } from '@nestjs/config';

export class ConfigurableIoAdapter extends IoAdapter {
  constructor(
    app: INestApplicationContext,
    private readonly configService: ConfigService,
  ) {
    super(app);
  }

  createIOServer(port: number, options?: Record<string, unknown>) {
    return super.createIOServer(port, {
      ...options,
      cors: {
        origin: this.configService.getOrThrow<string[]>('CORS_ORIGINS'),
        credentials: true,
      },
    });
  }
}
