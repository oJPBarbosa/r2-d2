import { IClient } from '../interfaces/Client';
import {
  VoiceChannel,
  Guild,
  GuildMember,
  Collection,
  AnyChannel,
  MessageSelectOptionData,
  MessageActionRow,
  MessageSelectMenu,
  MessageEmbed,
  DMChannel,
  Message,
} from 'discord.js';
import { Channels } from './Channels';
import {
  ChannelT,
  TutorT,
  TutoringT,
  TutoringTimeT,
} from '../interfaces/GuildData';
import { CurrentTutoringT } from '../interfaces/Schedules';
import { Schedules } from './Schedules';
import { weekdays } from '../utils/weekdays';

export default async (client: IClient, interval: number): Promise<void> => {
  await new Promise((resolve) => setTimeout(resolve, interval));

  const channels: ChannelT[] = [];

  client.guilds.cache.forEach((guild: Guild) =>
    Channels.getChannels(guild.id).forEach((channel: ChannelT) =>
      channels.push(channel),
    ),
  );

  setInterval(async () => {
    await new Promise((resolve) => setTimeout(resolve, interval));

    channels.forEach(async (c: ChannelT) => {
      const channel: VoiceChannel = client.channels.cache.get(
        c.id,
      ) as VoiceChannel;

      if (!channel) {
        return;
      }

      const { members }: { members: Collection<string, GuildMember> } = channel;

      const tutor: TutorT = Channels.getChannelTutor(
        channel.guild.id,
        channel.id,
      );

      if (members.size > 0) {
        // if there are members in the channel
        const tutorings: CurrentTutoringT =
          Schedules.getChannelCurrentTutorings(channel.guild.id, channel.id);

        const now: Date = new Date();

        if (tutorings && !members.has(tutor.id)) {
          // if there should be tutorings happening right now in the channel
          // and the tutor is not in the channel
          const tutors: TutorT[] = [];

          client.guilds.cache
            .get(channel.guild.id)
            .channels.cache.forEach((vc: AnyChannel) => {
              if (vc.type === 'GUILD_VOICE' && !vc.name.includes('afk')) {
                const ct: TutorT = Channels.getChannelTutor(
                  channel.guild.id,
                  vc.id,
                );

                if (vc.members.has(ct.id)) {
                  tutors.push(ct);
                }
              }
            });

          const options: MessageSelectOptionData[] = tutors.map((t: TutorT) => {
            const cc: ChannelT = Channels.findChannelByTutor(
              channel.guild.id,
              t.id,
            );

            return {
              label: 'Ir para o canal do monitor ' + cc.tutor.name,
              value: 'go-to-' + cc.id,
            };
          });

          if (tutors.length > 0) {
            options.push({
              label: 'Ir para um canal de um(a) monitor(a) aleatório(a)',
              value: 'go-to-random',
            });
          }

          options.push({
            label: 'Avisar o(a) monitor(a) ' + tutor.name,
            value: 'warn-' + tutor.id,
          });

          const row: MessageActionRow = new MessageActionRow().addComponents(
            new MessageSelectMenu()
              .setCustomId('absent-tutor')
              .setPlaceholder('Nenhuma opção selecionada')
              .addOptions(options),
          );

          members.forEach(async (member: GuildMember) => {
            const embed: MessageEmbed = new MessageEmbed()
              .setTitle('📢 Comunicado da monitoria:')
              .setDescription(
                'Olá, ' +
                  member.user.username +
                  '! O(A) **monitor(a) ' +
                  tutor.name +
                  ' ** deveria estar dando monitoria das ' +
                  '**`' +
                  tutorings.tutoring.from[0].toLocaleString('pt-BR', {
                    minimumIntegerDigits: 2,
                  }) +
                  ':' +
                  tutorings.tutoring.from[1].toLocaleString('pt-BR', {
                    minimumIntegerDigits: 2,
                  }) +
                  '`** às **`' +
                  tutorings.tutoring.to[0].toLocaleString('pt-BR', {
                    minimumIntegerDigits: 2,
                  }) +
                  ':' +
                  tutorings.tutoring.to[1].toLocaleString('pt-BR', {
                    minimumIntegerDigits: 2,
                  }) +
                  '`**.\n\n**Selecione o quê deseja fazer sobre** com uma opções abaixo:',
              )
              .setTimestamp()
              .setColor('#cfd7dc');

            const dm: DMChannel = await member.createDM();

            const messages: Collection<
              string,
              Message<boolean>
            > = await dm.messages.fetch({ limit: 1 });
            const message: Message = messages.first();

            if (message) {
              if (message.createdTimestamp + 60000 < now.getTime()) {
                await dm.send({
                  embeds: [embed],
                  components: [row],
                });
              }
            } else {
              await dm.send({
                embeds: [embed],
                components: [row],
              });
            }
          });
        } else {
          members.forEach(async (member: GuildMember) => {
            const embed: MessageEmbed = new MessageEmbed();

            if (
              !Schedules.getDayTutorings(
                channel.guild.id,
                weekdays[now.getDay()],
              )
            ) {
              embed
                .setTitle('📢 Comunicado da monitoria:')
                .setDescription(
                  `Olá, ${member.user.username}! Não há monitorias hoje.`,
                )
                .setTimestamp()
                .setColor('#cfd7dc');
            } else {
              let tts: string = '';

              Schedules.getDayTutorings(
                channel.guild.id,
                weekdays[now.getDay()],
              )
                .find((t: TutoringT) => t.tutor.id === tutor.id)
                .tutoring.forEach((tt: TutoringTimeT) => {
                  tts +=
                    '- **`' +
                    tt.from[0].toLocaleString('pt-BR', {
                      minimumIntegerDigits: 2,
                    }) +
                    ':' +
                    tt.from[1].toLocaleString('pt-BR', {
                      minimumIntegerDigits: 2,
                    }) +
                    '`** às **`' +
                    tt.to[0].toLocaleString('pt-BR', {
                      minimumIntegerDigits: 2,
                    }) +
                    ':' +
                    tt.to[1].toLocaleString('pt-BR', {
                      minimumIntegerDigits: 2,
                    }) +
                    '`**\n';
                });

              embed
                .setTitle('📢 Comunicado da monitoria:')
                .setDescription(
                  `Olá, ${member.user.username}! **O(A) monitor(a) ${tutor.name} não dá monitoria agora!**\n\nOs horários dele(a) hoje são:\n\n${tts}`,
                )
                .setTimestamp()
                .setColor('#cfd7dc');
            }

            const dm: DMChannel = await member.createDM();

            await new Promise((resolve) => setTimeout(resolve, 1000));

            const messages: Collection<
              string,
              Message<boolean>
            > = await dm.messages.fetch({ limit: 1 });
            const message: Message = messages.first();

            if (message) {
              if (message.createdTimestamp + 60000 < now.getTime()) {
                await dm.send({
                  embeds: [embed],
                });
              }
            } else {
              await dm.send({
                embeds: [embed],
              });
            }
          });
        }
      }
    });
  }, interval);
};
