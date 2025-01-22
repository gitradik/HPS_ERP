import { fetchBaseQuery } from "@reduxjs/toolkit/query";
import { createApi } from '@reduxjs/toolkit/query/react';
import { UploadPhotoResponse } from "src/types/uploads/uploads";

const apiHost = import.meta.env.VITE_API_HOST;

export const uploadApi = createApi({
  reducerPath: 'uploadApi',
  baseQuery: fetchBaseQuery({
    baseUrl: apiHost,
    credentials: 'include',
    prepareHeaders: (headers: Headers, { getState }) => {
      const { auth }: any = getState();
      const token = auth.accessToken;
      if (token) headers.set('Authorization', token);
      return headers;
    },
  }),
  endpoints: (builder) => ({
    uploadPhoto: builder.mutation<UploadPhotoResponse, File>({
      query: (file) => {
        const formData = new FormData();
        formData.append('recfile', file);

        return {
          url: 'user/upload-photo',
          method: 'POST',
          body: formData,
        };
      },
    }),
    uploadPhotoById: builder.mutation<UploadPhotoResponse, { id: string; file: File }>({
      query: ({ id, file }) => {
        const formData = new FormData();
        formData.append('recfile', file);

        return {
          url: `user/upload-photo/${id}`,
          method: 'POST',
          body: formData,
        };
      },
    }),
  }),
});

export const { useUploadPhotoMutation, useUploadPhotoByIdMutation } = uploadApi;