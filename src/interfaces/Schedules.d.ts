import { ScheduleT, TutorT, TutoringTimeT } from '.';

export type SchedulesT = {
  schedule: ScheduleT;
};

export type CurrentTutoringT = {
  tutor: TutorT;
  tutoring: TutoringTimeT;
  channel: string;
};
