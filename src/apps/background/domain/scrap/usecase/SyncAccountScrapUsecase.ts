import type { Usecase } from '@background/common/usecase';
import type {
  SyncAccountScrapInput,
  SyncAccountScrapOutput,
} from '../port/SyncAccountScrapPort';

export interface SyncAccountScrapUsecase
  extends Usecase<SyncAccountScrapInput, Promise<SyncAccountScrapOutput>> {}
