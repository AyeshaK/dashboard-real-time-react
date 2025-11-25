import { useQuery } from "@tanstack/react-query";

const API = "http://localhost:4000";
//from db directly
export function useDashboardMetrics() {
  return useQuery({
    queryKey: ["dashboard-metrics"],
    queryFn: async () => {
      const res = await fetch("http://localhost:4000/metrics");
      if (!res.ok) throw new Error("Failed to load metrics");
      return res.json();
    },
  });
}

export function useDashboardMetricsComputed() {
  return useQuery({
    queryKey: ["dashboard-metrics-computed"],
    queryFn: async () => {
      const [productsRes, ordersRes, usersRes] = await Promise.all([
        fetch(`${API}/products`),
        fetch(`${API}/orders`),
        fetch(`${API}/users`),
      ]);

      const products = await productsRes.json();
      const orders = await ordersRes.json();
      const users = await usersRes.json();

      return computeMetrics({ products, orders, users });
    },
  });
}

export function computeMetrics({ products, orders, users }: any) {
  const totalRevenue = orders.reduce(
    (sum: number, o: any) => sum + o.amount,
    0
  );

  // 2️⃣ Total Orders
  const totalOrders = orders.length;

  // 3️⃣ Active Users (lastActive within 7 days)
  //   const activeUsers = users.filter((u: any) => {
  //     // const diff =
  //     //   (Date.now() - new Date(u.lastActive).getTime()) / (1000 * 3600 * 24);
  //     // return diff <= 7;
  //   }).length;

  const activeUsers = users.length;

  // 4️⃣ Revenue by month
  const revenueByMonthMap: Record<string, number> = {};

  orders.forEach((order: any) => {
    const month = new Date(order.createdAt).toLocaleString("default", {
      month: "short",
    });

    revenueByMonthMap[month] = (revenueByMonthMap[month] || 0) + order.amount;
  });

  const salesTrend = Object.entries(revenueByMonthMap).map(
    ([month, value]) => ({
      month,
      value,
    })
  );

  // 3️⃣ Orders by Status
  const statusMap: Record<string, number> = {};
  orders.forEach((o) => {
    statusMap[o.status] = (statusMap[o.status] || 0) + 1;
  });

  const ordersByStatus = Object.entries(statusMap).map(([status, value]) => ({
    status,
    value,
  }));

  // Top products
  const topProducts = calculateTopProducts(orders, products);

  // 5️⃣ Daily Orders (Mon, Tue, Wed, etc.)
  const dayMap: Record<string, number> = {};

  orders.forEach((o) => {
    const day = new Date(o.createdAt).toLocaleString("default", {
      weekday: "short",
    });

    dayMap[day] = (dayMap[day] || 0) + 1;
  });

  const dailyOrders = Object.entries(dayMap).map(([day, value]) => ({
    day,
    value,
  }));

  // 6️⃣ Category-wise sales
  const salesByCategory = calculateSalesByCategory(orders, products);
  console.log("salebycategory", salesByCategory);

  return {
    totalRevenue,
    totalOrders,
    activeUsers,
    salesTrend,
    ordersByStatus,
    topProducts,
    dailyOrders,
    salesByCategory,
  };
}

export function calculateSalesByCategory(orders: any[], products: any[]) {
  if (!orders.length || !products.length) return [];

  const categoryMap: Record<string, number> = {};

  orders.forEach((order) => {
    order.products.forEach((item: any) => {
      const product = products.find((p) => p.id === item.productId);
      console.log(product, "test");
      if (!product) return;

      const category = product.category;

      // quantity × product price
      const sales = item.quantity * product.price;

      categoryMap[category] = (categoryMap[category] || 0) + sales;
    });
  });

  return Object.entries(categoryMap).map(([category, sales]) => ({
    category,
    sales,
  }));
}

export function calculateTopProducts(orders: any[], products: any[]) {
  if (!orders.length || !products.length) return [];

  const productSalesMap: Record<number, number> = {};

  // Count units sold
  orders.forEach((order) => {
    order.products.forEach((item: any) => {
      productSalesMap[item.productId] =
        (productSalesMap[item.productId] || 0) + item.quantity;
    });
  });

  // Convert to array with product names
  const topProducts = Object.entries(productSalesMap).map(
    ([productId, sales]) => {
      const product = products.find((p) => p.id === Number(productId));
      return {
        product: product ? product.name : `Product ${productId}`,
        sales,
      };
    }
  );

  // Sort: highest sales first
  return topProducts.sort((a, b) => b.sales - a.sales);
}
