import 'reflect-metadata';
import { CheckInController } from './controller/check-in';
import { BadgeController } from './controller/badge';
import { MessengerController } from './controller/messenger';

import { DIContainer } from './dependency';
import { initSentry } from '@src/shared/utils/sentry';
import { ga } from '@src/shared/ga';
import { ScrapController } from '@background/controller/scrap';
import { UpdateController } from '@background/controller/update';
import { alarmManager } from '@background/alarm/AlarmManager';
ga.init('bg');
initSentry();

// 확장 프로그램 삭제 시 피드백 폼으로 리다이렉트
chrome.runtime.setUninstallURL(import.meta.env.VITE_UNINSTALL_FEEDBACK_URL);

// 확장 프로그램 설치 시 onboarding 페이지로 이동
chrome.runtime.onInstalled.addListener((details) => {
  if (details.reason === 'install') {
    chrome.tabs.create({
      url: chrome.runtime.getURL('src/apps/front/options/index.html#/onboarding'),
    });
  }
});

const checkInController = DIContainer.resolve(CheckInController);
checkInController.start();

const messengerController = DIContainer.resolve(MessengerController);
messengerController.listen();

const badgeController = DIContainer.resolve(BadgeController);
badgeController.listenStorageChange();

const scrapController = DIContainer.resolve(ScrapController);
scrapController.start();

const updateController = new UpdateController();
updateController.start();

alarmManager.init();

console.log('background loaded');
