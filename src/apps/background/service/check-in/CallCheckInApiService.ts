import type { CallCheckInApiUsecase } from '@background/domain/check-in/usecase/CallCheckInApiUsecase';
import type {
  CallCheckInApiOutput,
  CallCheckInApiInput,
} from '@background/domain/check-in/port/CallCheckInApiPort';
import { ApiRetCode } from '@src/shared/constants/api-ret-code';
import { httpWithCookie } from '@src/shared/utils/http';
import { getUrlLocale } from '@src/shared/utils/url';
import { ErrorMessageKey } from '@src/shared/constants/api-ret-code';
import { i18n } from '@background/i18n';
import { injectable } from 'tsyringe';
import { captureApiException } from '@src/shared/utils/sentry';
import { GameActId, GameKey } from '@src/shared/constants/game';
import { CheckInError } from '@src/shared/error';
import { ga } from '@src/shared/ga';

type ICheckInAPIResponse = {
  retcode: number;
  message: string;
  data: {
    code: string;
    first_bind: boolean;
    gt_result: {
      risk_code: number;
      gt: string;
      challenge: string;
      success: number;
      is_risk: boolean;
    };
  };
};

@injectable()
export class CallCheckInApiService implements CallCheckInApiUsecase {
  async execute(
    checkInTargetList: CallCheckInApiInput,
  ): Promise<CallCheckInApiOutput[]> {
    const checkInResultList = [];
    for (const checkInTarget of checkInTargetList) {
      const { actId, checkInAPIUrl, ltoken, ltuid } = checkInTarget;
      const headers = {};
      if (actId === GameActId[GameKey.ZZZ]) {
        headers['x-rpc-signgame'] = 'zzz';
      }

      const url = `${checkInAPIUrl}?lang=${getUrlLocale()}`;
      const resp = await httpWithCookie(
        url,
        {
          credentials: 'include',
          method: 'POST',
          body: JSON.stringify({ act_id: actId }),
          headers,
        },
        { ltoken, ltuid },
      );
      const { retcode, message } = resp;
      switch (retcode) {
        case ApiRetCode.Success:
          ga.fireEvent('체크인성공', { act_id: actId });
          checkInResultList.push(this.successResponse(resp, actId, ltuid));
          break;
        case ApiRetCode.AlreadyCheckIn:
          ga.fireEvent('이미체크인완료', { act_id: actId });
          checkInResultList.push(this.successResponse(resp, actId, ltuid));
          break;
        default: {
          captureApiException(new CheckInError(`${retcode}: ${message}`), url);
          const errorMsgKey = ErrorMessageKey[retcode as ApiRetCode];
          let msg = errorMsgKey ? i18n.t(errorMsgKey) : message;
          if (
            retcode === ApiRetCode.AuthExpired ||
            retcode === ApiRetCode.NotLoggedIn
          ) {
            msg = `${msg}\n${i18n.t('common.re_register_account')}`;
          }
          checkInResultList.push({
            actId,
            ltuid,
            retCode: retcode,
            lastCheckInMessage: msg,
          });
          break;
        }
      }
    }
    return checkInResultList;
  }

  private successResponse(
    resp: ICheckInAPIResponse,
    actId = '',
    ltuid: string,
  ) {
    const { data } = resp;
    if (data?.gt_result?.risk_code === ApiRetCode.NeedCaptcha) {
      return {
        actId,
        ltuid,
        retCode: ApiRetCode.NeedCaptcha,
        lastCheckInMessage: i18n.t(ErrorMessageKey[ApiRetCode.NeedCaptcha]),
      };
    }
    return {
      actId,
      ltuid,
      retCode: ApiRetCode.Success,
      lastCheckInMessage: undefined,
    };
  }
}
