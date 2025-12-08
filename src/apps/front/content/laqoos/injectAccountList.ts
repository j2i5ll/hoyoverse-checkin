// Content script for laqoos.com - postMessage 통신으로 roleIdList 제공

import { AccountInfoType } from '@src/types';

// 1. 페이지에서 사용할 헬퍼 함수 주입 (외부 스크립트로 CSP 우회)
const injectScript = () => {
  const script = document.createElement('script');
  script.src = chrome.runtime.getURL(
    'src/apps/front/content/laqoos/getAccountListScript.js',
  );
  script.onload = () => script.remove();
  (document.head || document.documentElement).appendChild(script);
};

// document_start 시점에서 DOM이 준비되면 즉시 주입
if (document.head || document.documentElement) {
  injectScript();
} else {
  document.addEventListener('DOMContentLoaded', injectScript);
}

// 2. postMessage 리스너 등록 (isolated world)
window.addEventListener('message', async (event) => {
  if (event.source !== window) return;
  if (event.data.type === 'REQUEST_ROLE_ID_LIST') {
    const result = await chrome.storage.local.get('accountList');
    const accountList = result.accountList ?? [];
    const responseData = accountList.map((account: AccountInfoType) => ({
      ...account.scrap,
    }));
    window.postMessage(
      {
        type: 'ROLE_ID_LIST_RESPONSE',
        data: responseData,
      },
      '*',
    );
  }
});
