import { TokenType } from '@src/types';
import { BE_URL } from '@src/shared/constants/url';

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

function generateUniqueRuleId(): number {
  const arr = new Uint32Array(1);
  crypto.getRandomValues(arr);
  return (arr[0] % 0x7FFFFFFF) + 1;
}

export const httpWithCookie = async (
  url: string,
  opt: RequestInit,
  token: TokenType,
) => {
  const { ltoken, ltuid } = token;
  const cookieValue = `ltoken_v2=${ltoken}; ltuid_v2=${ltuid}`;
  const ruleId = generateUniqueRuleId();

  await chrome.declarativeNetRequest.updateSessionRules({
    removeRuleIds: [ruleId],
    addRules: [
      {
        id: ruleId,
        priority: 1,
        action: {
          type: chrome.declarativeNetRequest.RuleActionType.MODIFY_HEADERS,
          requestHeaders: [
            {
              header: 'Cookie',
              operation: chrome.declarativeNetRequest.HeaderOperation.SET,
              value: cookieValue,
            },
          ],
        },
        condition: {
          urlFilter: url,
          resourceTypes: [
            chrome.declarativeNetRequest.ResourceType.XMLHTTPREQUEST,
            chrome.declarativeNetRequest.ResourceType.OTHER,
          ],
        },
      },
    ],
  });

  try {
    const res = await fetch(url, {
      ...opt,
      credentials: 'omit',
    });
    const json = await res.json();
    return json;
  } finally {
    await chrome.declarativeNetRequest.updateSessionRules({
      removeRuleIds: [ruleId],
    });
  }
};
