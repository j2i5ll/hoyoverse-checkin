import { useState, useMemo } from 'react';
import { WithTranslation, withTranslation } from 'react-i18next';
import TooltipLayout from '@front/content/tooltip/components/TooltipLayer';
import TooltipFooter from '../tooltip-footer';
import { GameRoleType } from '@src/types';
import { gameIdToActId, getGameInfoByGameId } from '@src/shared/utils/gameMapping';

interface SelectGameAccountCardProps extends WithTranslation {
  email: string;
  roles: GameRoleType[];
  registeredKeys: Set<string>;
  ltuid: string;
  onRegister: (selectedActIds: string[]) => void;
  isLoading?: boolean;
}

function SelectGameAccountCard({
  email,
  roles,
  registeredKeys,
  ltuid,
  onRegister,
  isLoading,
  t,
}: SelectGameAccountCardProps) {
  const [selectedActIds, setSelectedActIds] = useState<Set<string>>(new Set());

  const rolesWithActId = useMemo(
    () =>
      roles
        .map((role) => ({
          ...role,
          actId: gameIdToActId(role.gameId),
          gameInfo: getGameInfoByGameId(role.gameId),
        }))
        .filter(
          (role): role is typeof role & { actId: string } => !!role.actId,
        ),
    [roles],
  );

  const isRegistered = (actId: string) =>
    registeredKeys.has(`${actId}_${ltuid}`);

  const allRegistered =
    rolesWithActId.length > 0 &&
    rolesWithActId.every((role) => isRegistered(role.actId));

  const toggleAccount = (actId: string) => {
    if (isRegistered(actId)) return;
    setSelectedActIds((prev) => {
      const next = new Set(prev);
      if (next.has(actId)) {
        next.delete(actId);
      } else {
        next.add(actId);
      }
      return next;
    });
  };

  const handleRegister = () => {
    onRegister(Array.from(selectedActIds));
  };

  if (rolesWithActId.length === 0) {
    return (
      <TooltipLayout
        content={
          <div className="description">
            {t('content.no_available_games')}
          </div>
        }
        footer={<TooltipFooter />}
      />
    );
  }

  if (allRegistered) {
    return (
      <TooltipLayout
        content={
          <div className="description">
            {t('content.all_accounts_registered')}
          </div>
        }
        footer={<TooltipFooter />}
      />
    );
  }

  return (
    <TooltipLayout
      content={
        <div className="flex flex-col gap-y-[12px]">
          <div
            dangerouslySetInnerHTML={{
              __html: t('content.select_game_accounts', { email }),
            }}
          />
          <div className="flex max-h-[240px] flex-col gap-y-[8px] overflow-y-auto">
            {rolesWithActId.map((role) => {
              const registered = isRegistered(role.actId);
              const selected = selectedActIds.has(role.actId);
              return (
                <label
                  key={`${role.actId}_${role.gameRoleId}`}
                  className={`flex cursor-pointer items-center gap-x-[12px] rounded-[8px] border p-[10px] transition-colors ${
                    registered
                      ? 'cursor-default border-muted opacity-50'
                      : selected
                        ? 'border-primary bg-primary/5'
                        : 'border-border hover:border-primary/50'
                  }`}
                  onClick={(e) => {
                    e.preventDefault();
                    toggleAccount(role.actId);
                  }}
                >
                  <div className="flex h-[20px] w-[20px] shrink-0 items-center justify-center rounded-[4px] border border-current">
                    {registered ? (
                      <span className="text-[12px] text-muted-foreground">
                        -
                      </span>
                    ) : selected ? (
                      <span className="text-[12px]">✓</span>
                    ) : null}
                  </div>
                  {role.gameInfo?.icon && (
                    <img
                      src={role.gameInfo.icon}
                      alt={role.gameName}
                      className="h-[28px] w-[28px] shrink-0 rounded-[4px]"
                    />
                  )}
                  <div className="flex min-w-0 flex-1 flex-col">
                    <span className="truncate text-[14px] font-medium">
                      {role.nickname}
                    </span>
                    <span className="text-[12px] text-muted-foreground">
                      {role.gameInfo ? t(role.gameInfo.name) : role.gameName} · Lv.{role.level} · {role.regionName}
                    </span>
                  </div>
                  {registered && (
                    <span className="shrink-0 rounded-[4px] bg-muted px-[6px] py-[2px] text-[11px] text-muted-foreground">
                      {t('content.already_registered')}
                    </span>
                  )}
                </label>
              );
            })}
          </div>
        </div>
      }
      footer={
        <TooltipFooter
          confirmText={
            isLoading
              ? `${t('content.checking_account_status')}...`
              : `${t('common.register_selected')} (${selectedActIds.size})`
          }
          onConfirm={handleRegister}
          confirmDisabled={selectedActIds.size === 0 || isLoading}
        />
      }
    />
  );
}

export default withTranslation()(SelectGameAccountCard);
