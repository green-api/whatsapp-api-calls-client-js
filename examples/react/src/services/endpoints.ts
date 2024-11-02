import {
  GetContactsResponse,
  GetStateInstanceResponse,
  GetWaSettingsResponse,
  RequestParams,
} from 'common';
import { baseAPI } from 'services/api-service';

export const endpoints = baseAPI.injectEndpoints({
  endpoints: (builder) => ({
    getStateInstance: builder.query<GetStateInstanceResponse, RequestParams>({
      query: ({ idInstance, apiTokenInstance }) => ({
        url: `waInstance${idInstance}/getStateInstance/${apiTokenInstance}`,
      }),
    }),
    getContacts: builder.query<GetContactsResponse, RequestParams>({
      query: ({ idInstance, apiTokenInstance }) => ({
        url: `waInstance${idInstance}/getContacts/${apiTokenInstance}`,
      }),
    }),
    getWaSettings: builder.query<GetWaSettingsResponse, RequestParams>({
      query: ({ idInstance, apiTokenInstance }) => ({
        url: `waInstance${idInstance}/getWaSettings/${apiTokenInstance}`,
      }),
    }),
  }),
});

export const { useGetContactsQuery, useLazyGetStateInstanceQuery, useGetWaSettingsQuery } =
  endpoints;
