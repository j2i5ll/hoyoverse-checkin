export enum ApiRetCode {
  Success = 0,
  AlreadyCheckIn = -5003,
  NoCharacter = -10002,
  NeedCaptcha = 5001,
  DataIsNotPublic = 10102,
}

export const ErrorMessageKey: Record<ApiRetCode, string> = {
  [ApiRetCode.NoCharacter]: 'common.no_character',
  [ApiRetCode.NeedCaptcha]: 'common.need_captcha',
  [ApiRetCode.Success]: '',
  [ApiRetCode.AlreadyCheckIn]: '',
  [ApiRetCode.DataIsNotPublic]: '',
};
