type CommandLogAuthorT = {
  id: string;
  tag: string;
};

type CommandLogGuildT = {
  id: string;
  name: string;
};

type CommandLogChannelT = {
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
