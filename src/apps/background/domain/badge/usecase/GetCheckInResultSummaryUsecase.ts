import type { Usecase } from '@background/common/usecase';
import type { GetCheckInResultSummaryOutput } from '@background/domain/badge/port/GetCheckInResultSummaryPort';

export interface GetCheckInResultSummaryUsecase
  extends Usecase<void, Promise<GetCheckInResultSummaryOutput>> {}
