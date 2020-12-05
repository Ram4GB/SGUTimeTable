import { notification } from "antd";
import cheerio from "cheerio";
import { v4 } from "uuid";
import { IDayLearning, ISubject } from "../interface";
import randomColor from "randomcolor";

export const parseJSONToObject = (data: any) => {
  try {
    // nhớ handle js chỗ này
    let result: { value: string } = JSON.parse(data);

    let id;
    let name;

    if (result.value) {
      // lấy dữ liệu
      let $ = cheerio.load(result.value);
      let rows = $(".body-table");
      let arr = [];
      for (let i = 0; i < rows.length; i++) {
        let subject: ISubject = {
          id: "",
          name: "",
          group: "",
          dayLearning: [],
          idGenerate: v4(),
          colorTag: randomColor({
            luminosity: "dark",
            hue: "random",
          }),
          classID: "",
          nameTeacher: "",
          skillNumber: "",
          totalStudent: "",
          roomID: "",
        };
        // tìm ra những col trong 1 rows
        let cols = rows.eq(i).find("tr td");
        subject.id = cols.eq(1).text().replaceAll(/\s+/g, "");
        subject.name = cols.eq(2).text().replaceAll(/\s+/g, " ");
        subject.group = cols.eq(3).text().replaceAll(/\s+/g, " ");
        subject.classID = cols.eq(7).text().replaceAll(/\s+/g, " ");
        subject.nameTeacher = cols.eq(15).text().replaceAll(/\s+/g, " ");
        subject.skillNumber = cols.eq(5).text().replaceAll(/\s+/g, " ");
        subject.totalStudent = cols.eq(8).text().replaceAll(/\s+/g, " ");
        subject.roomID = cols.eq(14).text().replaceAll(/\s+/g, " ");

        if (i === 0) {
          id = subject.id;
          name = subject.name;
        } else {
          if (id !== subject.id || name !== subject.name) {
            notification.error({
              message: "Dữ liệu môn không giống nhau",
            });
            return null;
          }
        }

        let days: any = cols.eq(11).text().split(" ")[0];
        let startClassSessions: any = cols.eq(12).text().split(" ")[0];
        let sessionTotals: any = cols.eq(13).text().split(" ")[0];
        let rooms: any = cols.eq(14).text().split(" ")[0];

        days = days.replaceAll("Hai", "2");
        days = days.replaceAll("Ba", "3");
        days = days.replaceAll("Tư", "4");
        days = days.replaceAll("Năm", "5");
        days = days.replaceAll("Sáu", "6");
        days = days.replaceAll("Bảy", "7");

        // chuẩn hóa chuỗi
        days = days.replaceAll(/\s+/g, " ");
        startClassSessions = startClassSessions.replaceAll(/\s+/g, " ");
        sessionTotals = sessionTotals.replaceAll(/\s+/g, " ");
        rooms = rooms.replaceAll(/\s+/g, " ");

        // split string
        days = days.split(" ");
        startClassSessions = startClassSessions.split(" ");
        sessionTotals = sessionTotals.split(" ");
        rooms = rooms.split(" ");
        // console.log("days sau khi split:", days);
        // console.log("startClassSessions sau khi split:", startClassSessions);
        // console.log("sessionTotals chuỗi sau khi split:", sessionTotals);

        let dayLearning: Array<IDayLearning> = [];
        for (let j = 0; j < days.length; j++) {
          dayLearning.push({
            day: days[j],
            startClassSession: startClassSessions[j],
            sessionTotal: sessionTotals[j],
            room: rooms[j],
          });
        }
        subject.dayLearning = dayLearning;
        arr.push(subject);
      }
      return {
        arr,
        categoryID: id,
        categoryName: name,
      };
    } else {
      return null;
    }
  } catch (error) {
    console.log(error);
    notification.error({
      message: "Chưa đúng định dạng value|json",
    });
    return null;
  }
};
