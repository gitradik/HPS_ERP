import { graphqlRequestBaseQuery } from '@rtk-query/graphql-request-base-query';
import { BaseQueryFn } from '@reduxjs/toolkit/query';
import { FetchBaseQueryError } from '@reduxjs/toolkit/query/react';
import { ACCESS_TOKEN } from './auth.api';

const apiHost = process.env.VITE_API_HOST;

type ExtendedFetchBaseQueryError = FetchBaseQueryError & {
    message?: string;
};

const extractDetailedError = (error: ExtendedFetchBaseQueryError | undefined): string => {
    if (error?.message) {
      const regex = /"message"\s*:\s*"(.*?)"/;
      const match = error.message.match(regex);
      if (match && match[1]) {
        return match[1]; // Возвращаем только содержимое ключа "message"
      }
    }
    return 'An unexpected error occurred.';
  };
  

const baseQueryWithMiddleware: BaseQueryFn<any, unknown, FetchBaseQueryError> = graphqlRequestBaseQuery({
  url: apiHost,
  prepareHeaders: (headers) => {
    const token = localStorage.getItem(ACCESS_TOKEN);
    if (token) headers.set('Authorization', token)
    return headers;
  },
});

export const enhancedBaseQuery: BaseQueryFn<any, unknown, FetchBaseQueryError> = async (
  args,
  api,
  extraOptions
) => {
  const result = await baseQueryWithMiddleware(args, api, extraOptions);

  if (result.error) {
    result.error.data = {
        // @ts-ignore
      ...result.error.data,
      friendlyMessage: extractDetailedError(result.error),
    };
  }

  return result;
};
