type AuthorT = {
  id: string;
  tag: string;
};

type GuildT = {
  id: string;
  name: string;
};

type ChannelT = {
  id: string;
  name: string;
};

export type CommandLogT = {
  id: string;
  timestamp: Date;
  name: string;
  author: AuthorT;
  guild: GuildT;
  channel: ChannelT;
};
