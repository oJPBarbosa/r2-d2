import { SchedulesT, NowTutoringsT } from '../interfaces/Schedules';
import { ScheduleT, TutoringT, TutoringTimeT } from '../interfaces/GuildData';
import { weekdays } from '../utils/weekdays';

export class Schedules {
  private static schedules: SchedulesT = null;

  static addSchedule(guild: string, schedule: ScheduleT): void {
    this.schedules = {
      ...this.schedules,
      [guild]: schedule,
    };
  }

  static getSchedules(): SchedulesT {
    return this.schedules;
  }

  static getDayTutorings(guild: string, day: string): TutoringT[] {
    return this.schedules[guild][day];
  }

  static getNowTutorings(guild: string): NowTutoringsT[] {
    const tts: TutoringT[] = this.getDayTutorings(
      guild,
      weekdays[new Date().getDay()],
    );

    if (!tts) {
      return;
    }

    const tutorings: NowTutoringsT[] = [];

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
          });
        }
      });
    });

    return tutorings;
  }
}
