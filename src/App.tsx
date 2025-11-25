import React from "react";
import Sidebar from "./components/Sidebar";
import { LaptopOutlined, UserOutlined } from "@ant-design/icons";
import type { MenuProps } from "antd";
import { BrowserRouter, Route, Routes } from "react-router";
import Dashboard from "./pages/Dashboard";
import Users from "./pages/Users";
import Products from "./pages/Products";

const items1: MenuProps["items"] = ["1", "2", "3"].map((key) => ({
  key,
  label: `nav ${key}`,
}));

const items3: MenuProps["items"] = [
  { name: "Dashboard", icon: LaptopOutlined, path: "/dashboard" },
  { name: "Users", icon: UserOutlined, path: "/users" },
  { name: "Products", icon: UserOutlined, path: "/products" },
  { name: "Orders", icon: UserOutlined, path: "/orders" },
].map((key) => {
  console.log(key.name, key.icon);
  return {
    key: `${key.path}`,
    label: `${key.name}`,
    icon: React.createElement(key.icon),
  };
});

const App: React.FC = () => {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Sidebar items1={items1} items2={items3} />}>
          <Route path="/dashboard" element={<Dashboard />}></Route>
          <Route path="/users" element={<Users />}></Route>
          <Route path="/products" element={<Products />}></Route>
        </Route>
      </Routes>
    </BrowserRouter>
  );
};

export default App;
