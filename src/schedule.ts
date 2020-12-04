// hàm này sẽ render ra default value của timetable

export interface IItemSchedule {
  [day: string]: Array<{
    sessionNumber: number;
    content: null;
  }>;
}

export const initialSchedule = () => {
  // từ thứ 2 đến cn
  let temp: any = {};
  for (let i = 2; i <= 8; i++) {
    let sessions: any = [];
    for (let j = 1; j <= 13; j++) {
      sessions.push({
        sessionNumber: j,
        content: null,
      });
    }

    temp = {
      ...temp,
      [i]: sessions,
    };
  }
  //   console.log(temp);
  return temp;
};
