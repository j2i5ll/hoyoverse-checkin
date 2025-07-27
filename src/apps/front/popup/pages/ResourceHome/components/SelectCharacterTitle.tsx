import { WithTranslation, withTranslation } from 'react-i18next';
function SelectCharacterTitle({ t }: WithTranslation) {
  return (
    <div className="flex items-center justify-between">
      <h4 className="scroll-m-20 text-xl font-semibold tracking-tight">
        {t('popup.select_character_title')}
      </h4>
    </div>
  );
}
export default withTranslation()(SelectCharacterTitle);
