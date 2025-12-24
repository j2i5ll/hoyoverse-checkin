import { Separator } from '@front/external/components/ui/separator';
import GameIcon from '@front/shared/components/GameIcon';
import { GameItemType } from '@src/types';
import { withTranslation, WithTranslation } from 'react-i18next';

type NoSelectedCharacterProps = {
  gameInfo: GameItemType;
  t;
} & WithTranslation;
const NoSelectedCharacter = ({ gameInfo, t }: NoSelectedCharacterProps) => {
  return (
    <div className="flex min-w-[700px] max-w-[1000px] flex-col items-center gap-y-4 rounded-xl border p-6">
      <div className="flex flex-col items-center">
        <GameIcon src={gameInfo.icon} className="w-20 h-20 cursor-default" />
        <h4 className="pt-3 text-xl font-semibold tracking-tight scroll-m-20">
          {t(gameInfo.name)}
        </h4>
      </div>
      <Separator />
      <div className="flex flex-col items-center text-sm text-center gap-y-4">
        <p>
          확장프로그램 팝업의 resource 메뉴에서 캐릭터를 선택한뒤
          <br />
          충전 상태를 알림으로 받아보세요.
        </p>
      </div>
    </div>
  );
};

export default withTranslation()(NoSelectedCharacter);
