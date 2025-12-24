import { StorageAreaType } from '@src/types';

export type SetStorageOutput = void
export type SetStorageInput = {
  area: StorageAreaType;
  key: string;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  value: any;
}