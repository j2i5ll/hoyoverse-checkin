import { requestMessage } from '@front/shared/utils/browser';
import { MessageType } from '@src/types';
(async () => {
  await requestMessage({
    data: {
      type: MessageType.Ping
    }
  })
})();
