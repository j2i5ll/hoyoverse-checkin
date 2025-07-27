import { NotificationButton } from '@front/popup/components/NotificationButton';
import { APP_NAME } from '@src/shared/constants/text';
import { Settings } from 'lucide-react';
const PopupHeader = () => {
  const goToOption = () => chrome.runtime.openOptionsPage();
  return (
    <>
      <div className="box-border flex items-center justify-between w-full pl-3 pr-3 text-xl font-bold min-h-14">
        <h3 className="text-2xl font-semibold tracking-tight scroll-m-20">
          {APP_NAME}
        </h3>
        <div className="flex items-center gap-2">
          <NotificationButton />
          <Settings className="cursor-pointer" onClick={goToOption} />
        </div>
      </div>
    </>
  );
};
export default PopupHeader;
