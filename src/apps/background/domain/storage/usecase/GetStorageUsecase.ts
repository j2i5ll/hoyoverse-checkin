import type { Usecase } from '@background/common/usecase';
import { GetStorageInput, GetStorageOutput } from '@background/domain/storage/port/GetStoragePort';
export interface GetStorageUsecase
  extends Usecase<GetStorageInput, Promise<GetStorageOutput>> {}
