import { GetStorageInput } from '@background/domain/storage/port/GetStoragePort';
import { GetStorageUsecase } from '@background/domain/storage/usecase/GetStorageUsecase';
import { injectable } from 'tsyringe';

@injectable()
export class GetStorageService implements GetStorageUsecase{
  async execute({area, key}: GetStorageInput) {
    const value = await chrome.storage[area].get(key);
    return {value}
  }
}
