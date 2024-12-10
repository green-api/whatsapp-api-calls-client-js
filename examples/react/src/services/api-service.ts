import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';

const baseQuery = fetchBaseQuery({
  baseUrl: '',
});

export const baseAPI = createApi({
  baseQuery,
  endpoints: () => ({}),
});
