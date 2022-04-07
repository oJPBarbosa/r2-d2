import { DateTime } from 'luxon';

export default (): DateTime => DateTime.now().setZone('America/Sao_Paulo');
