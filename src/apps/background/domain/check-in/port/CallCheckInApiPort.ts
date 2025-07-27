import type { ApiRetCode } from '@src/shared/constants/api-ret-code';
import { CheckInTargetType } from '@src/types';

export interface CallCheckInApiOutput {
  ltuid: string;
  actId: string;
  retCode: ApiRetCode;
  lastCheckInMessage: string;
}
export type CallCheckInApiInput = CheckInTargetType[];
