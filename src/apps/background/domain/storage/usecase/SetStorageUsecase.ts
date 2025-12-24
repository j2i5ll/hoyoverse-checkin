import type { Usecase } from '@background/common/usecase';
import { SetStorageInput, SetStorageOutput  } from '@background/domain/storage/port/SetStoragePort';
export interface SetStorageUsecase
  extends Usecase<SetStorageInput, Promise<SetStorageOutput >> {}
