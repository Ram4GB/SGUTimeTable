import {
  Button,
  Card,
  Col,
  notification,
  Popconfirm,
  Row,
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

import { initialSchedule, IItemSchedule } from "../schedule";
import FormAddSubject from "../modules/app/components/FormAddSubject";
import { useDispatch, useSelector } from "react-redux";
import { IRootState } from "../modules";

// cho fake data
import { parseJSONToObject } from "../common/utils/parseJSONToObject";
import data from "../data.json";
import { getCategory, getSubjectList } from "../modules/app/reducers";
import FormExport from "../modules/app/components/FormExport";

export default function HiAdminPage() {
  const subjectList = useSelector((state: IRootState) => state.app.subjectList);
  const category = useSelector((state: IRootState) => state.app.category);
  const dispatch = useDispatch();
  const scheduleTableRef = useRef<any>();

  const [selectedRowKeys, setSelectedRowKeys] = useState<any>([]);
  const [selectedRows, setSelectedRows] = useState<any>([]);
  const [schedule, setSchedule] = useState<IItemSchedule>();

  useEffect(() => {
    let scheduleTemp: any = Object.assign({}, initialSchedule());
    for (let m = 0; m < selectedRows.length; m++) {
      let item = selectedRows[m]; // đây là một môn
      for (let i = 0; i < item.dayLearning.length; i++) {
        // những ngày học của 1 môn
        let dayLearning = item.dayLearning[i];
        let temp = [];
        // đánh đấu không trùng
        let flag = false;
        let error = "";
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
            // nếu nằm trong điều kiện có thể bỏ môn vào
            if (!scheduleTemp[dayLearning.day][n].content) {
              temp.push({
                ...scheduleTemp[dayLearning.day][n],
                content: item,
                dayLearning,
              });
            } else {
              if (scheduleTemp[dayLearning.day][n].content.id !== item.id) {
                // môn này trùng thời khóa biểu với môn khác
                flag = true;
                error = "Môn này trùng thời khóa biểu với môn khác";
                break;
              } else {
                // môn này có thời khóa biểu không chính xác
                flag = true;
                error = "Môn này có thời khóa biểu không chính xác";
                break;
              }
            }
          } else {
            // không thỏa điều kiện
            temp.push(scheduleTemp[dayLearning.day][n]);
          }
        }

        if (flag === true) {
          notification.error({
            message: error,
          });
          setSelectedRows([
            ...selectedRows.slice(0, m),
            ...selectedRows.slice(m + 1),
          ]);
          setSelectedRowKeys([
            ...selectedRowKeys.slice(0, m),
            ...selectedRowKeys.slice(m + 1),
          ]);
          break;
        } else {
          scheduleTemp[dayLearning.day] = temp;
        }
      }
    }
    setSchedule(scheduleTemp);
  }, [selectedRowKeys, selectedRows]);

  // khởi tạo dữ liệu fake
  useEffect(() => {
    let result = parseJSONToObject(JSON.stringify(data[0]));
    if (result) {
      dispatch(getSubjectList(result.arr));
      dispatch(
        getCategory({
          categoryID: result.categoryID,
          categoryName: result.categoryName,
        })
      );
    }
    result = parseJSONToObject(JSON.stringify(data[1]));
    if (result) {
      dispatch(getSubjectList(result.arr));
      dispatch(
        getCategory({
          categoryID: result.categoryID,
          categoryName: result.categoryName,
        })
      );
    }
    result = parseJSONToObject(JSON.stringify(data[2]));
    if (result) {
      dispatch(getSubjectList(result.arr));
      dispatch(
        getCategory({
          categoryID: result.categoryID,
          categoryName: result.categoryName,
        })
      );
    }
    result = parseJSONToObject(JSON.stringify(data[3]));
    if (result) {
      dispatch(getSubjectList(result.arr));
      dispatch(
        getCategory({
          categoryID: result.categoryID,
          categoryName: result.categoryName,
        })
      );
    }
  }, [dispatch]);

  const renderSchedule = useCallback(() => {
    let content: any = [];
    if (!schedule) return null;
    for (let i = 2; i <= 8; i++) {
      // render 1 thứ
      let scheduleItem = schedule[i].map((item: any, index: any) => {
        const session: number = index + 1;

        if (item.content !== null) {
          const start: number = parseInt(item.dayLearning.startClassSession);
          const total: number = parseInt(item.dayLearning.sessionTotal);
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
                    <p>CS & Phòng: {item.dayLearning.room}</p>
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
                  <p className="card-subject-name">
                    <b>{item.content.id}</b>({item.content.name})
                  </p>
                  <p>Nhóm: {item.content.group}</p>
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

  return (
    <Card>
      <Row gutter={12}>
        <Col ref={scheduleTableRef} lg={14}>
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
                    let day: any = [];
                    let start: any = [];
                    let end: any = [];

                    record.dayLearning.forEach((item: any, index: any) => {
                      if (index === 0) {
                        day.push(<td key={uuid.v4()}>Thứ</td>);
                        start.push(<td key={uuid.v4()}>Tiết bắt đầu</td>);
                        end.push(<td key={uuid.v4()}>Số tiết</td>);
                      }
                      day.push(
                        <td key={uuid.v4()} style={{ marginRight: 4 }}>
                          {item.day}
                        </td>
                      );
                      start.push(
                        <td key={uuid.v4()} style={{ marginRight: 4 }}>
                          {item.startClassSession}
                        </td>
                      );
                      end.push(
                        <td key={uuid.v4()} style={{ marginRight: 4 }}>
                          {item.sessionTotal}
                        </td>
                      );
                    });

                    return (
                      <div key={uuid.v4()}>
                        <Typography.Title level={5}>
                          {record.name}
                        </Typography.Title>
                        <Row>
                          <Col lg={8}>
                            <Tag color="blue">Nhóm: {record.group}</Tag>
                          </Col>
                          <Col lg={8}>
                            <p>{record.roomID}</p>
                          </Col>
                          <Col lg={8}>
                            <p>{record.nameTeacher}</p>
                          </Col>
                        </Row>
                        <table>
                          <tbody>
                            <tr>{day}</tr>
                            <tr>{start}</tr>
                            <tr>{end}</tr>
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
