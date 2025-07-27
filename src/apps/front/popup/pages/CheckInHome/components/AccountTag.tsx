import { useAccountList } from '@front/shared/hooks/useAccountList';
import { localeTimeText } from '@src/shared/utils/date';
import { AccountInfoType } from '@src/types';
import { ReactNode, useState } from 'react';
import { WithTranslation, withTranslation } from 'react-i18next';
import { checkInMutation } from '@front/shared/queryOptions/mutations';
import { useMutation } from '@tanstack/react-query';
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from '@front/external/components/ui/tooltip';
import { Check, CircleAlert, LoaderCircle, RefreshCcw } from 'lucide-react';
import { Badge } from '@front/external/components/ui/badge';
import { ga } from '@src/shared/ga';

type TooltipWrapperProps = {
  children: ReactNode;
  text: string;
};
const TooltipWrapper = ({ children, text }: TooltipWrapperProps) => {
  return (
    <TooltipProvider delayDuration={100}>
      <Tooltip>
        <TooltipTrigger>{children}</TooltipTrigger>
        <TooltipContent>
          <p className="max-w-40">{text}</p>
        </TooltipContent>
      </Tooltip>
    </TooltipProvider>
  );
};

interface AccountTagProps extends WithTranslation {
  account: AccountInfoType;
  actId: string;
}
function AccountTag({ account, t, i18n, actId }: AccountTagProps) {
  const { lastCheckInResult, email, lastCheckInDate, lastCheckInMessage } =
    account;
  if (lastCheckInResult === 'success') {
    return (
      <SuccessTag
        email={email}
        tooltipText={t('common.checkin_time', {
          time: localeTimeText(i18n.language, lastCheckInDate),
        })}
      />
    );
  }
  if (lastCheckInResult === 'warn') {
    return <WarnTag email={email} tooltipText={lastCheckInMessage} />;
  }

  return (
    <FailTag
      email={email}
      tooltipText={lastCheckInMessage}
      account={account}
      actId={actId}
    />
  );
}

type TagProps = {
  email: string;
  tooltipText: string;
};

function WarnTag({ email, tooltipText }: TagProps) {
  return (
    <TooltipWrapper text={tooltipText}>
      <Badge className="flex cursor-default gap-x-1" variant="secondary">
        {email}
        <CircleAlert size={14} />
      </Badge>
    </TooltipWrapper>
  );
}

function SuccessTag({ email, tooltipText }: TagProps) {
  return (
    <TooltipWrapper text={tooltipText}>
      <Badge className="flex cursor-default gap-x-1">
        {email}
        <Check size={14} />
      </Badge>
    </TooltipWrapper>
  );
}

function FailTag({
  email,
  tooltipText,
  account,
  actId,
}: TagProps & { account: AccountInfoType; actId: string }) {
  const [mouseInIcon, setMouseInIcon] = useState<boolean>(false);
  const { updateLastCheckIn } = useAccountList();

  const { mutate: checkIn, isPending } = useMutation({
    ...checkInMutation(),
    onSuccess: (checkInResult) => {
      updateLastCheckIn(checkInResult);
    },
  });

  const onMouseEnter = () => {
    setMouseInIcon(true);
  };
  const onMouseLeave = () => {
    setMouseInIcon(false);
  };
  const refresh = async () => {
    if (isPending) {
      return;
    }
    ga.fireEvent('click_체크인재시도', { act_id: actId });
    checkIn(account);
  };
  const getIcon = () => {
    if (isPending) {
      return <LoaderCircle className="animate-spin" size={14} />;
    } else if (mouseInIcon) {
      return <RefreshCcw className="cursor-pointer" size={14} />;
    } else {
      return <CircleAlert className="tag-icon" size={14} />;
    }
  };
  return (
    <TooltipWrapper text={tooltipText}>
      <Badge
        onClick={refresh}
        className="flex gap-x-1"
        onMouseEnter={onMouseEnter}
        onMouseLeave={onMouseLeave}
        variant="destructive"
      >
        {email}
        {getIcon()}
      </Badge>
    </TooltipWrapper>
  );
}

export default withTranslation()(AccountTag);
