import * as dns from 'dns';
import slugify from 'slugify';

export const gen6digitOTP = () => {
  return Math.floor(100000 + Math.random() * 900000);
};

export const slugifyString = (str: string) => {
  const slug = slugify(str, {
    replacement: '-',
    remove: undefined,
    lower: true,
  });

  return slug;
};

export const getPaddedCode = (val: number) => {
  return val.toString().padStart(8, '0');
};

export const asyncForEach = async (array: any[], callback: any) => {
  if (!Array.isArray(array)) {
    throw Error('Expected an array!');
  }

  for (let index = 0; index < array.length; index++) {
    await callback(array[index], index, array);
  }
};

export const groupItemBy = (array, property): any => {
  const groupedData = {},
    props = property.split('.');

  for (let i = 0; i < array.length; i++) {
    const key = props.reduce((acc, prop) => {
      return acc && acc[prop];
    }, array[i]);

    if (!groupedData[key]) groupedData[key] = [];
    groupedData[key].push(array[i]);
  }

  return groupedData;
};

export const getMinValueContainedItem = <T>(array: T[], prop: string): T => {
  return (
    (array.length &&
      array.reduce((prev: T, curr: T) => {
        return prev[prop] < curr[prop] ? prev : curr;
      })) ||
    null
  );
};

export const getMaxValueContainedItem = <T>(array: T[], prop: string): T => {
  return (
    (array.length &&
      array.reduce((prev: T, curr: T) => {
        return prev[prop] > curr[prop] ? prev : curr;
      })) ||
    null
  );
};

export const getPaginationData = (payload: { page: number; limit: number }) => {
  let { page, limit } = payload;

  page = page || 1;
  limit = limit || 10;
  const skip = (page - 1) * limit;

  return { skip, limit, page };
};

export const sleep = (milliseconds) => {
  // eslint-disable-next-line no-undef
  return new Promise((resolve) => setTimeout(resolve, milliseconds));
};

export function getDiffPercentage(min: number, max: number) {
  return Number(100 * Math.abs((max - min) / ((max + min) / 2))).toFixed(0);
}

export const removeDuplicateFromArray = <T>(data: T[], property: string): T[] => {
  return data.filter(
    (val: T, index: number, arr: T[]) => arr.findIndex((val2) => val2[property] === val[property]) === index
  );
};

export const isEmpty = (value: any): boolean => {
  return (
    value === null ||
    value === undefined ||
    value === '' ||
    (Array.isArray(value) && value.length === 0) ||
    (typeof value === 'object' && Object.keys(value).length === 0)
  );
};

export const isNotEmpty = (value: any): boolean => {
  return (
    value !== null &&
    value !== undefined &&
    value !== '' &&
    !(Array.isArray(value) && value.length === 0) &&
    !(typeof value === 'object' && Object.keys(value).length === 0)
  );
};

export const generateKey = (length: number, type?: 'lower' | 'upper' | 'numeric' | 'key'): string => {
  let result = '';
  const characters =
    type === 'lower'
      ? 'abcdefghijklmnopqrstuvwxyz'
      : type === 'upper'
        ? 'ABCDEFGHIJKLMNOPQRSTUVWXYZ'
        : type === 'numeric'
          ? '0123456789'
          : type === 'key'
            ? 'abcdefghijklmnopqrstuvwxyz0123456789'
            : 'abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
  const charactersLength = characters.length;

  for (let i = 0; i < length; i++) result += characters.charAt(Math.floor(Math.random() * charactersLength));

  return result;
};

export const truncateNumber = (value: number, scale = 2) => {
  const factor = Math.pow(10, scale);
  return Math.floor(value * factor) / factor;
};

export const isConnectedToInternet = async (): Promise<boolean> => {
  return new Promise((resolve) => {
    dns.lookup('google.com', (err) => resolve(!err));
  });
};
