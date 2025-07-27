import { AccountInfoType, TokenType } from '@src/types';
import { CallCheckInApiOutput } from '../domain/check-in/port/CallCheckInApiPort';
import { ApiRetCode } from '@src/shared/constants/api-ret-code';
import { Storage } from './Storage';
import { GameActId, GameKey } from '@src/shared/constants/game';

class AccountStore extends Storage<AccountInfoType[]> {
  constructor() {
    super('accountList');
  }

  private getLastCheckInResult(retCode: ApiRetCode) {
    switch (retCode) {
      case ApiRetCode.AlreadyCheckIn:
      case ApiRetCode.Success:
        return 'success';
      case ApiRetCode.NeedCaptcha:
        return 'warn';
      default:
        return 'fail';
    }
  }

  async getAccountList() {
    const savedAccountList = await this.load();
    if (!savedAccountList) {
      return [];
    }
    return savedAccountList;
  }
  async updateLastCheckIn(checkInResultList: CallCheckInApiOutput[]) {
    const accountList = await this.getAccountList();
    checkInResultList.forEach((checkInResult) => {
      const { actId, retCode, ltuid, lastCheckInMessage } = checkInResult;
      const updateAccount = accountList.find(
        (account) => account.ltuid === ltuid && account.actId === actId,
      );
      if (!updateAccount) {
        return;
      }
      updateAccount.lastCheckInMessage = lastCheckInMessage;
      updateAccount.retCode = retCode;
      updateAccount.lastCheckInDate = new Date().toISOString();
      updateAccount.lastCheckInResult = this.getLastCheckInResult(retCode);
    });
    await this.save(accountList);
  }
  async addAccount(newAccount: AccountInfoType) {
    const accountList = await this.getAccountList();
    const exist = accountList.find(
      (account) =>
        account.ltoken === newAccount.ltoken &&
        account.actId === newAccount.actId,
    );
    if (exist) {
      return;
    }
    accountList.push(newAccount);
    this.save(accountList);
  }
  async setAccountList(accountList: AccountInfoType[]) {
    await this.save(accountList);
  }
  async deleteAccount(actId: string, ltuid: string) {
    const accountList = await this.getAccountList();
    const targetIndex = accountList.findIndex(
      (account) => account.ltuid === ltuid && account.actId === actId,
    );
    accountList.splice(targetIndex, 1);
    await this.save(accountList);
  }

  async updateIsScrap(actId: string, token: TokenType, isScrap: boolean) {
    const accountList = await this.getAccountList();
    const targetIndex = accountList.findIndex(
      (account) => account.actId === actId && account.ltoken === token.ltoken,
    );
    if (targetIndex === -1) {
      return;
    }
    if (accountList[targetIndex].scrap) {
      accountList[targetIndex].scrap.isScrap = isScrap;
    } else {
      accountList[targetIndex].scrap = {
        isScrap,
        lastScrapDate: new Date().toISOString(),
      };
    }
    await this.save(accountList);
  }
  async upsertScrap(
    token: TokenType,
    gameKey: GameKey,
    scrap: AccountInfoType['scrap'],
  ) {
    const accountList = await this.getAccountList();
    const targetIndex = accountList.findIndex(
      (account) =>
        account.ltuid === token.ltuid &&
        account.ltoken === token.ltoken &&
        account.actId === GameActId[gameKey],
    );
    if (targetIndex === -1) {
      return;
    }
    accountList[targetIndex].scrap = scrap;
    await this.save(accountList);
  }
}
export const accountStore = new AccountStore();
