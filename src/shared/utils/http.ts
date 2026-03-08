import { TokenType } from '@src/types';
import { BE_URL } from '@src/shared/constants/url';
import { captureException } from '@src/shared/utils/sentry';
import { JsonParseError } from '@src/shared/errors/JsonParseError';

const MAX_RESPONSE_BODY_LENGTH = 300;

async function parseJsonResponse(res: Response, url: string) {
  const text = await res.text();
  try {
    return JSON.parse(text);
  } catch {
    const body = text.substring(0, MAX_RESPONSE_BODY_LENGTH);
    const error = new JsonParseError(url, res.status, body);

    captureException(error, {
      captureContext: {
        contexts: {
          response: {
            url,
            status_code: res.status,
            body,
          },
        },
      },
    });

    throw error;
  }
}

export const http = async (url: string, opt: RequestInit) => {
  const res = await fetch(url, { credentials: 'include', ...opt });
  const json = await parseJsonResponse(res, url);
  return json;
};

export const httpBE = async (path: string, opt: RequestInit) => {
  const fullUrl = `${BE_URL}${path}`;
  const res = await fetch(fullUrl, {
    ...opt,
    headers: {
      Authorization: `Bearer ${import.meta.env.VITE_API_ANON_KEY}`,
      'Content-Type': 'application/json',
    },
  });
  const json = await parseJsonResponse(res, fullUrl);
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
    const json = await parseJsonResponse(res, url);
    return json;
  } finally {
    await chrome.declarativeNetRequest.updateSessionRules({
      removeRuleIds: [ruleId],
    });
  }
};
