import {
  GetAvatarResponse,
  GetContactsResponse,
  GetStateInstanceResponse,
  GetWaSettingsResponse,
  RequestParams,
} from 'common';
import { baseAPI } from 'services/api-service';

export const endpoints = baseAPI.injectEndpoints({
  endpoints: (builder) => ({
    getStateInstance: builder.query<GetStateInstanceResponse, RequestParams>({
      query: ({ idInstance, apiTokenInstance, apiUrl }) => ({
        url: `${apiUrl}/waInstance${idInstance}/getStateInstance/${apiTokenInstance}`,
      }),
    }),
    getContacts: builder.query<GetContactsResponse, RequestParams>({
      query: ({ idInstance, apiTokenInstance, apiUrl }) => ({
        url: `${apiUrl}/waInstance${idInstance}/getContacts/${apiTokenInstance}`,
      }),
    }),
    getWaSettings: builder.query<GetWaSettingsResponse, RequestParams>({
      query: ({ idInstance, apiTokenInstance, apiUrl }) => ({
        url: `${apiUrl}/waInstance${idInstance}/getWaSettings/${apiTokenInstance}`,
      }),
    }),
    /**
     * The peer's photo. Asked per chat, so it is cached by chatId: a contact scrolled past
     * twice is fetched once, and the answer is reused by the call screen.
     *
     * A peer with no photo, or one who hides it, answers `available: false` — that is the
     * ordinary case, not an error, and the caller falls back to initials.
     */
    getAvatar: builder.query<GetAvatarResponse, RequestParams & { chatId: string }>({
      query: ({ idInstance, apiTokenInstance, apiUrl, chatId }) => ({
        url: `${apiUrl}/waInstance${idInstance}/getAvatar/${apiTokenInstance}`,
        method: 'POST',
        body: { chatId },
      }),
    }),
  }),
});

export const {
  useGetContactsQuery,
  useLazyGetStateInstanceQuery,
  useGetWaSettingsQuery,
  useGetAvatarQuery,
} = endpoints;
