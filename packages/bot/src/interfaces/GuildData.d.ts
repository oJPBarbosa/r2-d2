export type TutorT = {
  name: string;
  id: string;
};

export type TutoringTimeT = {
  from: number[];
  to: number[];
};

export type TutoringT = {
  tutor: TutorT;
  tutoring: TutoringTimeT[];
};

export type ScheduleT = {
  day: TutoringT[];
};

export type ChannelT = {
  id: string;
  tutor: TutorT;
};

export type GuildDataT = {
  schedule: ScheduleT;
  channels: ChannelT[];
};
