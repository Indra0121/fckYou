import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";

// Access environment variable directly using import.meta.env
const baseUrl = process.env.REACT_APP_API_URL;
export const api = createApi({
  baseQuery: fetchBaseQuery({ baseUrl }),
  reducerPath: "adminApi",
  tagTypes: ["Admin", "Products", "Clients"], // corrected typo here
  endpoints: (build) => ({
    getAdmin: build.query({
      query: (id) => `admin/admins/${id}`,
      providesTags: ["Admin"],
    }),
    getAdmins: build.query({
      query: (id) => `admin/admins/`,
      providesTags: ["Admin"],
    }),
    getProducts: build.query({
      query: () => `product/products`,
      providesTags: ["Products"],
    }),
    getClients: build.query({
      query: () => `client/clients`,
      providesTags: ["Clients"],
    }),
  }),
});

export const {
  useGetAdminQuery,
  useGetProductsQuery,
  useGetClientsQuery,
  useGetAdminsQuery,
} = api; // Include useGetProductsQuery hook

// Add a function to refetch products
export const refetchProducts = () => {
  api.endpoints.getProducts.query(); // Trigger the query to refetch products
};
