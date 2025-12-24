import type { AddAccountUsecase } from '@background/domain/account/usecase/AddAccountUsecase';
import type { GetAccountStatusUsecase } from '@background/domain/account/usecase/GetAccountStatusUsecase';
import type { GetCookieUsecase } from '@background/domain/cookie/usecase/GetCookieUsecase';
import type { CallCheckInApiUsecase } from '@background/domain/check-in/usecase/CallCheckInApiUsecase';
import type { GetCheckInListUsecase } from '@background/domain/check-in/usecase/GetCheckInListUsecase';

import { injectable, inject } from 'tsyringe';

import type { CallCheckInApiInput } from '@background/domain/check-in/port/CallCheckInApiPort';
import type { GetAccountStatusInput } from '@background/domain/account/port/GetAccountStatusPort';
import type { AddAccountInput } from '@background/domain/account/port/AddAccountPort';
import { MessageResponseType, MessageType, RequestMessageType } from '@src/types';
import { GetStorageUsecase } from '@background/domain/storage/usecase/GetStorageUsecase';
import { SetStorageUsecase } from '@background/domain/storage/usecase/SetStorageUsecase';
import { GetStorageInput } from '@background/domain/storage/port/GetStoragePort';
import { SetStorageInput } from '@background/domain/storage/port/SetStoragePort';
type AvailRequestData =
  | CallCheckInApiInput
  | GetAccountStatusInput
  | AddAccountInput
  | GetStorageInput
  | SetStorageInput

@injectable()
export class MessengerController {
  constructor(
    @inject('AddAccountUsecase') private addAccountService: AddAccountUsecase,
    @inject('GetCookieUsecase') private getCookieService: GetCookieUsecase,
    @inject('GetAccountStatusUsecase')
    private getAccountStatusService: GetAccountStatusUsecase,
    @inject('CallCheckInApiUsecase')
    private callCheckInApiService: CallCheckInApiUsecase,
    @inject('GetCheckInListUsecase')
    private getCheckInListService: GetCheckInListUsecase,
    @inject('GetStorageUsecase')
    private getStorageService: GetStorageUsecase,
    @inject('SetStorageUsecase')
    private setStorageService: SetStorageUsecase,
  ) {}
  listen() {
    chrome.runtime.onMessage.addListener((request, _, sendResponse) => {
      this.makeResponse(request).then(sendResponse);
      return true;
    });
  }
  private processResponse(request: RequestMessageType<AvailRequestData>) {
    switch (request.type) {
      case MessageType.GetCookie:
        return this.getCookieService.execute();
      case MessageType.GetAccountStatus:
        return this.getAccountStatusService.execute(
          request.data as GetAccountStatusInput,
        );
      case MessageType.AddAccount:
        return this.addAccountService.execute(request.data as AddAccountInput);
      case MessageType.CheckIn:
        return this.callCheckInApiService.execute(
          request.data as CallCheckInApiInput,
        );
      case MessageType.GetCheckInTargetList: // background(checkInController)에서 사용하고 있음. messenger를 이용하지 않고 사용되고 있음.
        return this.getCheckInListService.execute();
      case MessageType.Ping:
        return Promise.resolve();
      case MessageType.GetStorage:
        return this.getStorageService.execute(request.data as GetStorageInput);
      case MessageType.SetStorage:
        return this.setStorageService.execute(request.data as SetStorageInput);
      default:
        return Promise.resolve();
      }
  }
  private async makeResponse(request: RequestMessageType<AvailRequestData>): Promise<MessageResponseType> {
    try {
      return {
        code: 'success',
        data: await this.processResponse(request) ?? null
      }
    } catch(e){
      return {
        code: 'error',
        message: e.message
      }
    }
  }
}
