import { validate } from 'uuid';

export class DTOError extends Error {
  constructor(message: string) {
    super(message);
  }
}

export const analyzeDTO = (DTO: object) => {
  const keys: string[] = Object.keys(DTO);

  keys.forEach((key: string) => {
    const value: string | object = DTO[key];

    if (typeof value === 'string') {
      if (key.includes('_id') && !validate(value)) {
        throw new DTOError(`${key} is not a valid uuid.`);
      }

      if (value.length === 0) {
        throw new DTOError(`${key} is required.`);
      }
    } else if (typeof value === 'object') {
      if (Object.keys(value).length === 0) {
        throw new DTOError(`${key} cannot be empty.`);
      }

      analyzeDTO(value);
    } else if (value === undefined || value === null) {
      throw new DTOError(`${key} is required.`);
    }
  });
};
