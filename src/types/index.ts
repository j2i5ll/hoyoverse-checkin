import { ApiRetCode } from '@src/shared/constants/api-ret-code';

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export type FromApiType = any; // @eslint ing

export type CheckInResultType = 'warn' | 'success' | 'fail';

export type AccountInfoType = {
  email: string;
  lastCheckInDate: string;
  lastCheckInResult: CheckInResultType;
  lastCheckInMessage: string;
  retCode?: ApiRetCode;
  ltoken: string;
  ltuid: string;
  actId: string;
  scrap?: {
    isScrap?: boolean;
    lastScrapDate: string;
    laqoosToken?: string;
    nickname?: string;
  };
};

export type GameItemType = {
  icon: string;
  name: string;
  checkInUrl: string;
  accountList: AccountInfoType[];
  checkInAPIUrl: string;
  actId: string; // 게임 구분 id
  infoUrl: string; // checkin 가능 여부를 확인하는 주소
  resourceCheckable: boolean; // 레진 등 소모 재화 측정이 가능한가?
};

export type CheckInTargetType = {
  actId: string;
  checkInAPIUrl: string;
  ltoken: string;
  ltuid: string;
};

/*
 * EXIST : 이미 storage에 저장된 계정
 * NEW : 아직 storage에 저장되지 않은 계정
 * NOT_LOGIN : 로그인하지 않았음
 * NOT_SUPPORTED_GAME : 지원하지 않는 게임에 접속한 계정
 * NO_CHARACTER_IN_GAME : 게임내 캐릭터가 없는 계정
 */
export type AccountStatusType =
  | 'EXIST'
  | 'NEW'
  | 'NOT_LOGIN'
  | 'NOT_SUPPORTED_GAME'
  | 'NO_CHARACTER_IN_GAME';

export type GameEmailType = {
  email: string;
  actId: string;
};

// resource 정보 조회를 위해 선택된 계정정보(roleid)
export type SelectedRoleIdType = {
  email: string;
  actId: string;
  token: TokenType;
  roleId: string;
  region: string;
  nickname: string;
  level: number;
  regionName: string;
  // resourceNotification?: ResourceNotificationType;
};

// 리소스 알림 설정
export type ResourceNotificationType = {
  notiValue: number;
  isOn: boolean;
  lastNotiTime?: string;
};

export const enum MessageType {
  GetCookie = 'getCookie',
  GetAccountStatus = 'accountStatus',
  AddAccount = 'addAccount',
  CheckIn = 'checkIn',
  GetCheckInTargetList = 'getCheckInTargetList',
  Ping = 'ping',
  GetStorage = 'getStorage',
  SetStorage = 'setStorage',
}

export type RequestMessageType<T> = {
  type: MessageType;
  data?: T;
};

// cookie의 로크인 토큰 정보
export type TokenType = {
  ltoken: string;
  ltuid: string;
};

export class ResourceInfo {
  maxResource = 0;
  currentResource = 0;
  resourceFullyRecoveryTime = NaN;
  readonly ONE_RESOURCE_RECOVER_TIME: number;
  constructor(oneResourceRecoverTime = 1) {
    this.ONE_RESOURCE_RECOVER_TIME = oneResourceRecoverTime;
  }
  clone() {
    const newResource = new ResourceInfo(this.ONE_RESOURCE_RECOVER_TIME);
    newResource.currentResource = this.currentResource;
    newResource.maxResource = this.maxResource;
    newResource.resourceFullyRecoveryTime = this.resourceFullyRecoveryTime;

    return newResource;
  }
  get resourceNextRecoveryTime() {
    return this.resourceFullyRecoveryTime % this.ONE_RESOURCE_RECOVER_TIME;
  }
  countdown() {
    if (
      this.resourceFullyRecoveryTime === 0 ||
      isNaN(this.resourceFullyRecoveryTime)
    ) {
      return;
    }
    this.resourceFullyRecoveryTime--;
    if (this.resourceFullyRecoveryTime % this.ONE_RESOURCE_RECOVER_TIME === 0) {
      this.currentResource++;
    }
  }
}

export class EnergyInfo extends ResourceInfo {
  constructor(energyAPIData?: FromApiType) {
    super(6 * 60);
    if (!energyAPIData) {
      return;
    }
    const { energy } = energyAPIData;
    const { progress, restore } = energy;
    const { current, max } = progress;
    this.maxResource = max;
    this.currentResource = current;
    this.resourceFullyRecoveryTime = restore;
  }
}
export class StaminaInfo extends ResourceInfo {
  constructor(staminaAPIData?: FromApiType) {
    super(6 * 60);
    if (!staminaAPIData) {
      return;
    }
    const { max_stamina, current_stamina, stamina_recover_time } =
      staminaAPIData;
    this.maxResource = max_stamina;
    this.currentResource = current_stamina;
    this.resourceFullyRecoveryTime = stamina_recover_time;
  }
}

export class ResinInfo extends ResourceInfo {
  constructor(resinAPIData?: FromApiType) {
    super(8 * 60);
    if (!resinAPIData) {
      return;
    }
    const { max_resin, current_resin, resin_recovery_time } = resinAPIData;
    this.maxResource = max_resin as number;
    this.currentResource = current_resin as number;
    this.resourceFullyRecoveryTime = Number(resin_recovery_time);
  }
}

export type CharacterItemType = {
  nickname: string;
  region: string;
  regionName: string;
  level: number;
  gameRoleId: string;
};

// background 와 통신시 반환되는 응답 타입
// eslint-disable-next-line @typescript-eslint/no-explicit-any
export type MessageResponseType<T = any> = {
  code: 'success' | 'error';
  data?: T;
  message?: string;
};

export type StorageAreaType = 'local' | 'session';

export type ScrapResultType = {
  date: string;
  result: boolean;
  gameId: number;
  roleId: string;
  region: string;
};

export type ScrapLang = 'ko-kr' | 'en-us';
