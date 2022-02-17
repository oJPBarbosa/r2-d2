import { IClient } from '../interfaces/Client';
import {
  Collection,
  Guild,
  Channel,
  VoiceChannel,
  GuildMember,
  DMChannel,
  Message,
  MessageSelectOptionData,
  MessageActionRow,
  MessageSelectMenu,
  MessageEmbed,
  EmbedFieldData,
} from 'discord.js';
import {
  GuildDataT,
  ScheduleT,
  ChannelT,
  TutoringT,
  TutorT,
  TutoringTimeT,
} from '../interfaces/GuildData';
import axios, { AxiosResponse } from 'axios';
import { weekdays } from '../utils/weekdays';

export default async (client: IClient): Promise<void> => {
  const guilds: Collection<string, Guild> = client.guilds.cache;

  guilds.forEach((guild: Guild) => {
    const guildDataURL: string = process.env.SCHEDULES_URL.replace(
      '{guild}',
      guild.id,
    );

    axios
      .get(guildDataURL)
      .then((response: AxiosResponse<any, any>) => response.data)
      .then((data: GuildDataT) => {
        const {
          schedules,
          channels,
        }: { schedules: ScheduleT; channels: ChannelT[] } = data;

        const tutoringChannels: Collection<string, Channel> =
          guild.channels.cache
            .filter((channel: Channel) => channel.type === 'GUILD_VOICE')
            .filter(
              (voiceChannel: VoiceChannel) =>
                !voiceChannel.name.toLowerCase().includes('afk'),
            );

        tutoringChannels.forEach((tutoringChannel: VoiceChannel) => {
          const { tutor }: { tutor: TutorT } = channels.find(
            (channel: ChannelT) => channel.id === tutoringChannel.id,
          ) as ChannelT;

          const weekday: string = weekdays[new Date().getDay()];
          const now: Date = new Date();

          if (schedules[weekday]) {
            const schedule: TutoringT = schedules[weekday].find(
              (tutoring: TutoringT) => tutoring.tutor.id === tutor.id,
            );

            const currentTutorings: TutoringTimeT[] = schedule.tutoring.filter(
              (t: TutoringTimeT) => {
                const tutoringFromDate: Date = new Date();
                tutoringFromDate.setHours(t.from[0]);
                tutoringFromDate.setMinutes(t.from[1]);

                const tutoringToDate: Date = new Date();
                tutoringToDate.setHours(t.to[0]);
                tutoringToDate.setMinutes(t.to[1]);

                return (
                  now.getTime() >= tutoringFromDate.getTime() &&
                  now.getTime() <= tutoringToDate.getTime()
                );
              },
            );

            if (
              tutoringChannel.members.size > 0 &&
              !tutoringChannel.members.find(
                (member: GuildMember) => member.id === tutor.id,
              ) &&
              currentTutorings.length > 0
            ) {
              tutoringChannel.members.forEach((member: GuildMember) => {
                if (member.id !== tutor.id) {
                  member.createDM().then((dm: DMChannel) => {
                    dm.messages
                      .fetch({ limit: 1 })
                      .then((message: Collection<string, Message<boolean>>) =>
                        message.first(),
                      )
                      .then(async (message: Message<boolean>) => {
                        const tutoringTutors: GuildMember[] = [];

                        tutoringChannels.forEach((channel: VoiceChannel) =>
                          channel.members.forEach(
                            (tutoringTutor: GuildMember) => {
                              if (
                                channels
                                  .map((c: ChannelT) => c.tutor.id)
                                  .includes(tutoringTutor.id)
                              ) {
                                tutoringTutors.push(tutoringTutor);
                              }
                            },
                          ),
                        );

                        const options: MessageSelectOptionData[] =
                          tutoringTutors.map((t: GuildMember) => {
                            const tutorChannel: ChannelT = channels.find(
                              (c: ChannelT) => c.tutor.id === t.id,
                            );

                            return {
                              label: `Ir para o canal do monitor ${tutorChannel.tutor.name}`,
                              value: tutorChannel.id,
                            };
                          });

                        if (tutoringTutors.length > 0) {
                          options.push({
                            label:
                              'Ir para um canal de um(a) monitor(a) aleatório(a)',
                            value: 'random',
                          });
                        }

                        options.push({
                          label: 'Avisar o(a) monitor(a) ' + tutor.name,
                          value: 'warn',
                        });

                        const row: MessageActionRow =
                          new MessageActionRow().addComponents(
                            new MessageSelectMenu()
                              .setCustomId('absent-tutor')
                              .setPlaceholder('Nenhuma opção selecionada')
                              .addOptions(options),
                          );

                        const absentTutor: MessageEmbed = new MessageEmbed()
                          .setTitle('📢 Comunicado da monitoria:')
                          .setDescription(
                            `Olá, ${member.user.username}! O(A) **monitor(a) ${
                              tutor.name
                            }** deveria estar dando monitoria das **${currentTutorings[0].from[0].toLocaleString(
                              'pt-BR',
                              {
                                minimumIntegerDigits: 2,
                              },
                            )}:${currentTutorings[0].from[1].toLocaleString(
                              'pt-BR',
                              {
                                minimumIntegerDigits: 2,
                              },
                            )}** às **${currentTutorings[0].to[0].toLocaleString(
                              'pt-BR',
                              {
                                minimumIntegerDigits: 2,
                              },
                            )}:${currentTutorings[0].to[1].toLocaleString(
                              'pt-BR',
                              {
                                minimumIntegerDigits: 2,
                              },
                            )}**.\n\n**Selecione o quê deseja fazer sobre** com uma opções abaixo:`,
                          )
                          .setTimestamp()
                          .setColor('#cfd7dc');

                        if (message) {
                          if (
                            message.createdTimestamp + 300000 < now.getTime() ||
                            !message?.embeds[0]?.description?.includes(
                              'monitor(a) ' + tutor.name,
                            ) ||
                            message?.embeds[0]?.description !==
                              `Olá, ${member.user.username}! Não há monitorias hoje.`
                          ) {
                            await dm.send({
                              embeds: [absentTutor],
                              components: [row],
                            });
                          }
                        } else {
                          await dm.send({
                            embeds: [absentTutor],
                            components: [row],
                          });
                        }
                      });
                  });
                }
              });
            } else if (currentTutorings.length === 0) {
              tutoringChannel.members.forEach((member: GuildMember) => {
                if (member.id !== tutor.id) {
                  member.createDM().then((dm: DMChannel) => {
                    dm.messages
                      .fetch({ limit: 1 })
                      .then((message: Collection<string, Message<boolean>>) =>
                        message.first(),
                      )
                      .then(async (message: Message<boolean>) => {
                        let tutorings: string = '';
                        schedule.tutoring.forEach((t: TutoringTimeT) => {
                          tutorings += `- **${t.from[0].toLocaleString(
                            'pt-BR',
                            {
                              minimumIntegerDigits: 2,
                            },
                          )}:${t.from[1].toLocaleString('pt-BR', {
                            minimumIntegerDigits: 2,
                          })}** às **${t.to[0].toLocaleString('pt-BR', {
                            minimumIntegerDigits: 2,
                          })}:${t.to[1].toLocaleString('pt-BR', {
                            minimumIntegerDigits: 2,
                          })}**\n`;
                        });

                        const noTutoringsNow: MessageEmbed = new MessageEmbed()
                          .setTitle('📢 Comunicado da monitoria:')
                          .setDescription(
                            `Olá, ${member.user.username}! **O(A) monitor(a) ${tutor.name} não dá monitoria agora!**\n\nOs horários dele(a) hoje são:\n\n${tutorings}`,
                          )
                          .setTimestamp()
                          .setColor('#cfd7dc');

                        if (message) {
                          if (
                            message.createdTimestamp + 300000 < now.getTime() ||
                            !message?.embeds[0]?.description?.includes(
                              'monitor(a) ' + tutor.name,
                            ) ||
                            message?.embeds[0]?.description !==
                              `Olá, ${member.user.username}! Não há monitorias hoje.`
                          ) {
                            await dm.send({
                              embeds: [noTutoringsNow],
                            });
                          }
                        }
                      });
                  });
                }
              });
            }
          } else {
            tutoringChannel.members.forEach((member: GuildMember) => {
              member.createDM().then((dm: DMChannel) => {
                dm.messages
                  .fetch({ limit: 1 })
                  .then((message: Collection<string, Message<boolean>>) =>
                    message.first(),
                  )
                  .then(async (message: Message<boolean>) => {
                    const noTutoringsToday: MessageEmbed = new MessageEmbed()
                      .setTitle('📢 Comunicado da monitoria:')
                      .setDescription(
                        `Olá, ${member.user.username}! Não há monitorias hoje.`,
                      )
                      .setTimestamp()
                      .setColor('#cfd7dc');

                    if (message) {
                      if (
                        message.createdTimestamp + 300000 < now.getTime() ||
                        message?.embeds[0]?.description !==
                          `Olá, ${member.user.username}! Não há monitorias hoje.`
                      ) {
                        await dm.send({
                          embeds: [noTutoringsToday],
                        });
                      }
                    }
                  });
              });
            });
          }
        });
      });
  });
};
