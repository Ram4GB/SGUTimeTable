export interface IDayLearning {
  day: string;
  startClassSession: string;
  sessionTotal: string;
  room: string;
}

export interface ISubject {
  id: string;
  name: string;
  group: string;
  dayLearning: Array<IDayLearning>;
  idGenerate: string;
  colorTag: string;
  classID: string;
  nameTeacher: string;
  skillNumber: string;
  totalStudent: string;
  roomID: string;
}

export interface ICategory {
  categoryName: any;
  categoryID: any;
}
