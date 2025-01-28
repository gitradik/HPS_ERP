import { graphqlRequestBaseQuery } from '@rtk-query/graphql-request-base-query';
import { BaseQueryFn } from '@reduxjs/toolkit/query';
import { FetchBaseQueryError } from '@reduxjs/toolkit/query/react';
import { ACCESS_TOKEN } from './authApi';

const apiHost = import.meta.env.VITE_API_HOST_GQL;

type ExtendedFetchBaseQueryError = FetchBaseQueryError & {
  message?: string;
  data?: any;
};

type MetaResponse = {
  response?: {
    errors: Array<{
      extensions: any;
    }>;
  };
};

const extractDetailedError = (error: ExtendedFetchBaseQueryError | undefined): string => {
  if (error?.message) {
    const regex = /"message"\s*:\s*"(.*?)"/;
    const match = error.message.match(regex);
    if (match && match[1]) {
      return match[1];
    }
  }
  return 'Ein unerwarteter Fehler ist aufgetreten.';
};

const addFriendlyMessage = (extendedError: ExtendedFetchBaseQueryError) => {
  if ('message' in extendedError) {
    extendedError.data = {
      ...(extendedError.data || {}),
      friendlyMessage: extractDetailedError(extendedError),
    };
  }
};

const addExtensionDetails = (extendedError: ExtendedFetchBaseQueryError, meta: MetaResponse) => {
  if (meta?.response?.errors?.[0]?.extensions) {
    extendedError.data = {
      ...(extendedError.data || {}),
      extensionDetails: meta.response.errors[0].extensions,
    };
  }
};

const baseQueryWithMiddleware: BaseQueryFn<any, unknown, FetchBaseQueryError> =
  graphqlRequestBaseQuery({
    url: apiHost,
    prepareHeaders: (headers: Headers) => {
      const token = localStorage.getItem(ACCESS_TOKEN);
      if (token) headers.set('Authorization', token);
      return headers;
    },
  });

export const enhancedBaseQuery: BaseQueryFn<any, unknown, ExtendedFetchBaseQueryError> = async (
  args,
  api,
  extraOptions,
) => {
  // Если файл не передается, продолжаем обычную работу
  const result = await baseQueryWithMiddleware(args, api, extraOptions);

  if (result.error) {
    const extendedError = result.error as ExtendedFetchBaseQueryError;

    // Добавляем friendlyMessage
    addFriendlyMessage(extendedError);

    // Обрабатываем информацию из extensions
    const meta = result.meta as MetaResponse; // Уточняем тип
    if (meta && meta.response) {
      addExtensionDetails(extendedError, meta);
    }

    // Возвращаем результат с расширенной ошибкой
    return { ...result, error: extendedError };
  }

  return result;
};
