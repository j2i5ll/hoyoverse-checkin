import { TokenType } from '@src/types';
import { BE_URL, COOKIE_URL } from '@src/shared/constants/url';

export const http = async (url: string, opt: RequestInit) => {
  const res = await fetch(url, { credentials: 'include', ...opt });
  const json = await res.json();
  return json;
};

export const httpBE = async (path: string, opt: RequestInit) => {
  const res = await fetch(`${BE_URL}${path}`, {
    ...opt,
    headers: {
      Authorization: `Bearer ${import.meta.env.VITE_API_ANON_KEY}`,
      'Content-Type': 'application/json',
    },
  });
  const json = await res.json();
  return json;
};

export const httpWithCookie = async (
  url: string,
  opt: RequestInit,
  token: TokenType,
  restoreCookies = true,
) => {
  const LTOKEN_KEY = 'ltoken_v2';
  const LTUID_KEY = 'ltuid_v2';
  const { ltoken, ltuid } = token;
  const cookieConf: chrome.cookies.SetDetails = {
    url: COOKIE_URL,
    name: '',
    value: '',
    domain: '.hoyolab.com',
    path: '/',
    secure: true,
    httpOnly: true,
    sameSite: 'no_restriction',
    expirationDate: 2533996728000,
  };

  const cookies = await chrome.cookies.getAll({ domain: '.hoyolab.com' });

  // 기존 쿠키 모두 삭제
  await Promise.all(
    cookies.map((cookie) =>
      chrome.cookies.remove({ url: COOKIE_URL, name: cookie.name }),
    ),
  );

  // 쿠키 설정
  await Promise.all([
    chrome.cookies.set({
      ...cookieConf,
      name: LTOKEN_KEY,
      value: ltoken,
    }),
    chrome.cookies.set({
      ...cookieConf,
      name: LTUID_KEY,
      value: ltuid,
    }),
  ]);

  const result = await http(url, opt);

  try {
    // 기존 쿠키들로 다시 세팅
    // 위에서 세팅한ltoken과 ltuid는 오버라이딩 될것.
    await Promise.all(
      cookies.map(
        ({
          name,
          value,
          domain,
          path,
          secure,
          httpOnly,
          sameSite,
          expirationDate,
        }) =>
          chrome.cookies.set({
            url: COOKIE_URL,
            name,
            value,
            domain,
            path,
            secure,
            httpOnly,
            sameSite,
            expirationDate,
          }),
      ),
    );

    if (restoreCookies) {
      // 애초부터 로그인 정보가 없었다면 api 호출을 위해 set한 토큰 정보를 제거
      if (!cookies.find((cookie) => cookie.name === LTOKEN_KEY)) {
        await chrome.cookies.remove({
          url: COOKIE_URL,
          name: LTOKEN_KEY,
        });
        await chrome.cookies.remove({
          url: COOKIE_URL,
          name: LTUID_KEY,
        });
      }
    }
  } catch (e) {
    // G_ENABLED_IDPS 쿠키가 set될때 에러가 나는데, 일단 무시.
    console.error(e);
  }
  return result;
};

export const getCurrentCookies = async () => {
  const cookies = await chrome.cookies.getAll({ domain: '.hoyolab.com' });
  return cookies;
};

export const restoreCookies = async (cookies: chrome.cookies.Cookie[]) => {
  await Promise.all(
    cookies.map(
      ({
        name,
        value,
        domain,
        path,
        secure,
        httpOnly,
        sameSite,
        expirationDate,
      }) =>
        chrome.cookies.set({
          url: COOKIE_URL,
          name,
          value,
          domain,
          path,
          secure,
          httpOnly,
          sameSite,
          expirationDate,
        }),
    ),
  );
};
