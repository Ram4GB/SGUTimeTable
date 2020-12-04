import { Button, Form, notification, Radio } from "antd";
import { useForm } from "antd/lib/form/Form";
import React from "react";
import FileSaveAs from "file-saver";
import { exportComponentAsJPEG } from "react-component-export-image";

import { ISubject } from "../../../common/interface";

interface IProps {
  data: Array<ISubject>;
  componentRef: any;
}

export default function FormExport(props: IProps) {
  const [form] = useForm();
  const { data, componentRef } = props;

  const handleFinish = (values: any) => {
    if (data && data.length > 0) {
      if (values.type === "0") {
        let s = "";
        for (let i = 0; i < data.length; i++) {
          s += data[i].id + " " + data[i].group + "\n";
        }
        var blob = new Blob([s], {
          type: "text/plain;charset=utf-8",
        });
        FileSaveAs.saveAs(blob, "sgu-schedule.txt");
        form.resetFields();
      } else if (values.type === "1") {
        exportComponentAsJPEG(componentRef);
        form.resetFields();
      } else {
        notification.error({
          message: "Chưa có dạng này",
        });
      }
    }
  };

  return (
    <Form onFinish={handleFinish} layout="vertical">
      <Form.Item name="type" label="Chọn hình thức export" initialValue="0">
        <Radio.Group>
          <Radio value="0">File txt</Radio>
          <Radio value="1">Ảnh</Radio>
          {/* <Radio value="2">Cả 2</Radio> */}
        </Radio.Group>
      </Form.Item>
      <p>Tính năng này sẽ được bổ sung nhiều hơn khi có nhiều người sử dụng</p>
      <Button htmlType="submit">Đồng ý</Button>
    </Form>
  );
}
