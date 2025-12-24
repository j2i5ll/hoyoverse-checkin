import type { Usecase } from '@background/common/usecase';
import type {
  GetAccountStatusInput,
  GetAccountStatusOutput,
} from '@background/domain/account/port/GetAccountStatusPort';

export interface GetAccountStatusUsecase
  extends Usecase<GetAccountStatusInput, Promise<GetAccountStatusOutput>> {}
