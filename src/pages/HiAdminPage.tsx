import {
  Button,
  Card,
  Col,
  notification,
  Popconfirm,
  Row,
  Select,
  Space,
  Table,
  Tag,
  Tooltip,
  Typography,
} from "antd";
import {
  PlusOutlined,
  StopOutlined,
  DownloadOutlined,
} from "@ant-design/icons";
import React, { useCallback, useEffect, useRef, useState } from "react";
import * as uuid from "uuid";
import moment from "moment";

import { initialSchedule, IItemSchedule } from "../schedule";
import FormAddSubject from "../modules/app/components/FormAddSubject";
import { useSelector } from "react-redux";
// import { useDispatch } from "react-redux";
import { IRootState } from "../modules";

// cho fake data
// import { parseJSONToObject } from "../common/utils/parseJSONToObject";
// import data from "../data.json";
// import { getCategory, getSubjectList } from "../modules/app/reducers";

import FormExport from "../modules/app/components/FormExport";
import { parseDate } from "../common/utils/parseDate";

export default function HiAdminPage() {
  const subjectList = useSelector((state: IRootState) => state.app.subjectList);
  const category = useSelector((state: IRootState) => state.app.category);
  // const dispatch = useDispatch();
  const scheduleTableRef = useRef<any>();

  const [selectedRowKeys, setSelectedRowKeys] = useState<any>([]);
  const [selectedRows, setSelectedRows] = useState<Array<any>>([]);
  const [schedule, setSchedule] = useState<IItemSchedule>();
  const [currentDate, setCurrentDate] = useState<string>();
  const [minDate, setMinDate] = useState<any>(null);

  // sau khi chọn kiểm tra trùng và tất cả lỗi ở đây
  useEffect(() => {
    try {
      if (selectedRows && selectedRows.length >= 2) {
        let newSubjectAddToSchedule = selectedRows[selectedRows.length - 1];
        let flag = false;
        let error = "";
        for (let i = 0; i < selectedRows.length - 1; i++) {
          // loop tất cả các môn trong selected Rows
          let dayLearning = selectedRows[i].dayLearning;
          for (let j = 0; j < dayLearning.length; j++) {
            // loop tất cả dayLearning trong môn đó
            for (
              let k = 0;
              k < newSubjectAddToSchedule.dayLearning.length;
              k++
            ) {
              // loop tất cả những ngày học trong môn học vừa dc chọn

              // kiểm tra những ngày trùng trước
              // dayLearning[j] đứng yên và nằm chính giữa
              // k --- j --- k
              if (
                moment(newSubjectAddToSchedule.dayLearning[k].endDate).isBefore(
                  moment(dayLearning[j].startDate)
                ) ||
                moment(dayLearning[j].endDate).isBefore(
                  newSubjectAddToSchedule.dayLearning[k].startDate
                )
              ) {
                continue;
              } else {
                if (
                  newSubjectAddToSchedule.dayLearning[k].day !==
                  dayLearning[j].day
                ) {
                  continue;
                }

                let startClassSessionNewSubject = parseInt(
                  newSubjectAddToSchedule.dayLearning[k].startClassSession
                );
                let endClassSessionNewSubject =
                  startClassSessionNewSubject +
                  parseInt(
                    newSubjectAddToSchedule.dayLearning[k].sessionTotal
                  ) -
                  1;
                let startClassSession = parseInt(
                  dayLearning[j].startClassSession
                );
                let endClassSession =
                  startClassSession + parseInt(dayLearning[j].sessionTotal) - 1;

                // new - j - new
                if (
                  endClassSessionNewSubject < startClassSession ||
                  endClassSession < startClassSessionNewSubject
                ) {
                  continue;
                } else {
                  flag = true;
                  error = `Môn ${newSubjectAddToSchedule.name} có tiết thứ ${newSubjectAddToSchedule.dayLearning[k].day}
                  từ tiết ${startClassSessionNewSubject} đến tiết ${endClassSessionNewSubject}
                  trùng tiết với môn ${selectedRows[i].name} từ tiết ${startClassSession} đến tiết ${endClassSession}.
                  Bạn vui lòng kiểm tra lại 
                  `;
                  break;
                }
              }
            }
            if (flag === true) {
              notification.error({
                message: error,
              });
              setSelectedRowKeys(
                selectedRowKeys.slice(0, selectedRowKeys.length - 1)
              );
              setSelectedRows(selectedRows.slice(0, selectedRows.length - 1));
              return;
            }
          }
        }
      }
    } catch (error) {
      notification.error({
        message: "Lỗi không xác định",
      });
      console.log(error);
    }
  }, [selectedRowKeys, selectedRows]);

  // bỏ các item trong selectedRows vào schdule
  useEffect(() => {
    let scheduleTemp: any = Object.assign({}, initialSchedule());

    if (!currentDate) {
      setSchedule(scheduleTemp);
      return;
    }

    for (let m = 0; m < selectedRows.length; m++) {
      let item = selectedRows[m]; // đây là một môn
      for (let i = 0; i < item.dayLearning.length; i++) {
        // những ngày học của 1 môn
        let dayLearning = item.dayLearning[i];

        let startDate = dayLearning.startDate;
        let endDate = dayLearning.endDate;
        let startDateCurrent = parseDate(currentDate.split("-")[0]);
        let endDateCurrent = parseDate(currentDate.split("-")[1]);

        // kiểm tra dayLearning này có thuộc vào khoảng thời gian của currentDate hay không để render vào
        if (
          moment(startDate).isSameOrBefore(moment(startDateCurrent)) &&
          moment(endDateCurrent).isSameOrBefore(moment(endDate))
        ) {
          for (let n = 0; n < scheduleTemp[dayLearning.day].length; n++) {
            // 1 col của thời khóa biểu
            if (
              scheduleTemp[dayLearning.day][n].sessionNumber >=
                parseInt(dayLearning.startClassSession) &&
              scheduleTemp[dayLearning.day][n].sessionNumber <=
                parseInt(dayLearning.startClassSession) +
                  parseInt(dayLearning.sessionTotal) -
                  1
            ) {
              scheduleTemp[dayLearning.day][n].content = {
                ...item,
                dayLearning,
              };
            }
          }
        }
      }
    }
    setSchedule(scheduleTemp);
  }, [currentDate, selectedRows]);

  console.log(minDate);

  // khởi tạo dữ liệu fake
  // useEffect(() => {
  //   let result = parseJSONToObject(JSON.stringify(data[0]));
  //   if (result) {
  //     dispatch(getSubjectList(result.arr));
  //     dispatch(
  //       getCategory({
  //         categoryID: result.categoryID,
  //         categoryName: result.categoryName,
  //       })
  //     );
  //   }
  //   result = parseJSONToObject(JSON.stringify(data[1]));
  //   if (result) {
  //     dispatch(getSubjectList(result.arr));
  //     dispatch(
  //       getCategory({
  //         categoryID: result.categoryID,
  //         categoryName: result.categoryName,
  //       })
  //     );
  //   }
  //   result = parseJSONToObject(JSON.stringify(data[2]));
  //   if (result) {
  //     dispatch(getSubjectList(result.arr));
  //     dispatch(
  //       getCategory({
  //         categoryID: result.categoryID,
  //         categoryName: result.categoryName,
  //       })
  //     );
  //   }
  // }, [dispatch]);

  const renderSchedule = useCallback(() => {
    let content: any = [];
    if (!schedule) return null;
    for (let i = 2; i <= 8; i++) {
      // render 1 thứ
      let scheduleItem = schedule[i].map((item: any, index: any) => {
        const session: number = index + 1;

        if (item.content !== null) {
          const start: number = parseInt(
            item.content.dayLearning.startClassSession
          );
          const total: number = parseInt(item.content.dayLearning.sessionTotal);
          if (session === start) {
            return (
              <Tooltip
                key={uuid.v4()}
                placement="left"
                color={item.content && item.content.colorTag}
                title={
                  <div>
                    <p>Mã: {item.content.id}</p>
                    <p>Tên: {item.content.name}</p>
                    <p>Nhóm: {item.content.group}</p>
                    <p>Lớp: {item.content.classID}</p>
                    <p>GV: {item.content.nameTeacher}</p>
                    <p>CS & Phòng: {item.content.dayLearning.room}</p>
                  </div>
                }
              >
                <Card
                  style={{
                    backgroundColor: `${item.content.colorTag}`,
                  }}
                  className={`card-child-${total}`}
                  key={uuid.v4()}
                >
                  <p className="card-subject-name">({item.content.name})</p>
                  <p>{item.content.dayLearning.room}</p>
                  <p>Nhóm: {item.content.group}</p>
                  <p>{item.content.id}</p>
                </Card>
              </Tooltip>
            );
          } else return null;
        } else {
          return (
            <Tooltip
              key={uuid.v4()}
              placement="left"
              color={item.content && item.content.colorTag}
              title="Ô trống"
            >
              <Card className="card-child-1" key={uuid.v4()} />
            </Tooltip>
          );
        }
      });
      content.push(
        <Col key={uuid.v4()} style={{ width: "12.5%" }}>
          {scheduleItem}
        </Col>
      );
    }
    return (
      <>
        <Row>
          <Col className="special-td" style={{ width: "12.5%" }}></Col>
          <Col className="special-td" style={{ width: "12.5%" }}>
            Thứ 2
          </Col>
          <Col className="special-td" style={{ width: "12.5%" }}>
            Thứ 3
          </Col>
          <Col className="special-td" style={{ width: "12.5%" }}>
            Thứ 4
          </Col>
          <Col className="special-td" style={{ width: "12.5%" }}>
            Thứ 5
          </Col>
          <Col className="special-td" style={{ width: "12.5%" }}>
            Thứ 6
          </Col>
          <Col className="special-td" style={{ width: "12.5%" }}>
            Thứ 7
          </Col>
          <Col className="special-td" style={{ width: "12.5%" }}>
            Chủ nhật
          </Col>
        </Row>
        <Row>
          <Col style={{ width: "12.5%" }}>
            <Card className="special-td">T.1</Card>
            <Card className="special-td">T.2</Card>
            <Card className="special-td">T.3</Card>
            <Card className="special-td">T.4</Card>
            <Card className="special-td">T.5</Card>
            <Card className="special-td">T.6</Card>
            <Card className="special-td">T.7</Card>
            <Card className="special-td">T.8</Card>
            <Card className="special-td">T.9</Card>
            <Card className="special-td">T.10</Card>
            <Card className="special-td">T.11</Card>
            <Card className="special-td">T.12</Card>
            <Card className="special-td">T.13</Card>
          </Col>
          {content}
        </Row>
      </>
    );
  }, [schedule]);

  const handleShowModal = () => {
    window.Modal.show(<FormAddSubject></FormAddSubject>, {
      title: <Typography.Title>Thêm môn mới</Typography.Title>,
      style: {
        top: 20,
      },
      width: "60%",
    });
  };

  const handleChangeTable = (selectedRowKeysT: any, selectedRowsT: any) => {
    setSelectedRowKeys(selectedRowKeysT);
    setSelectedRows(selectedRowsT);
  };

  const getCheckboxProps = (record: any) => {
    let index = selectedRows.findIndex((i: any) => {
      return i.id === record.id;
    });

    if (index === -1 || selectedRows[index].idGenerate === record.idGenerate) {
      return {
        disabled: false,
      };
    } else {
      return {
        disabled: true,
      };
    }
  };

  const handleDeleteRowKey = () => {
    setSelectedRowKeys([]);
    setSelectedRows([]);
  };

  const handleExport = () => {
    window.Modal.show(
      <FormExport
        componentRef={scheduleTableRef}
        data={selectedRows}
      ></FormExport>,
      {
        style: {
          top: 20,
        },
        width: "60%",
        title: <Typography.Title>Export Schedule</Typography.Title>,
      }
    );
  };

  useEffect(() => {
    let minDateT = null;
    if (selectedRows) {
      for (let i = 0; i < selectedRows.length; i++) {
        let dayLearning = selectedRows[i].dayLearning;
        for (let j = 0; j < dayLearning.length; j++) {
          console.log(dayLearning);
          if (minDateT === null) {
            minDateT = dayLearning[j].startDate;
          } else {
            if (
              new Date(minDateT).getTime() >
              new Date(dayLearning[j].startDate).getTime()
            ) {
              minDateT = dayLearning[j].startDate;
            }
          }
        }
      }

      if (minDateT) {
        let startDate = moment(minDateT);
        let s = startDate.format("DD/MM/YYYY");
        let e = startDate.add(6, "day").format("DD/MM/YYYY");
        setMinDate(minDateT);
        setCurrentDate(`${s}-${e}`);
      } else {
        setMinDate(null);
        setCurrentDate("");
      }
    }
  }, [selectedRows]);

  console.log(minDate);

  const renderWeek = () => {
    let arr: any = [];
    if (minDate) {
      let startDate = moment(minDate);
      for (let i = 0; i < 25; i++) {
        let s = startDate.format("DD/MM/YYYY");
        let e = startDate.add(6, "day").format("DD/MM/YYYY");
        arr.push(
          <Select.Option key={uuid.v4()} value={`${s}-${e}`}>
            Tuần {i + 1} {s}-{e}
          </Select.Option>
        );
        startDate = moment(startDate).add(1, "day");
      }
    }
    return arr;
  };

  const renderColorTagStudentLeft = (total: string) => {
    if (total === "Hết") {
      return "red";
    } else if (parseInt(total) <= 10) {
      return "orange";
    } else {
      return "green";
    }
  };

  const renderTitle = (total: string) => {
    if (total === "Hết") {
      return "Bạn không thể đăng ký môn này được";
    } else if (parseInt(total) <= 10) {
      return "Môn này còn rất ít slot bạn nên chú ý";
    } else {
      return "Bạn có thể đăng ký môn này";
    }
  };

  const handleChangeDate = (value: any) => {
    setCurrentDate(value);
  };

  return (
    <Card>
      <Row gutter={12}>
        <Col style={{ margin: "8px 0px" }} ref={scheduleTableRef} lg={14}>
          <Select
            onChange={handleChangeDate}
            value={currentDate}
            style={{ width: 300, marginBottom: 7 }}
          >
            {renderWeek()}
          </Select>
          {renderSchedule()}
        </Col>
        <Col lg={10}>
          <Col lg={24}>
            <div style={{ margin: "8px 0px", display: "flex" }}>
              <Button
                icon={<PlusOutlined />}
                type="primary"
                onClick={handleShowModal}
              >
                Thêm mới 1 môn
              </Button>
              <div style={{ marginLeft: "auto" }}>
                <Space>
                  <Popconfirm
                    title="Bạn có chắc chắn muốn hủy hết tất cả"
                    onConfirm={handleDeleteRowKey}
                  >
                    <Button danger icon={<StopOutlined />}>
                      Bỏ chọn tất cả
                    </Button>
                  </Popconfirm>
                  <Button icon={<DownloadOutlined />} onClick={handleExport}>
                    Lưu TKB
                  </Button>
                </Space>
              </div>
            </div>
            <Table
              rowKey={(i) => i.idGenerate}
              dataSource={subjectList}
              pagination={{
                pageSize: 3,
                hideOnSinglePage: true,
              }}
              rowSelection={{
                onChange: handleChangeTable,
                getCheckboxProps,
                selectedRowKeys,
                hideSelectAll: true,
              }}
              columns={[
                {
                  title: "Mã",
                  dataIndex: "id",
                  key: "id",
                  filters: [
                    ...category.map((item) => {
                      return {
                        text: item.categoryName,
                        value: item.categoryID,
                      };
                    }),
                  ],
                  onFilter: (value, record) => record.id === value,
                  sorter: (a, b) => a.name.length - b.name.length,
                },
                {
                  key: "mon",
                  title: "Môn",
                  render: (record) => {
                    return (
                      <div key={uuid.v4()}>
                        <Typography.Title level={5}>
                          {record.name}{" "}
                        </Typography.Title>

                        <Row>
                          <Col lg={8}>
                            <Tooltip
                              title={renderTitle(record.totalStudentLeft)}
                            >
                              <Tag
                                color={renderColorTagStudentLeft(
                                  record.totalStudentLeft
                                )}
                              >
                                SL: {record.totalStudentLeft}
                              </Tag>
                            </Tooltip>
                          </Col>
                          <Col lg={8}>
                            <Tag color="blue">Nhóm: {record.group}</Tag>
                          </Col>
                          <Col lg={8}>
                            <Tag>{record.roomID}</Tag>
                          </Col>
                          <Col lg={24}>
                            <p style={{ margin: "8px 0px" }}>
                              {record.nameTeacher}
                            </p>
                          </Col>
                        </Row>
                        <table>
                          <tbody>
                            <tr>
                              <td>Thứ</td>
                              <td>Tiết BD</td>
                              <td>Số tiết</td>
                              <td>Từ/Đến Ngày</td>
                            </tr>
                            {record.dayLearning.map((item: any) => {
                              return (
                                <Tooltip
                                  key={uuid.v4()}
                                  title={`Từ ngày (${item.startDate}-${item.endDate}) Môn này thứ ${item.day} có tiết từ ${item.startClassSession} và có ${item.sessionTotal} tiết`}
                                >
                                  <tr>
                                    <td>{item.day}</td>
                                    <td>{item.startClassSession}</td>
                                    <td>{item.sessionTotal}</td>
                                    <td>
                                      {item.startDate}-{item.endDate}
                                    </td>
                                  </tr>
                                </Tooltip>
                              );
                            })}
                          </tbody>
                        </table>
                      </div>
                    );
                  },
                },
              ]}
            ></Table>
          </Col>
        </Col>
      </Row>
    </Card>
  );
}
