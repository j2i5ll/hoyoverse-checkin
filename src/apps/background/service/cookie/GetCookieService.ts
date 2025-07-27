import type { GetCookieUsecase } from '@background/domain/cookie/usecase/GetCookieUsecase';
import { injectable } from 'tsyringe';
import { getLoginCookie } from '@background/helpers/cookie';

@injectable()
export class GetCookieService implements GetCookieUsecase {
  async execute() {
    return await getLoginCookie();
  }
}
