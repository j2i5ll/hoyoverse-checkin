import type { Usecase } from '@background/common/usecase';
import type {
  GetScrapTargetInput,
  GetScrapTargetOutput,
} from '@background/domain/scrap/port/GetScrapTargetPort';

export interface GetScrapTargetUsecase
  extends Usecase<GetScrapTargetInput, Promise<GetScrapTargetOutput>> {}
