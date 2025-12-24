import { useAccountList } from '@front/shared/hooks/useAccountList';
import { localeTimeText } from '@src/shared/utils/date';
import { AccountInfoType } from '@src/types';
import { withTranslation, WithTranslation } from 'react-i18next';
import { useContext } from 'react';
import { SelectedGameActIdContext } from '../provider/selectedGameActId';
import { useMutation } from '@tanstack/react-query';
import { checkInMutation } from '@front/shared/queryOptions/mutations';
import {
  Card,
  CardContent,
} from '@front/external/components/ui/card';
import {
  Check,
  CircleAlert,
  LoaderCircle,
  RefreshCcw,
  Trash2,
} from 'lucide-react';
import { Button } from '@front/external/components/ui/button';
import { ga } from '@src/shared/ga';
import { Switch } from '@front/external/components/ui/switch';
import { GameActId } from '@src/shared/constants/game';
import { GameKey } from '@src/shared/constants/game';
import { Separator } from '@front/external/components/ui/separator';
import { TooltipContent } from '@front/external/components/ui/tooltip';
import { TooltipTrigger } from '@front/external/components/ui/tooltip';
import { Tooltip } from '@front/external/components/ui/tooltip';
import { TooltipProvider } from '@front/external/components/ui/tooltip';

interface AccountItemProps extends WithTranslation {
  account: AccountInfoType;
  actId: string;
}
const AccountItem = ({ account, t, i18n, actId }: AccountItemProps) => {
  const { deleteAccount, updateLastCheckIn, updateIsScrap } = useAccountList();
  const { selectedGameActId } = useContext(SelectedGameActIdContext);
  const { mutate: checkIn, isPending } = useMutation({
    ...checkInMutation(),
    onSuccess: (checkInResult) => {
      updateLastCheckIn(checkInResult);
    },
  });
  const handleDeleteAccount = (account: AccountInfoType) => {
    if (confirm(t('options.confirm_delete_account'))) {
      deleteAccount(selectedGameActId, account.ltuid);
      ga.fireEvent('click_계정삭제', { act_id: actId });
    }
  };
  const retry = (account: AccountInfoType) => {
    checkIn(account);
    ga.fireEvent('click_체크인재시도', { act_id: actId });
  };

  const getResultIcon = () => {
    if (account.lastCheckInResult === 'success') {
      return <Check />;
    }
    return <CircleAlert />;
  };

  const onChangeScrapData = (checked: boolean) => {
    const { ltoken, ltuid, actId } = account;
    updateIsScrap(actId, { ltoken, ltuid }, checked);
    if (checked) {
      ga.fireEvent('데이터싱크_ON', { act_id: actId });
    } else {
      ga.fireEvent('데이터싱크_OFF', { act_id: actId });
    }
  };


  const collectTargetList = [GameActId[GameKey.ZZZ], GameActId[GameKey.Starrail], GameActId[GameKey.Genshin]];

  return (
    <Card className="flex flex-row">
      <CardContent className="flex flex-row w-full p-4">
        <div className="flex items-start justify-center pt-5 pr-4">
          {getResultIcon()}
        </div>
        <div className="flex flex-col w-full gap-y-4">
          <div className="flex flex-row items-center" >
            <div className="flex flex-col space-y-1.5 flex-1">
              <div className="text-sm">{account.email}</div>
              <div className="text-muted-foreground">
                {account.lastCheckInResult === 'success'
                  ? t('common.checkin_time', {
                    time: localeTimeText(i18n.language, account.lastCheckInDate),
                  })
                  : account.lastCheckInMessage}
              </div>
            </div>
            <div className="flex flex-row items-center p-6 gap-x-2">
              {account.lastCheckInResult === 'fail' ? (
                <Button
                  variant="outline"
                  size="icon"
                  onClick={() => retry(account)}
                  disabled={isPending}
                >
                  {isPending ? (
                    <LoaderCircle className="animate-spin" />
                  ) : (
                    <RefreshCcw />
                  )}
                </Button>
              ) : null}
              <Button
                variant="outline"
                size="icon"
                onClick={() => handleDeleteAccount(account)}
              >
                <Trash2 />
              </Button>
            </div>
          </div>
          {collectTargetList.includes(account.actId) ? (
            <>
              <Separator />
              <div className="flex flex-row items-center justify-between w-full pr-6">
                <div className="text-sm" >
                  캐릭터/전적 싱크
                </div>
                <TooltipProvider delayDuration={30}>
                  <Tooltip>
                    <TooltipTrigger >
                      <Switch id="character-info-collection"
                        checked={account.scrap?.isScrap === undefined || account.scrap?.isScrap}
                        onCheckedChange={onChangeScrapData}
                      />
                    </TooltipTrigger>
                    <TooltipContent className="flex flex-col items-center justify-center max-w-52">
                      <p>캐릭터/전적 정보를 제공하고 <br />LaQoos에서 인사이트를 얻어보세요.<a href="#/laqoos" className="underline">자세히</a>
                      </p>

                    </TooltipContent>
                  </Tooltip>
                </TooltipProvider>
              </div>
            </>
          ) : null}
        </div>
      </CardContent>
    </Card>
  );
};
export default withTranslation()(AccountItem);
