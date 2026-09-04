/* Hallmark · component: select-game-account-card · genre: modern-minimal · theme: monochrome
 * states: default · hover · focus · active · disabled · loading
 * contrast: pass (46–50)
 */

import { useState, useMemo, useEffect } from 'react';
import { WithTranslation, withTranslation } from 'react-i18next';
import TooltipLayout from '@front/content/tooltip/components/TooltipLayer';
import TooltipFooter from '../tooltip-footer';
import { GameRoleType } from '@src/types';
import {
  gameIdToActId,
  getGameInfoByGameId,
} from '@src/shared/utils/gameMapping';
import { ga } from '@src/shared/ga';
import { Check, CheckCircle2, AlertCircle, User } from 'lucide-react';

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

  const availableActIds = useMemo(
    () =>
      rolesWithActId
        .filter((role) => !isRegistered(role.actId))
        .map((role) => role.actId),
    [rolesWithActId, registeredKeys, ltuid],
  );

  const [selectedActIds, setSelectedActIds] = useState<Set<string>>(
    () => new Set(availableActIds),
  );

  // Sync if available accounts load after mount
  useEffect(() => {
    if (availableActIds.length > 0 && selectedActIds.size === 0) {
      setSelectedActIds(new Set(availableActIds));
    }
  }, [availableActIds]);

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

  const handleSelectAll = () => {
    setSelectedActIds(new Set(availableActIds));
  };

  const handleDeselectAll = () => {
    setSelectedActIds(new Set());
  };

  const handleRegister = () => {
    onRegister(Array.from(selectedActIds));
    for (const actId of selectedActIds) {
      ga.fireEvent('click_계정등록', { act_id: actId });
    }
  };

  useEffect(() => {
    if (allRegistered) {
      ga.fireEvent('view_이미등록', {
        act_ids: rolesWithActId.map((r) => r.actId).join(','),
      });
    } else {
      ga.fireEvent('view_계정등록', {
        act_ids: rolesWithActId.map((r) => r.actId).join(','),
      });
    }
  }, []);

  if (rolesWithActId.length === 0) {
    return (
      <TooltipLayout
        content={
          <div className="flex flex-col items-center py-[8px] text-center">
            <div className="shadow-xs mb-[10px] flex h-[36px] w-[36px] items-center justify-center rounded-[10px] bg-muted text-muted-foreground">
              <AlertCircle
                size={18}
                className="h-[18px] w-[18px] shrink-0"
                strokeWidth={2}
              />
            </div>
            <h3 className="text-[13px] font-semibold leading-[18px] text-foreground">
              {t('content.no_available_games', '등록 가능한 게임이 없습니다.')}
            </h3>
            <p className="mt-[4px] text-[11px] leading-[15px] text-muted-foreground">
              {t('common.no_character', '게임 내에 캐릭터가 없습니다.')}
            </p>
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
          <div className="flex flex-col items-center py-[8px] text-center">
            <div className="shadow-xs mb-[10px] flex h-[36px] w-[36px] items-center justify-center rounded-[10px] bg-foreground text-background">
              <CheckCircle2
                size={18}
                className="h-[18px] w-[18px] shrink-0"
                strokeWidth={2.2}
              />
            </div>
            <h3 className="text-[13px] font-semibold leading-[18px] text-foreground">
              {t(
                'content.all_accounts_registered',
                '로그인한 계정의 모든 게임 계정이 이미 등록되어 있습니다.',
              )}
            </h3>
            <p className="mt-[4px] text-[11px] leading-[15px] text-muted-foreground">
              {t(
                'content.check_automatically_in_browser',
                '브라우저에서 자동으로 출첵을 수행합니다.',
              )}
            </p>
          </div>
        }
        footer={<TooltipFooter />}
      />
    );
  }

  const isAllSelected =
    availableActIds.length > 0 &&
    availableActIds.every((actId) => selectedActIds.has(actId));

  return (
    <TooltipLayout
      content={
        <div className="flex flex-col gap-[10px]">
          {/* Email user identifier & instruction */}
          <div className="flex flex-col gap-[6px]">
            <div className="flex items-center gap-[6px] rounded-[6px] border border-border/60 bg-muted/40 px-[8px] py-[4px] text-[11px] leading-[14px] text-muted-foreground">
              <User
                size={12}
                className="h-[12px] w-[12px] shrink-0 text-foreground"
              />
              <span className="truncate font-mono font-medium text-foreground">
                {email}
              </span>
            </div>
            <p className="text-[12px] leading-[16px] text-muted-foreground">
              {t(
                'content.registration_guide_desc',
                '출석 체크를 진행할 게임 캐릭터를 선택해 주세요.',
              )}
            </p>
          </div>

          {/* Quick Select Bar (when multiple available) */}
          {availableActIds.length > 1 && (
            <div className="flex items-center justify-between border-t border-border/40 pt-[6px] text-[11px] leading-[14px]">
              <span className="font-medium text-muted-foreground">
                {selectedActIds.size}/{availableActIds.length}{' '}
                {t('common.register_selected', '선택')}
              </span>
              <div className="flex items-center gap-[8px]">
                {isAllSelected ? (
                  <button
                    type="button"
                    onClick={handleDeselectAll}
                    className="cursor-pointer font-medium text-muted-foreground transition-colors hover:text-foreground"
                  >
                    {t('content.deselect_all', '선택 해제')}
                  </button>
                ) : (
                  <button
                    type="button"
                    onClick={handleSelectAll}
                    className="cursor-pointer font-medium text-foreground transition-colors hover:underline"
                  >
                    {t('content.select_all', '전체 선택')}
                  </button>
                )}
              </div>
            </div>
          )}

          {/* Roles Selection List */}
          <div className="flex max-h-[200px] flex-col gap-[6px] overflow-y-auto pr-[4px]">
            {rolesWithActId.map((role) => {
              const registered = isRegistered(role.actId);
              const selected = selectedActIds.has(role.actId);

              return (
                <div
                  key={`${role.actId}_${role.gameRoleId}`}
                  role={registered ? undefined : 'checkbox'}
                  aria-checked={registered ? undefined : selected}
                  tabIndex={registered ? -1 : 0}
                  onKeyDown={(e) => {
                    if (!registered && (e.key === ' ' || e.key === 'Enter')) {
                      e.preventDefault();
                      toggleAccount(role.actId);
                    }
                  }}
                  onClick={() => toggleAccount(role.actId)}
                  className={`group flex select-none items-center gap-[10px] rounded-[8px] border p-[8px] transition-all ${
                    registered
                      ? 'cursor-default border-border/40 bg-muted/20 opacity-60'
                      : selected
                        ? 'shadow-xs cursor-pointer border-foreground bg-muted/30'
                        : 'cursor-pointer border-border/80 bg-background hover:border-foreground/40 hover:bg-muted/10'
                  }`}
                >
                  {/* High contrast checkbox */}
                  <div
                    className={`flex h-[18px] w-[18px] shrink-0 items-center justify-center rounded-[4px] border transition-all ${
                      registered
                        ? 'border-border/60 bg-muted text-muted-foreground'
                        : selected
                          ? 'border-foreground bg-foreground text-background'
                          : 'border-border/80 bg-background group-hover:border-foreground/60'
                    }`}
                  >
                    {registered ? (
                      <Check
                        size={11}
                        className="h-[11px] w-[11px] shrink-0"
                        strokeWidth={2.5}
                      />
                    ) : selected ? (
                      <Check
                        size={11}
                        className="h-[11px] w-[11px] shrink-0"
                        strokeWidth={3}
                      />
                    ) : null}
                  </div>

                  {/* Game Icon */}
                  {role.gameInfo?.icon && (
                    <img
                      src={role.gameInfo.icon}
                      alt={role.gameName}
                      className="h-[28px] w-[28px] shrink-0 rounded-[6px] border border-border/60 object-cover"
                    />
                  )}

                  {/* Nickname & Game Info */}
                  <div className="flex min-w-0 flex-1 flex-col">
                    <span className="truncate text-[12px] font-semibold leading-[16px] text-foreground">
                      {role.nickname}
                    </span>
                    <div className="flex items-center gap-[4px] truncate text-[11px] leading-[14px] text-muted-foreground">
                      <span>
                        {role.gameInfo ? t(role.gameInfo.name) : role.gameName}
                      </span>
                      <span className="text-border">•</span>
                      <span>Lv.{role.level}</span>
                      <span className="text-border">•</span>
                      <span className="truncate">{role.regionName}</span>
                    </div>
                  </div>

                  {/* Registered indicator badge */}
                  {registered && (
                    <span className="shrink-0 rounded-full border border-border/60 bg-muted px-[6px] py-[2px] text-[10px] font-medium leading-[12px] text-muted-foreground">
                      {t('content.already_registered', '등록됨')}
                    </span>
                  )}
                </div>
              );
            })}
          </div>
        </div>
      }
      footer={
        <TooltipFooter
          confirmText={
            isLoading
              ? `${t('content.checking_account_status', '확인 중')}...`
              : `${t('common.register_selected', '선택 등록')} (${selectedActIds.size})`
          }
          onConfirm={handleRegister}
          confirmDisabled={selectedActIds.size === 0 || isLoading}
          isLoading={isLoading}
        />
      }
    />
  );
}

export default withTranslation()(SelectGameAccountCard);
