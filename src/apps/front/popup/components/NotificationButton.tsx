import { Badge } from '@front/external/components/ui/badge';
import { useNotificationRedDot } from '@front/popup/hooks/useNotificationRedDot';
import { notificationListQuery } from '@front/shared/queryOptions/queryies';
import { useInfiniteQuery } from '@tanstack/react-query';
import { Bell } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

export const NotificationButton = () => {
  const navigate = useNavigate();
  const { data: notificationList = [] } = useInfiniteQuery({
    ...notificationListQuery(10),
  });
  const { isShowRedDot, clearRedDot } = useNotificationRedDot(notificationList[0]?.id);
  return (
    <a onClick={() => {
      clearRedDot();
      navigate('/notice');
    }} className="relative cursor-pointer">
      {isShowRedDot && (
        <Badge variant="destructive" className="absolute text-xs -top-2 right-3">N</Badge>
      )}
      <Bell />
    </a>
  )
};
