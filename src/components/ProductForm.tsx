import { Form, Input, InputNumber, Select, Button } from "antd";
import { Product } from "../types/Product";

interface Props {
  initialValues?: Partial<Product>;
  onSubmit: (values: any) => void;
  submitText: string;
}

export default function ProductForm({
  initialValues,
  onSubmit,
  submitText,
}: Props) {
  const [form] = Form.useForm();

  return (
    <Form
      layout="vertical"
      form={form}
      initialValues={initialValues}
      onFinish={onSubmit}
    >
      <Form.Item name="name" label="Product Name" rules={[{ required: true }]}>
        <Input />
      </Form.Item>

      <Form.Item name="price" label="Price" rules={[{ required: true }]}>
        <InputNumber style={{ width: "100%" }} min={0} />
      </Form.Item>

      <Form.Item name="stock" label="Stock" rules={[{ required: true }]}>
        <InputNumber style={{ width: "100%" }} min={0} />
      </Form.Item>

      <Form.Item name="category" label="Category" rules={[{ required: true }]}>
        <Select
          options={[
            { value: "Electronics", label: "Electronics" },
            { value: "Sportswear", label: "Sportswear" },
            { value: "Accessories", label: "Accessories" },
          ]}
        />
      </Form.Item>

      <Button type="primary" htmlType="submit" block>
        {submitText}
      </Button>
    </Form>
  );
}
