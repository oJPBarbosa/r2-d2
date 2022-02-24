import { ChannelsT } from '../interfaces/Channels';
import { ChannelT, TutorT } from '../interfaces/GuildData';

export class Channels {
  private static channels: ChannelsT = null;

  static addChannels(guild: string, channels: ChannelT[]): void {
    this.channels = {
      ...this.channels,
      [guild]: channels,
    };
  }

  static getChannels(guild: string): ChannelT[] {
    return this.channels[guild];
  }

  static getChannelTutor(guild: string, channel: string): TutorT {
    const { tutor }: { tutor: TutorT } = this.channels[guild].find(
      (c: ChannelT) => c.id === channel,
    ) as ChannelT;

    return tutor;
  }

  static findChannelByTutor(guild: string, tutor: string): ChannelT {
    const channel: ChannelT = this.channels[guild].find(
      (c: ChannelT) => c.tutor.id === tutor,
    );

    return channel;
  }
}
