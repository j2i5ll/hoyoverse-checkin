import { StorageAreaType } from '@src/types';

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export type GetStorageOutput = { value: any}
export type GetStorageInput = { area: StorageAreaType, key: string;}