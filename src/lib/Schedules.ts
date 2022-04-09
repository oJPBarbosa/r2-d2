import {
  SchedulesT,
  CurrentTutoringT,
  ScheduleT,
  TutoringT,
  TutoringTimeT,
} from '../interfaces';
import { weekdays, date } from '../utils';
import { DateTime } from 'luxon';
import { Channels } from '../lib';

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
      weekdays[date().weekday],
    );

    if (!tts) {
      return;
    }

    const tutorings: CurrentTutoringT[] = [];

    tts.forEach((t: TutoringT) => {
      t.tutoring.forEach((tt: TutoringTimeT) => {
        const now: DateTime = date();

        const [fromHour, fromMinute] = tt.from;
        const [toHour, toMinute] = tt.to;

        if (
          now.hour >= fromHour &&
          now.minute >= fromMinute &&
          now.hour <= toHour &&
          now.minute <= toMinute
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
