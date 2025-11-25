import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";

import { Product } from "../types/Product";
import axios from "axios";

const API = "http://localhost:4000/products";

interface ProductsResponse {
  data: Product[];
  total: number;
}

export function useProducts({
  page,
  search,
}: {
  page: number;
  search: string;
}) {
  return useQuery<ProductsResponse>({
    queryKey: ["products", page, search],
    queryFn: async () => {
      const res = await axios.get<Product[]>(API, {
        params: {
          _page: page,
          _limit: 10,
          q: search || "",
        },
      });

      return {
        data: res.data,
        total: Number(res.headers["x-total-count"]),
      };
    },
    // keepPreviousData: true,
  });
}

export function useCreateProduct() {
  //This gives you access to React Query’s cache manager.React Query uses an in-memory cache to store server data (like products list).

  // qc.invalidateQueries(["products"]) tells React Query:“The products list is outdated — refetch it.”
  const qc = useQueryClient();

  return useMutation({
    mutationFn: (product: Omit<Product, "id" | "createdAt">) =>
      axios.post(API, {
        ...product,
        createdAt: new Date().toISOString(),
      }),
    onSuccess: () => qc.invalidateQueries({ queryKey: ["products"] }),
  });
}

export function useUpdateProduct() {
  const qc = useQueryClient();

  return useMutation({
    mutationFn: ({ id, ...body }: Partial<Product> & { id: number }) =>
      axios.put(`${API}/${id}`, body),
    onSuccess: () => qc.invalidateQueries({ queryKey: ["products"] }),
  });
}

export function useDeleteProduct() {
  const qc = useQueryClient();

  return useMutation({
    mutationFn: (id: number) => axios.delete(`${API}/${id}`),
    onSuccess: () => qc.invalidateQueries({ queryKey: ["products"] }),
  });
}
