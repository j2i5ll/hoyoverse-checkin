import { Button } from '@front/external/components/ui/button';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@front/external/components/ui/card';
import { APP_NAME } from '@src/shared/constants/text';
import { GAME_INFO_LIST } from '@src/shared/constants/game';
import {
  ExternalLink,
  Pin,
  Settings,
  // TriangleAlert,
  UserPlus,
  Zap,
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { Trans, useTranslation } from 'react-i18next';
import { ExtensionIcon } from '@front/options/components/ExtensionIcon';
import checkinSuccess from '@assets/img/checkin_success.png';
import checkinFail from '@assets/img/checkin_fail.png';

const Onboarding = () => {
  const navigate = useNavigate();
  const { t } = useTranslation();

  const handleStart = () => {
    navigate('/');
  };

  const handleOpenCheckinPage = (url: string, actId: string) => {
    window.open(`${url}${actId}`, '_blank');
  };

  return (
    <div className="mx-auto flex h-full max-w-2xl flex-1 flex-col items-center gap-y-6">
      <div className="space-y-2 text-center">
        <h1 className="text-3xl font-bold tracking-tight">
          {t('onboarding.welcome', { appName: APP_NAME })}
        </h1>
        <p className="text-lg text-muted-foreground">
          {t('onboarding.subtitle')}
        </p>
      </div>

      <div className="grid w-full gap-4">
        {/* Step 1: 계정 등록 */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-xl">
              <UserPlus className="h-6 w-6" />
              {t('onboarding.register_account')}
            </CardTitle>
            <CardDescription>
              {t('onboarding.register_account_desc', { appName: APP_NAME })}
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-2 gap-2 sm:grid-cols-4">
              {GAME_INFO_LIST.map((game) => (
                <Button
                  key={game.actId}
                  variant="outline"
                  className="flex h-auto flex-col gap-2 p-3"
                  onClick={() =>
                    handleOpenCheckinPage(game.checkInUrl, game.actId)
                  }
                >
                  <img
                    src={game.icon}
                    alt={t(game.name)}
                    className="h-10 w-10 rounded-lg"
                  />
                  <span className="text-xs">{t(game.name)}</span>
                  <ExternalLink className="h-3 w-3" />
                </Button>
              ))}
            </div>
            {/*
            <div className="mt-3 flex items-start gap-2 rounded-lg bg-muted p-3 text-sm">
              <TriangleAlert className="mt-0.5 h-4 w-4 shrink-0" />
              <div>
                <p className="font-semibold">
                  {t('onboarding.register_warning_title')}
                </p>
                <p className="mt-0.5 whitespace-pre-line">
                  {t('onboarding.register_warning_desc')}
                </p>
              </div>
            </div>
            */}
          </CardContent>
        </Card>

        {/* Step 2: Popup 메뉴 활용 */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-xl">
              <Zap className="h-6 w-6" />
              {t('onboarding.check_status')}
            </CardTitle>
            <CardDescription>
              {t('onboarding.check_status_desc')}
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-3">
            <div className="flex flex-col gap-3 rounded-lg bg-muted p-3 text-sm">
              <span>
                <Trans
                  i18nKey="onboarding.bookmark_tip"
                  values={{ appName: APP_NAME }}
                  components={{
                    extensionIcon: <ExtensionIcon />,
                    pinIcon: <Pin className="inline-block h-5 w-5 shrink-0" />,
                  }}
                />
              </span>
              <div className="flex items-center gap-4">
                <div className="flex items-center gap-2">
                  <img
                    src={checkinSuccess}
                    alt={t('onboarding.checkin_success')}
                    className="h-8 w-8"
                  />
                  <span className="text-muted-foreground">
                    {t('onboarding.checkin_success')}
                  </span>
                </div>
                <div className="flex items-center gap-2">
                  <img
                    src={checkinFail}
                    alt={t('onboarding.checkin_fail')}
                    className="h-8 w-8"
                  />
                  <span className="text-muted-foreground">
                    {t('onboarding.checkin_fail')}
                  </span>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Step 3: 계정 관리 */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-xl">
              <Settings className="h-6 w-6" />
              {t('onboarding.manage_account')}
            </CardTitle>
            <CardDescription>
              {t('onboarding.manage_account_desc')}
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Button variant="outline" onClick={handleStart}>
              {t('onboarding.go_to_settings')}
            </Button>
          </CardContent>
        </Card>
      </div>

      <Button size="lg" className="mt-4" onClick={handleStart}>
        {t('onboarding.get_started')}
      </Button>
    </div>
  );
};

export default Onboarding;
