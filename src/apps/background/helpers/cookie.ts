import { GetCookieOutput } from '@background/domain/cookie/port/GetCookiePort';
import { REQUIRE_COOKIES } from '@src/shared/constants/cookies';

const COOKIE_NAME_MAP: Record<string, keyof GetCookieOutput> = {
  ltoken_v2: 'ltoken',
  ltuid_v2: 'ltuid',
};
export async function getLoginCookie() {
  const cookies = await chrome.cookies.getAll({ domain: '.hoyolab.com' });
  const loginCookies = cookies.filter((cookie) =>
    REQUIRE_COOKIES.includes(cookie.name),
  );
  const loginCookieObj = loginCookies.reduce((cookieObj, cookie) => {
    cookieObj[COOKIE_NAME_MAP[cookie.name]] = cookie.value;
    return cookieObj;
  }, {} as GetCookieOutput);
  return loginCookieObj as GetCookieOutput;
}
