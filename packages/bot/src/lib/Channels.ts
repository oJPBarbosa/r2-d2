import { ChannelsT } from '../interfaces/Channels';
import { ChannelT } from '../interfaces/GuildData';

export class Channels {
  private static channels: ChannelsT = null;

  static addChannels(guild: string, channels: ChannelT[]): void {
    this.channels = {
      ...this.channels,
      [guild]: channels,
    };
  }

  static getChannels(): ChannelsT {
    return this.channels;
  }
}
