import { WebSocketServer } from 'ws';

import { BaseSourceProvider } from './base-source-provider';

import { type BaseUpdateData, type UpdateData } from '../../../common/schema';

export class WebNowPlayingProvider extends BaseSourceProvider {
  public override name = 'web-now-playing';

  private wss: WebSocketServer | null = null;
  private readonly port = 1609;
  private isReady = false;
  private startCalled = false;
  private config: Record<string, unknown> = {};

  private type: UpdateData['data']['type'] = 'idle';
  private readonly lastUpdateData: Partial<BaseUpdateData> = {};

  public override start(config: Record<string, unknown>) {
    this.config = config;
    this.wss = new WebSocketServer({ port: this.port });
    this.wss.on('connection', (ws) => {
      let idleTimeout: NodeJS.Timeout | null = null;

      ws.onopen = () => {
        this.isReady = true;
        ws.send('RECIPIENT');
        this.broadcastStart();
      };
      ws.onclose = () => this.close();
      ws.onerror = (err) => {
        const error = new Error('WebNowPlaying: Server error occurred.');
        error.cause = err;

        this.emit('error', error);
        this.close();
      };
      ws.onmessage = (e) => {
        this.broadcastStart();

        if (typeof e.data !== 'string') return;
        const [key, ...rest] = e.data.split(':');
        const data = rest.join(':');

        switch (key) {
          case 'TITLE':
            this.lastUpdateData.title = data;
            break;
          case 'ARTIST':
            this.lastUpdateData.artists = [data];
            break;
          case 'POSITION':
            this.lastUpdateData.progress = this.convertTime(data);
            break;
          case 'DURATION':
            this.lastUpdateData.duration = this.convertTime(data);
            break;
          case 'COVER':
            this.lastUpdateData.coverUrl = data;
            break;
          case 'STATE': {
            if (idleTimeout !== null) {
              clearTimeout(idleTimeout);
              idleTimeout = null;
            }

            if (data === '0') {
              idleTimeout = setTimeout(() => {
                this.type = 'idle';
                this.updateData();
              }, 500);
            }
            if (data === '1') this.type = 'playing';
            if (data === '2') this.type = 'paused';
            break;
          }
          default:
            break;
        }
        if (this.lastUpdateData.title && this.lastUpdateData.coverUrl) {
          this.lastUpdateData.id = `${this.lastUpdateData.title}:${this.lastUpdateData.coverUrl}`;
        }

        this.updateData();
        // console.log('[Lyrs] [WebNowPlayingProvider] Received message:', e.data);
      };
    });
    this.wss.on('close', this.close.bind(this));
    this.wss.on('error', this.onError.bind(this));
  }

  public override close() {
    this.wss?.close();
    this.wss = null;
    this.isReady = false;
    this.startCalled = false;

    super.close();
  }

  public override isRunning() {
    return this.wss !== null && this.isReady;
  }

  public override onOptionChange(options: Record<string, unknown>) {
    this.config = options;
  }

  private broadcastStart() {
    if (this.startCalled) return;

    this.startCalled = true;
    super.start(this.config);
  }

  private onError(err: Error) {
    const error = new Error('WebNowPlaying: Server error occurred.');
    error.cause = err;

    this.emit('error', error);
    this.close();
  }

  private convertTime(time: string) {
    const [min, sec] = time.split(':').map(Number);
    return (min * 60 + sec) * 1000;
  }

  private updateData() {
    const updateData: UpdateData = {
      data: { type: 'idle' },
      provider: this.name,
    };

    if (this.type === 'playing' || this.type === 'paused') {
      const { id, title, artists, progress, duration, coverUrl } =
        this.lastUpdateData;
      const isDataValid =
        Boolean(id) &&
        Boolean(title) &&
        Boolean(artists) &&
        Boolean(progress) &&
        duration !== undefined &&
        coverUrl !== undefined;

      if (isDataValid) {
        const fullData = this.lastUpdateData as BaseUpdateData;
        updateData.data = {
          type: this.type,
          ...fullData,
        };
      }
    }

    this.emit('update', updateData);
  }
}
