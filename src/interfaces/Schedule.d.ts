export type TutorT = {
  name: string;
  id: number;
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
