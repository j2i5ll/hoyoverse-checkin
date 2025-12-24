// 페이지 컨텍스트에서 실행되는 스크립트 (MAIN world)
// laqoos에 주입되는 코드이기에 메시지 타입들은 injectAccountList와 동일하게 맞춰야함.

window.hoyoverseCheckIn = {};
window.hoyoverseCheckIn.getAccountList = () =>
  new Promise((resolve) => {
    const handler = (event) => {
      if (event.data.type === 'ROLE_ID_LIST_RESPONSE') {
        window.removeEventListener('message', handler);
        resolve(event.data.data);
      }
    };
    window.addEventListener('message', handler);
    window.postMessage({ type: 'REQUEST_ROLE_ID_LIST' }, '*');
  });
