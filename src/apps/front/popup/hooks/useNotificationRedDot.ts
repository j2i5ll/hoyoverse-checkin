import { useEffect, useState } from 'react';

const LATEST_NOTIFICATION_ID_STORAGE_KEY = 'latestNotificationId';
export const useNotificationRedDot = (
  latestNotificationId: number | undefined,
) => {
  const [isShowRedDot, setIsShowRedDot] = useState(false);
  useEffect(() => {
    const savedlatestNotificationId = localStorage.getItem(
      LATEST_NOTIFICATION_ID_STORAGE_KEY,
    );
    if (latestNotificationId) {
      setIsShowRedDot(
        latestNotificationId !== Number(savedlatestNotificationId),
      );
    }
  }, [latestNotificationId]);

  const clearRedDot = () => {
    localStorage.setItem(
      LATEST_NOTIFICATION_ID_STORAGE_KEY,
      latestNotificationId.toString(),
    );
    setIsShowRedDot(false);
  };
  return {
    isShowRedDot,
    clearRedDot,
  };
};
