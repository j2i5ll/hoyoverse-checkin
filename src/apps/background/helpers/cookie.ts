import { GetCookieOutput } from '@background/domain/cookie/port/GetCookiePort';
import { REQUIRE_COOKIES } from '@src/shared/constants/cookies';

const COOKIE_NAME_MAP: Record<string, keyof GetCookieOutput> = {
  ltoken_v2: 'ltoken',
  ltuid_v2: 'ltuid',
};
const COOKIE_DOMAINS = ['.hoyolab.com', '.hoyoverse.com'];

export async function clearLoginCookie(): Promise<void> {
  const cookies = (
    await Promise.all(
      COOKIE_DOMAINS.map((domain) => chrome.cookies.getAll({ domain })),
    )
  ).flat();

  await Promise.all(
    cookies.map((cookie) => {
      const protocol = cookie.secure ? 'https' : 'http';
      const domain = cookie.domain.replace(/^\./, '');
      const url = `${protocol}://${domain}${cookie.path}`;
      return chrome.cookies.remove({ url, name: cookie.name });
    }),
  );
}

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
