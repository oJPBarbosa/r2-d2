import { ScheduleT, TutorT, TutoringTimeT } from '@/interfaces';

export type SchedulesT = {
  schedule: ScheduleT;
};

export type CurrentTutoringT = {
  tutor: TutorT;
  tutoring: TutoringTimeT;
  channel: string;
};
