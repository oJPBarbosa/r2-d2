import { ScheduleT, TutorT, TutoringTimeT } from './GuildData';

export type SchedulesT = {
  schedule: ScheduleT;
};

export type NowTutoringsT = {
  tutor: TutorT;
  tutoring: TutoringTimeT;
};
