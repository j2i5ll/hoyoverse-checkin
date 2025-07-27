import {
  GetStorageInput,
  GetStorageOutput,
} from '@background/domain/storage/port/GetStoragePort';
import {
  SetStorageInput,
  SetStorageOutput,
} from '@background/domain/storage/port/SetStoragePort';
import { requestMessage } from '@front/shared/utils/browser';
import { MessageType, StorageAreaType } from '@src/types';

const GA_ENDPOINT = 'https://www.google-analytics.com/mp/collect';
const MEASUREMENT_ID = import.meta.env.VITE_GA_MEASUREMENT_ID;
const API_SECRET = import.meta.env.VITE_GA_API_SECRET;

const GA_DEBUG_ENDPOINT = 'https://www.google-analytics.com/debug/mp/collect';

// Get via https://developers.google.com/analytics/devguides/collection/protocol/ga4/sending-events?client_type=gtag#recommended_parameters_for_reports
const DEFAULT_ENGAGEMENT_TIME_MSEC = 100;

// Duration of inactivity after which a new session is created
const SESSION_EXPIRATION_IN_MIN = 30;

class Analytics {
  private debug = false;
  constructor(debug = false) {
    this.debug = debug;
  }
  private async getStorageData(area: StorageAreaType, key: string) {
    try {
      return await chrome.storage[area].get(key);
    } catch {
      const res = await requestMessage<GetStorageInput, GetStorageOutput>({
        data: {
          type: MessageType.GetStorage,
          data: {
            area,
            key,
          },
        },
      });
      return res.value;
    }
  }
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  private async setStorageData(area: StorageAreaType, key: string, value: any) {
    try {
      return await chrome.storage[area].set({ [key]: value });
    } catch {
      return await requestMessage<SetStorageInput, SetStorageOutput>({
        data: {
          type: MessageType.SetStorage,
          data: {
            area,
            key,
            value,
          },
        },
      });
    }
  }

  // Returns the client id, or creates a new one if one doesn't exist.
  // Stores client id in local storage to keep the same client id as long as
  // the extension is installed.
  async getOrCreateClientId() {
    let { clientId } = await this.getStorageData('local', 'clientId');
    if (!clientId) {
      // Generate a unique client ID, the actual value is not relevant
      clientId = self.crypto.randomUUID();
      await this.setStorageData('local', 'clientId', clientId);
    }
    return clientId;
  }

  // Returns the current session id, or creates a new one if one doesn't exist or
  // the previous one has expired.
  async getOrCreateSessionId() {
    // Use storage.session because it is only in memory
    let { sessionData } = await this.getStorageData('session', 'sessionData');
    const currentTimeInMs = Date.now();
    // Check if session exists and is still valid
    if (sessionData && sessionData.timestamp) {
      // Calculate how long ago the session was last updated
      const durationInMin = (currentTimeInMs - sessionData.timestamp) / 60000;
      // Check if last update lays past the session expiration threshold
      if (durationInMin > SESSION_EXPIRATION_IN_MIN) {
        // Clear old session id to start a new session
        sessionData = null;
      } else {
        // Update timestamp to keep session alive
        sessionData.timestamp = currentTimeInMs;
        await this.setStorageData('session', 'sessionData', sessionData);
      }
    }
    if (!sessionData) {
      // Create and store a new session
      sessionData = {
        session_id: currentTimeInMs.toString(),
        timestamp: currentTimeInMs.toString(),
      };
      await this.setStorageData('session', 'sessionData', sessionData);
    }
    return sessionData.session_id;
  }

  // Fires an event with optional params. Event names must only include letters and underscores.
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  async fireEvent(name: string, params: any = {}) {
    // Configure session id and engagement time if not present, for more details see:
    // https://developers.google.com/analytics/devguides/collection/protocol/ga4/sending-events?client_type=gtag#recommended_parameters_for_reports
    if (!params.session_id) {
      params.session_id = await this.getOrCreateSessionId();
    }
    if (!params.engagement_time_msec) {
      params.engagement_time_msec = DEFAULT_ENGAGEMENT_TIME_MSEC;
    }

    try {
      const response = await fetch(
        `${
          this.debug ? GA_DEBUG_ENDPOINT : GA_ENDPOINT
        }?measurement_id=${MEASUREMENT_ID}&api_secret=${API_SECRET}`,
        {
          method: 'POST',
          body: JSON.stringify({
            client_id: await this.getOrCreateClientId(),
            events: [
              {
                name: `${this.app}_${name}`,
                params: {
                  ...params,
                  app: this.app,
                },
              },
            ],
          }),
        },
      );
      if (!this.debug) {
        return;
      }
      console.log(await response.text());
    } catch (e) {
      console.error('Google Analytics request failed with an exception', e);
    }
  }

  // Fire a page view event.
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  async firePageViewEvent(
    pageTitle: string,
    pageLocation: string,
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    additionalParams: any = {},
  ) {
    return this.fireEvent('page_view', {
      page_title: `${this.app}_${pageTitle}`,
      page_location: `/${this.app}${pageLocation}`,
      ...additionalParams,
    });
  }

  // Fire an error event.
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  async fireErrorEvent(error: Error, additionalParams: any = {}) {
    // Note: 'error' is a reserved event name and cannot be used
    // see https://developers.google.com/analytics/devguides/collection/protocol/ga4/reference?client_type=gtag#reserved_names
    return this.fireEvent('extension_error', {
      ...error,
      ...additionalParams,
    });
  }
  private app: GAAppType = null;
  init(app: GAAppType) {
    this.app = app;
  }
}

type GAAppType = 'option' | 'tooltip' | 'popup' | 'bg';

export const ga = new Analytics(import.meta.env.DEV);
