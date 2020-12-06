export const parseDate = (date: string) => {
  try {
    // 18/01/2021
    // 00/01/02
    let split = date.split("/");
    return split[2] + "/" + split[1] + "/" + split[0];
  } catch (error) {
    console.log(error);
    return "";
  }
};
