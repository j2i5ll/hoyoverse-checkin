import type { Usecase } from '@background/common/usecase';
import type {
  AddAccountInput,
  AddAccountOutput,
} from '@background/domain/account/port/AddAccountPort';

export interface AddAccountUsecase
  extends Usecase<AddAccountInput, Promise<AddAccountOutput>> {}
