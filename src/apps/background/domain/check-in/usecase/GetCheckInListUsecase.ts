import type { Usecase } from '@background/common/usecase';
import type { GetCheckInListOutput } from '@background/domain/check-in/port/GetCheckInListPort';

export interface GetCheckInListUsecase
  extends Usecase<void, Promise<GetCheckInListOutput[]>> {}
