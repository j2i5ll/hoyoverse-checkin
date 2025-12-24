import { GameActId, GameKey } from '@src/shared/constants/game';
import { WithTranslation, withTranslation } from 'react-i18next';
import { useSelectedRoleId } from '@front/shared/hooks/useSelectedRoleId';
import { useMemo } from 'react';
import { Button } from '@front/external/components/ui/button';
import { ExternalLinkIcon } from 'lucide-react';
interface NeedPublicDataProps extends WithTranslation {
  gameKey: GameKey;
}
function NeedPublicData({ t, gameKey }: NeedPublicDataProps) {
  const { selectedRoleIdList } = useSelectedRoleId();

  const email = useMemo(() => {
    return (
      selectedRoleIdList.find(({ actId }) => actId === GameActId[gameKey])
        ?.email ?? ''
    );
  }, [selectedRoleIdList]);

  let url = '';
  // 현재 원신만 설정 on/off 가 있는것으로 보임.
  if (gameKey === GameKey.Genshin) {
    url =
      'https://act.hoyolab.com/app/community-game-records-sea/index.html?bbs_presentation_style=fullscreen&bbs_auth_required=true&v=350&gid=2&utm_source=hoyolab&utm_medium=tools&bbs_theme=dark&bbs_theme_device=1#/ys/set';
  } else if (gameKey === GameKey.ZZZ) {
    url = 'https://act.hoyolab.com/app/zzz-game-record/index.html#/zzz';
  }

  return (
    <div className="flex flex-1 flex-col items-center justify-center pb-8 text-center text-sm">
      <h4 className="scroll-m-20 pb-4 text-xl font-semibold tracking-tight">
        {t('popup.need_public_data_title')}
      </h4>
      <div
        dangerouslySetInnerHTML={{
          __html: t('popup.need_public_data', { email: email }),
        }}
      ></div>
      <Button asChild variant="link">
        <a href={url} target="_blank" rel="noopener noreferrer">
          {t('popup.goto_check')}
          <ExternalLinkIcon />
        </a>
      </Button>
    </div>
  );
}

export default withTranslation()(NeedPublicData);
