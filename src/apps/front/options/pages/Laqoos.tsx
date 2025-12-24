import { Button } from '@front/external/components/ui/button';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@front/external/components/ui/card';
import { APP_NAME } from '@src/shared/constants/text';
import { LAQOOS_URL } from '@src/shared/constants/url';
import { ChartColumn, ChartLine, ChartPie } from 'lucide-react';
import { Trans, useTranslation } from 'react-i18next';

const Laqoos = () => {
  const { t } = useTranslation();
  return (
    <div className="mx-auto flex h-full max-w-4xl flex-1 flex-col items-center gap-y-6">
      <div className="space-y-2 text-center">
        <h1
          className="text-3xl font-bold tracking-tight"
          dangerouslySetInnerHTML={{ __html: t('laqoos.title') }}
        />
        <p
          className="text-lg text-muted-foreground"
          dangerouslySetInnerHTML={{ __html: t('laqoos.subtitle') }}
        />
      </div>

      <div className="grid w-full gap-4 sm:grid-cols-3">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center justify-center gap-2 text-xl">
              <ChartPie className="h-6 w-6" />
              {t('laqoos.character_stats')}
            </CardTitle>
            <CardDescription className="text-center">
              {t('laqoos.character_stats_desc')}
            </CardDescription>
          </CardHeader>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center justify-center gap-2 text-xl">
              <ChartColumn className="h-6 w-6" />
              {t('laqoos.record_stats')}
            </CardTitle>
            <CardDescription
              className="text-center"
              dangerouslySetInnerHTML={{ __html: t('laqoos.record_stats_desc') }}
            />
          </CardHeader>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center justify-center gap-2 text-xl">
              <ChartLine className="h-6 w-6" />
              {t('laqoos.weapon_stats')}
            </CardTitle>
            <CardDescription className="text-center">
              {t('laqoos.weapon_stats_desc')}
            </CardDescription>
          </CardHeader>
        </Card>
      </div>

      <Button size="lg" className="mt-4" asChild>
        <a href={`${LAQOOS_URL}`} target="_blank" rel="noreferrer">
          {t('laqoos.check_on_laqoos')}
        </a>
      </Button>

      <div className="mt-4 grid w-full gap-4">
        <Card className="border-0 shadow-none">
          <CardHeader>
            <CardTitle className="text-xl">
              {t('laqoos.how_collect_data')}
            </CardTitle>
            <CardDescription
              dangerouslySetInnerHTML={{
                __html: t('laqoos.how_collect_data_desc', { appName: APP_NAME }),
              }}
            />
          </CardHeader>
          <CardContent>
            <p className="text-sm text-muted-foreground">
              <Trans
                i18nKey="laqoos.opt_out_notice"
                components={{
                  link: <a href="#/" className="underline" />,
                }}
              />
            </p>
          </CardContent>
        </Card>

        <Card className="border-0 shadow-none">
          <CardHeader>
            <CardTitle className="text-xl">
              {t('laqoos.what_data_collect')}
            </CardTitle>
            <CardDescription>
              {t('laqoos.what_data_collect_desc')}
            </CardDescription>
          </CardHeader>
        </Card>
      </div>
    </div>
  );
};

export default Laqoos;
