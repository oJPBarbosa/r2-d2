import { SchedulesT, CurrentTutoringT } from '../interfaces/Schedules';
import {
  ScheduleT,
  TutoringT,
  TutoringTimeT,
  TutorT,
} from '../interfaces/GuildData';
import { weekdays } from '../utils/weekdays';
import { Channels } from './Channels';

export class Schedules {
  private static schedules: SchedulesT = null;

  static addSchedule(guild: string, schedule: ScheduleT): void {
    this.schedules = {
      ...this.schedules,
      [guild]: schedule,
    };
  }

  static getTutorings(guild: string): TutoringT[] {
    return this.schedules[guild];
  }

  static getDayTutorings(guild: string, day: string): TutoringT[] {
    return this.schedules[guild][day];
  }

  static getCurrentTutorings(guild: string): CurrentTutoringT[] {
    const tts: TutoringT[] = this.getDayTutorings(
      guild,
      weekdays[new Date().getDay()],
    );

    if (!tts) {
      return;
    }

    const tutorings: CurrentTutoringT[] = [];

    tts.forEach((t: TutoringT) => {
      t.tutoring.forEach((tt: TutoringTimeT) => {
        const now: Date = new Date();

        const tutoringFrom: Date = new Date();
        tutoringFrom.setHours(tt.from[0]);
        tutoringFrom.setMinutes(tt.from[1]);

        const tutoringTo: Date = new Date();
        tutoringTo.setHours(tt.to[0]);
        tutoringTo.setMinutes(tt.to[1]);

        if (
          now.getTime() >= tutoringFrom.getTime() &&
          now.getTime() <= tutoringTo.getTime()
        ) {
          tutorings.push({
            tutor: t.tutor,
            tutoring: {
              from: tt.from,
              to: tt.to,
            },
            channel: Channels.findChannelByTutor(guild, t.tutor.id).id,
          });
        }
      });
    });

    return tutorings;
  }

  static getChannelCurrentTutorings(
    guild: string,
    channel: string,
  ): CurrentTutoringT {
    const tutorings: CurrentTutoringT[] = this.getCurrentTutorings(guild);

    if (!tutorings) {
      return;
    }

    return tutorings.find((t: CurrentTutoringT) => t.channel === channel);
  }
}
