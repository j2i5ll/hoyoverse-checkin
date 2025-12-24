import { SetStorageInput } from '@background/domain/storage/port/SetStoragePort';
import { injectable } from 'tsyringe';

@injectable()
export class SetStorageService implements SetStorageService{
  async execute({area, key, value}: SetStorageInput) {
    await chrome.storage[area].set({ [key]: value});
  }
}
