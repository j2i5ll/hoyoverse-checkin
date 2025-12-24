import type { Usecase } from '@background/common/usecase';
import type {
  CallCheckInApiOutput,
  CallCheckInApiInput,
} from '@background/domain/check-in/port/CallCheckInApiPort';

export interface CallCheckInApiUsecase
  extends Usecase<CallCheckInApiInput, Promise<CallCheckInApiOutput[]>> {}
