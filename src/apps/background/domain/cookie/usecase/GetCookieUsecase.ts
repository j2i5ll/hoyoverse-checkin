import type { Usecase } from '@background/common/usecase';
import type { GetCookieOutput } from '@background/domain/cookie/port/GetCookiePort';
export interface GetCookieUsecase
  extends Usecase<void, Promise<GetCookieOutput>> {}
