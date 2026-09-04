import { TokenType } from '@src/types';

export type SyncAccountScrapInput = {
  actId: string;
  token: TokenType;
};

export type SyncAccountScrapOutput = {
  success: boolean;
};
