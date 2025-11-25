import {
  Button,
  Flex,
  Form,
  Input,
  Modal,
  Popconfirm,
  Space,
  Spin,
  Table,
  message,
} from "antd";
import { useEffect, useState } from "react";
import { LoadingOutlined } from "@ant-design/icons";

interface User {
  id: number;
  name: string;
  email: string;
  role: string;
  createdAt: string;
}

const Users = () => {
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingUser, setEditingUser] = useState<User | null>(null);
  const [form] = Form.useForm();

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const res = await fetch("http://localhost:4000/users");
        if (!res.ok) {
          throw new Error("failed to fetch users");
        }
        const data: User[] = await res.json();
        setUsers(data);
      } catch (error) {
        message.error("Failed to load errors");
      } finally {
        setLoading(false);
      }
    };
    fetchUsers();
  }, []);

  const handleSubmit = async () => {
    try {
      const values = await form.validateFields();
      if (editingUser) {
        const res = await fetch(
          `http://localhost:4000/users/${editingUser.id}`,
          {
            method: "PUT",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ ...editingUser, ...values }),
          }
        );

        if (!res.ok) {
          throw new Error("Errr: could not edit user");
        }
        message.success("User updated successfully");
      } else {
        const res = await fetch(`http://localhost:4000/users`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(values),
        });

        if (!res.ok) {
          throw new Error("Errr: could not edit user");
        }
        message.success("User updated successfully");
      }
      setIsModalOpen(false);
      form.resetFields();
      setEditingUser(null);
    } catch {
      message.error("Failed to save user");
    } finally {
    }
  };

  // Delete user
  const handleDelete = async (id: number) => {
    try {
      const res = await fetch(`http://localhost:4000/users/${id}`, {
        method: "DELETE",
      });
      if (!res.ok) throw new Error();
      message.success("User deleted successfully");
    } catch {
      message.error("Failed to delete user");
    }
  };

  const columns = [
    {
      title: "Name",
      dataIndex: "name",
      key: "name",
    },
    {
      title: "Email",
      dataIndex: "email",
      key: "email",
    },
    {
      title: "Role",
      dataIndex: "role",
      key: "role",
    },
    {
      title: "Actions",
      key: "actions",
      render: (_: any, record: User) => (
        <Space>
          <Button
            type="link"
            onClick={() => {
              setEditingUser(record);
              form.setFieldsValue(record);
              setIsModalOpen(true);
            }}
          >
            Edit
          </Button>
          <Popconfirm
            title="Delete user?"
            onConfirm={() => handleDelete(record.id)}
          >
            <Button type="link" danger>
              Delete
            </Button>
          </Popconfirm>
        </Space>
      ),
    },
  ];

  if (loading) {
    return (
      <Spin
        style={{ display: "block", margin: "50px auto" }}
        size="large"
        indicator={<LoadingOutlined spin />}
      />
    );
  }

  return (
    <div>
      <h2 style={{ marginBottom: 16 }}>Users</h2>

      <Button
        type="primary"
        style={{ marginBottom: 16 }}
        onClick={() => {
          setEditingUser(null);
          form.resetFields();
          setIsModalOpen(true);
        }}
      >
        Add User
      </Button>

      <Table
        rowKey="id"
        columns={columns}
        dataSource={users}
        pagination={{ pageSize: 5 }}
      />

      <Modal
        title={editingUser ? "Edit User" : "Add User"}
        open={isModalOpen}
        onCancel={() => setIsModalOpen(false)}
        onOk={handleSubmit}
        okText="Save"
      >
        <Form form={form} layout="vertical">
          <Form.Item
            label="Name"
            name="name"
            rules={[{ required: true, message: "Please enter name" }]}
          >
            <Input />
          </Form.Item>
          <Form.Item
            label="Email"
            name="email"
            rules={[{ required: true, message: "Please enter email" }]}
          >
            <Input />
          </Form.Item>
          <Form.Item
            label="Role"
            name="role"
            rules={[{ required: true, message: "Please enter role" }]}
          >
            <Input />
          </Form.Item>
        </Form>
      </Modal>
    </div>
  );
};

export default Users;
