import { DateTime } from 'luxon';

function date(): DateTime {
  return DateTime.now().setZone('America/Sao_Paulo');
}

export { date };
