import { useCallback } from 'react';
import moment from 'moment';

type FieldValue = any;

type DataItem = {
  [key: string]: FieldValue;
};

type HeadersWithFields = [string, string[]][];

const NA = 'N/A';

const formatValue = (value: FieldValue) => {
  if (value === null || value === undefined) return NA;

  if (moment(value, moment.ISO_8601, true).isValid()) {
    return moment(value).format('YYYY-MM-DD HH:mm:ss');
  }

  if (typeof value === 'boolean') {
    return value ? 'Aktiv' : 'Inaktiv';
  }

  if (typeof value === 'number') {
    return value.toString();
  }

  return value.toString() || NA;
};

const useDownloadCSV = <T extends DataItem>(data: T[], headersWithFields: HeadersWithFields) => {
  const handleDownload = useCallback(() => {
    const headers = headersWithFields.map(([headerName]) => headerName);
    const rows = data.map((item: T) =>
      headersWithFields.map(
        ([_, fieldNames]) =>
          fieldNames
            .map((fieldName) => {
              const value = fieldName
                .split('.')
                .reduce((acc, part) => (acc ? acc[part] : ''), item);
              return formatValue(value);
            })
            .join(' '), // объединяем значения полей в одну строку
      ),
    );

    const csvContent = [headers.join(','), ...rows.map((row: any[]) => row.join(','))].join('\n');

    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);

    const link = document.createElement('a');
    link.href = url;
    link.setAttribute('download', 'Data.csv');
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  }, [data, headersWithFields]);

  return handleDownload;
};

export default useDownloadCSV;
