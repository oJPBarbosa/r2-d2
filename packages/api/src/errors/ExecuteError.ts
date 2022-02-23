export interface IExecuteError {
  message: string;
  status: number;
}

export class ExecuteError extends Error {
  message: string;

  status: number;

  constructor(error: IExecuteError) {
    super(error.message);

    this.message = error.message;
    this.status = error.status;
  }
}
