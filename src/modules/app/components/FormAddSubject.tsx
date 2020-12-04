import { Button, Form, Input, notification } from "antd";
import React from "react";
import { useDispatch, useSelector } from "react-redux";
import { parseJSONToObject } from "../../../common/utils/parseJSONToObject";
import { getCategory, getSubjectList } from "../reducers";
import { IRootState } from "../../../modules/index";
import { useForm } from "antd/lib/form/Form";

export default function FormAddSubject() {
  const dispatch = useDispatch();
  const [form] = useForm();
  const subjectList = useSelector((state: IRootState) => state.app.subjectList);

  const handleFinish = (values: any) => {
    let result = parseJSONToObject(values.data);
    if (result) {
      // kiểm tra trùng;
      let item = result.arr[0];

      for (let i = 0; i < subjectList.length; i++) {
        if (
          subjectList[i].name === item.name ||
          subjectList[i].id === item.id
        ) {
          notification.error({
            message: "Môn này đã có trong csdl",
          });
          return;
        }
      }
      notification.success({
        message: "Thêm thành công",
      });
      dispatch(getSubjectList(result.arr));
      dispatch(
        getCategory({
          categoryID: result.categoryID,
          categoryName: result.categoryName,
        })
      );
      form.resetFields();
      window.Modal.hide();
    } else {
      notification.error({
        message: "Xảy ra lỗi",
      });
    }
  };
  return (
    <Form form={form} layout="vertical" onFinish={handleFinish}>
      <Form.Item
        label="Dữ liệu"
        name="data"
        rules={[
          {
            message: "Mời điền dữ liệu",
            required: true,
          },
        ]}
      >
        <Input autoComplete="off" placeholder="Dữ liệu" />
      </Form.Item>
      <Button type="primary" htmlType="submit">
        Thêm mới
      </Button>
    </Form>
  );
}
