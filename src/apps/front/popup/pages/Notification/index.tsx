import { Accordion } from '@front/external/components/ui/accordion';
import { ScrollArea } from '@front/external/components/ui/scroll-area';
import { NotificationItem, NotificationItemSkeleton } from '@front/popup/pages/Notification/NotificationItem';
import { notificationListQuery } from '@front/shared/queryOptions/queryies';
import { useInfiniteQuery } from '@tanstack/react-query';
import { useEffect, useState } from 'react';
import { useInView } from 'react-intersection-observer';

const Notification = () => {
  const { data: notificationList, isLoading, fetchNextPage, hasNextPage } = useInfiniteQuery({
    ...notificationListQuery(10),
  });
  const [accordionValue, setAccordionValue] = useState<string | null>(null);

  const { ref, inView } = useInView();
  useEffect(() => {
    if (inView && hasNextPage) {
      fetchNextPage();
    }
  }, [inView, hasNextPage, fetchNextPage]);

  if (isLoading) {
    return (
      <div className="w-full px-3">
        <NotificationItemSkeleton />
      </div>

    )
  }
  if (notificationList.length === 0) {
    return (<div className="flex flex-col items-center justify-center w-full py-40 text-sm gap-y-4 text-muted-foreground">
      <span>알림이 없습니다.</span>
    </div>)
  }
  return (
    <ScrollArea className="flex flex-col flex-1 overflow-y-auto">
      <Accordion type="single" collapsible className="w-full px-3 " value={accordionValue} onValueChange={setAccordionValue}>
        {notificationList.map((notification, index) => (
          <NotificationItem value={`${notification.id}`} key={index} notification={notification} selected={accordionValue === `${notification.id}`} />
        ))}
        {hasNextPage && (
          <div ref={ref}>
            <NotificationItemSkeleton />
          </div>
        )}
      </Accordion>
    </ScrollArea>
  );
};

export default Notification;
