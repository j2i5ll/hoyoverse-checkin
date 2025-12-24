import 'reflect-metadata';
import { container as DIContainer } from 'tsyringe';

import { CallCheckInApiService } from './service/check-in/CallCheckInApiService';
import { GetCheckInListService } from './service/check-in/GetCheckInListService';

import { GetCheckInResultSummaryService } from './service/badge/GetCheckInResultSummaryService';

import { GetAccountStatusService } from './service/account/GetAccountStatusService';
import { AddAccountService } from './service/account/AddAccountService';
import { GetCookieService } from './service/cookie/GetCookieService';
import { GetStorageService } from '@background/service/storage/GetStorageService';
import { SetStorageService } from '@background/service/storage/SetStorageService';
import { ZZZScrapGameDataService } from '@background/service/scrap/ZZZScrapGameDataService';
import { GetScrapTargetService } from '@background/service/scrap/GetScrapTargetService';
import { HSRScrapGameDataService } from '@background/service/scrap/HSRScrapGameDataService';

DIContainer.register('CallCheckInApiUsecase', {
  useClass: CallCheckInApiService,
});
DIContainer.register('GetCheckInListUsecase', {
  useClass: GetCheckInListService,
});
DIContainer.register('GetCheckInResultSummaryUsecase', {
  useClass: GetCheckInResultSummaryService,
});
DIContainer.register('GetAccountStatusUsecase', {
  useClass: GetAccountStatusService,
});
DIContainer.register('AddAccountUsecase', { useClass: AddAccountService });
DIContainer.register('GetCookieUsecase', { useClass: GetCookieService });

DIContainer.register('GetStorageUsecase', { useClass: GetStorageService });
DIContainer.register('SetStorageUsecase', { useClass: SetStorageService });

DIContainer.register('ZZZScrapGameDataUsecase', {
  useClass: ZZZScrapGameDataService,
});

DIContainer.register('HSRScrapGameDataUsecase', {
  useClass: HSRScrapGameDataService,
});
DIContainer.register('GetScrapTargetUsecase', {
  useClass: GetScrapTargetService,
});

export { DIContainer };
