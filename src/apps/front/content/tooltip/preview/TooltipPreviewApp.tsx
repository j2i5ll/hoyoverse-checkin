import { useState, useEffect } from 'react';
import {
  PreviewToolbar,
  CanvasTheme,
  FilterCategory,
} from './components/PreviewToolbar';
import { TooltipCardContainer } from './components/TooltipCardContainer';
import { FocusModal } from './components/FocusModal';
import {
  mockEmail,
  mockGameRoles,
  mockRegisteredKeys,
  mockAllRegisteredKeys,
  mockLtuid,
} from './mockData';

// Content script components to preview
import RegistrationPrompt from '../components/RegistrationPrompt';
import LogoutUserTooltip from '../components/LogoutUserTooltip';
import SelectGameAccountCard from '../components/tooltip-body/SelectGameAccountCard';
import AddedAccountCard from '../components/tooltip-body/AddedAccountCard';
import NotSupportedCard from '../components/tooltip-body/NotSupportedCard';
import ErrorFallback from '../components/ErrorFallback';
import TooltipLayout from '../components/TooltipLayer';
import { Loader2 } from 'lucide-react';
import { useTranslation } from 'react-i18next';

export function TooltipPreviewApp() {
  const { t } = useTranslation();
  const [fontSize, setFontSize] = useState<number>(16);
  const [canvasTheme, setCanvasTheme] = useState<CanvasTheme>('dark');
  const [activeFilter, setActiveFilter] = useState<FilterCategory>('all');
  const [resetKey, setResetKey] = useState<number>(0);
  const [focusCardId, setFocusCardId] = useState<string | null>(null);

  // Dynamic host html font-size injection for rem stress testing
  useEffect(() => {
    document.documentElement.style.fontSize = `${fontSize}px`;
    return () => {
      document.documentElement.style.fontSize = '';
    };
  }, [fontSize]);

  const cards = [
    {
      id: 'registration-prompt',
      index: '01',
      title: 'RegistrationPrompt',
      description:
        '출석체크 웹페이지 방문 시 미등록 사용자에게 표시되는 자동 출석 등록 유도 팝업',
      category: 'register' as const,
      categoryLabel: '등록 유도',
      render: () => <RegistrationPrompt />,
    },
    {
      id: 'logout-user-tooltip',
      index: '02',
      title: 'LogoutUserTooltip',
      description:
        'HoYoLAB 공식 사이트에 로그인되어 있지 않은 사용자에게 표시되는 로그인 안내 팝업',
      category: 'status' as const,
      categoryLabel: '로그인 필요',
      render: () => <LogoutUserTooltip />,
    },
    {
      id: 'select-game-account-card',
      index: '03',
      title: 'SelectGameAccountCard (다중 계정)',
      description:
        '로그인된 계정의 원신, 스타레일, ZZZ, 붕괴3rd 캐릭터 조회 및 일괄 등록 팝업',
      category: 'register' as const,
      categoryLabel: '계정 선택',
      render: () => (
        <SelectGameAccountCard
          email={mockEmail}
          roles={mockGameRoles}
          registeredKeys={mockRegisteredKeys}
          ltuid={mockLtuid}
          onRegister={(selectedActIds) => {
            alert(
              `선택된 게임 ActId (${selectedActIds.length}개): ` +
                selectedActIds.join(', '),
            );
          }}
        />
      ),
    },
    {
      id: 'select-game-account-loading',
      index: '04',
      title: 'SelectGameAccountCard (등록 중)',
      description:
        '선택한 계정 등록 버튼 클릭 후 API 호출 중인 로딩 및 비활성화 상태',
      category: 'register' as const,
      categoryLabel: '등록 진행 중',
      render: () => (
        <SelectGameAccountCard
          email={mockEmail}
          roles={mockGameRoles}
          registeredKeys={mockRegisteredKeys}
          ltuid={mockLtuid}
          onRegister={() => {}}
          isLoading={true}
        />
      ),
    },
    {
      id: 'added-account-multiple',
      index: '05',
      title: 'AddedAccountCard (복수 3개 등록 완료)',
      description:
        '복수 게임 계정 등록 완료 시 즉시 1회 자동 스크랩 및 출석체크 알림 안내',
      category: 'register' as const,
      categoryLabel: '등록 완료',
      render: () => <AddedAccountCard count={3} />,
    },
    {
      id: 'added-account-single',
      index: '06',
      title: 'AddedAccountCard (단일 1개 등록 완료)',
      description: '단일 게임 계정 등록 성공 시 표시되는 완료 안내',
      category: 'register' as const,
      categoryLabel: '등록 완료',
      render: () => <AddedAccountCard count={1} />,
    },
    {
      id: 'select-game-account-all-registered',
      index: '07',
      title: 'SelectGameAccountCard (전체 등록 완료)',
      description:
        '로그인된 계정의 모든 지원 게임이 이미 등록되어 있을 때 표시되는 안내 팝업',
      category: 'status' as const,
      categoryLabel: '이미 등록됨',
      render: () => (
        <SelectGameAccountCard
          email={mockEmail}
          roles={mockGameRoles}
          registeredKeys={mockAllRegisteredKeys}
          ltuid={mockLtuid}
          onRegister={() => {}}
        />
      ),
    },
    {
      id: 'not-supported-card',
      index: '08',
      title: 'NotSupportedCard',
      description:
        '호요버스 출석체크 지원 대상이 아닌 게임 페이지 접속 시 안내 팝업',
      category: 'system' as const,
      categoryLabel: '미지원 게임',
      render: () => <NotSupportedCard />,
    },
    {
      id: 'checking-status-loader',
      index: '09',
      title: 'Checking Status (로딩)',
      description:
        '페이지 진입 시 계정 로그인 여부 및 게임 역할 정보를 불러오는 스피너 상태',
      category: 'status' as const,
      categoryLabel: '상태 조회 중',
      render: () => (
        <TooltipLayout
          content={
            <div className="flex items-center gap-[10px] py-[6px]">
              <Loader2
                size={16}
                className="h-[16px] w-[16px] shrink-0 animate-spin text-foreground"
                strokeWidth={2.2}
              />
              <span className="text-[12px] font-medium leading-[16px] text-foreground">
                {t(
                  'content.checking_account_status',
                  '계정 상태를 확인 중입니다...',
                )}
              </span>
            </div>
          }
        />
      ),
    },
    {
      id: 'error-fallback',
      index: '10',
      title: 'ErrorFallback',
      description: '네트워크 장애 또는 API 요청 실패 시 표시되는 에러 폴백 UI',
      category: 'system' as const,
      categoryLabel: '오류 발생',
      render: () => (
        <ErrorFallback
          error={
            new Error(
              '네트워크 연결 상태를 확인해주세요. 잠시 후 다시 시도해주세요.',
            )
          }
        />
      ),
    },
  ];

  const filteredCards = cards.filter((c) => {
    if (activeFilter === 'all') return true;
    return c.category === activeFilter;
  });

  const focusedCard = cards.find((c) => c.id === focusCardId);

  // Background style based on canvas theme
  const getCanvasBackground = () => {
    switch (canvasTheme) {
      case 'light':
        return 'bg-slate-100 text-slate-900';
      case 'hoyolab':
        return 'bg-gradient-to-br from-[#121629] via-[#1a1e36] to-[#0f111d] text-slate-100';
      case 'dark':
      default:
        return 'bg-slate-950 text-slate-100';
    }
  };

  return (
    <div
      className={`flex min-h-screen flex-col ${getCanvasBackground()} font-sans selection:bg-neutral-700 selection:text-white`}
    >
      <PreviewToolbar
        fontSize={fontSize}
        onFontSizeChange={setFontSize}
        canvasTheme={canvasTheme}
        onCanvasThemeChange={setCanvasTheme}
        activeFilter={activeFilter}
        onFilterChange={setActiveFilter}
        onResetAll={() => setResetKey((k) => k + 1)}
        cardCount={filteredCards.length}
      />

      <main className="mx-auto w-full max-w-[1720px] flex-1 p-6 md:p-8">
        {/* Gallery Grid: auto-fit with min 420px width ensures 380px tooltips never get cramped */}
        <div className="grid grid-cols-[repeat(auto-fit,minmax(min(100%,420px),1fr))] gap-6">
          {filteredCards.map((card) => (
            <TooltipCardContainer
              key={`${card.id}-${resetKey}`}
              id={card.id}
              index={card.index}
              title={card.title}
              description={card.description}
              category={card.category}
              categoryLabel={card.categoryLabel}
              onFocus={() => setFocusCardId(card.id)}
              resetKey={resetKey}
            >
              {card.render()}
            </TooltipCardContainer>
          ))}
        </div>
      </main>

      {/* Focus Modal if open */}
      {focusedCard && (
        <FocusModal
          title={focusedCard.title}
          description={focusedCard.description}
          onClose={() => setFocusCardId(null)}
        >
          {focusedCard.render()}
        </FocusModal>
      )}
    </div>
  );
}
