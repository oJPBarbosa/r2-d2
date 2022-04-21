export type CommandLogAuthorT = {
  id: string;
  tag: string;
};

export type CommandLogGuildT = {
  id: string;
  name: string;
};

export type CommandLogChannelT = {
  id: string;
  name: string;
};

export type CommandLogT = {
  id: string;
  timestamp: Date;
  name: string;
  author: CommandLogAuthorT;
  guild: CommandLogGuildT;
  channel: CommandLogChannelT;
};
