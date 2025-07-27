import 'reflect-metadata';
import { CheckInController } from './controller/check-in';
import { BadgeController } from './controller/badge';
import { MessengerController } from './controller/messenger';

import { DIContainer } from './dependency';
import { initSentry } from '@src/shared/utils/sentry';
import { ga } from '@src/shared/ga';
import { ScrapController } from '@background/controller/scrap';
ga.init('bg');
initSentry();

const checkInController = DIContainer.resolve(CheckInController);
checkInController.runCheckInInterval();

const messengerController = DIContainer.resolve(MessengerController);
messengerController.listen();

const badgeController = DIContainer.resolve(BadgeController);
badgeController.listenStorageChange();

const scrapController = DIContainer.resolve(ScrapController);
scrapController.run();

console.log('background loaded');
