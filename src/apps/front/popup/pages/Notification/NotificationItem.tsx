import { AccordionContent, AccordionTrigger, AccordionItem } from '@front/external/components/ui/accordion';
import { Badge } from '@front/external/components/ui/badge';
import { Skeleton } from '@front/external/components/ui/skeleton';
import { cn } from '@front/external/lib/utils';
import { timeAgo } from '@src/shared/utils/date';
import { useTranslation } from 'react-i18next';
import Markdown, { Components } from 'react-markdown'

const NotificationDate = ({ date }: { date: string }) => {
  const { i18n } = useTranslation();
  const notificationDate = new Date(date);
  return <span className="text-xs text-muted-foreground">{timeAgo(notificationDate, i18n.language)}</span>
}

type NotificationItemProps = {
  value: string;
  notification: {
    id: number;
    created_at: string;
    title: string;
    content: string;
    tags: string[];
  };
  selected: boolean;
};

const LinkRenderer: Components['a'] = (props) => {
  return (
    <a href={props.href} target="_blank" rel="noreferrer" className="underline cursor-pointer">
      {props.children}
    </a>
  );
}
const UlRenderer: Components['ul'] = (props) => {
  return <ul className="list-disc list-inside">{props.children}</ul>
}

export const NotificationItem = ({ value, notification, selected }: NotificationItemProps) => {
  return (
    <AccordionItem value={value} >
      <AccordionTrigger className="flex flex-row hover:no-underline group">
        <div className="flex flex-col flex-1 gap-y-1">
          <span className={cn("min-w-0 group-hover:underline max-w-[320px]", selected ? "keep-all" : "truncate")}>{notification.title}</span>
          <div className="flex flex-row flex-wrap gap-2">
            {notification.tags.map((tag) => (
              <Badge key={tag} className="h-4 text-xs">{tag}</Badge>
            ))}
          </div>
          <NotificationDate date={notification.created_at} />
        </div>
      </AccordionTrigger>
      <AccordionContent>
        <Markdown
          components={{
            a: LinkRenderer,
            ul: UlRenderer
          }}
        >{notification.content}</Markdown>
      </AccordionContent>
    </AccordionItem>
  )
};

export const NotificationItemSkeleton = () => {
  return <div className="flex flex-col justify-center h-16 gap-2">
    <Skeleton className="w-3/4 h-4" />
    <Skeleton className="w-2/4 h-4" />
  </div>
}