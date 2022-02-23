import { AtT } from '../../../interfaces/At';

export interface IStudent {
  id: string;
  name: string;
  enrollment_number: string;
}

export interface ICreateTutoringRequestDTO {
  at: AtT;
  tutor_id: string;
  student: IStudent;
  department_id: string;
}
