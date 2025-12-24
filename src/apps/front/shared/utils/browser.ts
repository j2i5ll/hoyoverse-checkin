import { MessageResponseType, RequestMessageType } from '@src/types';

type RequestMessageTypeOptions<T> = {
  data: RequestMessageType<T>
}
export const requestMessage = async <I = void, O = void>({data}: RequestMessageTypeOptions<I>) => {
  const response: MessageResponseType<O> = await chrome.runtime.sendMessage<
    RequestMessageType<I>, MessageResponseType<O>
  >({...data});
  if (response.code === 'success') {
    return response.data
  }
  throw new Error(response.message)
}