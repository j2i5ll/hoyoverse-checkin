export enum ApiRetCode {
  Success = 0,
  AlreadyCheckIn = -5003,
  NoCharacter = -10002,
  AuthExpired = -100,
  NotLoggedIn = 10001,
  NeedCaptcha = 5001,
  DataIsNotPublic = 10102,
  ServerMaintenance = 10307,
}

export const ErrorMessageKey: Record<ApiRetCode, string> = {
  [ApiRetCode.NoCharacter]: 'common.no_character',
  [ApiRetCode.NeedCaptcha]: 'common.need_captcha',
  [ApiRetCode.AuthExpired]: '',
  [ApiRetCode.NotLoggedIn]: '',
  [ApiRetCode.Success]: '',
  [ApiRetCode.AlreadyCheckIn]: '',
  [ApiRetCode.DataIsNotPublic]: '',
  [ApiRetCode.ServerMaintenance]: '',
};
