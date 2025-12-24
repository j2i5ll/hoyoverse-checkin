export class AddAccountError extends Error {
  constructor(message?: string) {
    super(message);
  }
}
export class AccountStatusError extends Error {
  constructor(message?: string) {
    super(message);
  }
}

export class UnKnownGameError extends Error {
  constructor(message?: string) {
    super(message);
  }
}

// 계정의 퍼블릭 데이터 설정을 안해서 리소스 조회가 안되는 상태
export class AccountPublicDataError extends Error {
  constructor(message?: string) {
    super(message);
  }
}

export class UnknownError extends Error {
  constructor(message?: string) {
    super(message);
  }
}
