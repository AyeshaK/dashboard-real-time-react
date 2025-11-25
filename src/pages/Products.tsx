import {
  Button,
  Drawer,
  Input,
  Popconfirm,
  Space,
  Table,
  Typography,
} from "antd";
import { useState } from "react";
import { Product } from "../types/Product";
import ProductForm from "../components/ProductForm";
import {
  useCreateProduct,
  useDeleteProduct,
  useProducts,
  useUpdateProduct,
} from "../api/products";

const Products = () => {
  const [page, setPage] = useState<number>(1);
  const [search, setSearch] = useState<string>("");

  const [editing, setEditing] = useState<Product | null>(null);
  const [isDrawerOpen, setDrawerOpen] = useState<boolean>(false);

  const { data, isLoading } = useProducts({ page, search });
  const createProduct = useCreateProduct();
  const updateProduct = useUpdateProduct();
  const deleteProduct = useDeleteProduct();

  const openCreate = () => {
    setEditing(null);
    setDrawerOpen(true);
  };

  const openEdit = (product: Product) => {
    setEditing(product);
    setDrawerOpen(true);
  };

  const columns = [
    { title: "ID", dataIndex: "id" },
    { title: "Name", dataIndex: "name" },
    { title: "Price", dataIndex: "price" },
    { title: "Stock", dataIndex: "stock" },
    { title: "Category", dataIndex: "category" },
    {
      title: "Actions",
      render: (_: any, record: Product) => (
        <Space>
          <Button type="link" onClick={() => openEdit(record)}>
            Edit
          </Button>

          <Popconfirm
            title="Delete product?"
            onConfirm={() => deleteProduct.mutate(record.id)}
          >
            <Button type="link" danger>
              Delete
            </Button>
          </Popconfirm>
        </Space>
      ),
    },
  ];

  return (
    <div style={{ padding: 24 }}>
      <Typography.Title level={2}>Products</Typography.Title>

      <Space style={{ marginBottom: 16 }}>
        <Input.Search
          placeholder="Search products..."
          allowClear
          onSearch={(value) => {
            setSearch(value);
            setPage(1);
          }}
          style={{ width: 300 }}
        />

        <Button type="primary" onClick={openCreate}>
          + Add Product
        </Button>
      </Space>

      <Table<Product>
        loading={isLoading}
        columns={columns}
        dataSource={data?.data}
        rowKey="id"
        pagination={{
          current: page,
          total: data?.total,
          pageSize: 5,
          onChange: (p) => setPage(p),
        }}
      />

      <Drawer
        width={400}
        title={editing ? "Edit Product" : "Create Product"}
        open={isDrawerOpen}
        onClose={() => setDrawerOpen(false)}
      >
        <ProductForm
          initialValues={editing || undefined}
          submitText={editing ? "Update Product" : "Create Product"}
          onSubmit={(values) => {
            if (editing) {
              updateProduct.mutate({ id: editing.id, ...values });
            } else {
              createProduct.mutate(values);
            }
            setDrawerOpen(false);
          }}
        />
      </Drawer>
    </div>
  );
};

export default Products;
