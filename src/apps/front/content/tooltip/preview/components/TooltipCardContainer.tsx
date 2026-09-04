import React, { useState } from 'react';
import { ShadowDomWrapper } from '../ShadowDomWrapper';
import { ToggleTooltipContext } from '../../provider/toggleTooltip';
import { Maximize2, RefreshCw, Eye, EyeOff } from 'lucide-react';

interface TooltipCardContainerProps {
  id: string;
  index: string;
  title: string;
  description: string;
  category: 'register' | 'status' | 'system';
  categoryLabel: string;
  children: React.ReactNode;
  onFocus?: () => void;
  resetKey: number;
}

export function TooltipCardContainer({
  index,
  title,
  description,
  categoryLabel,
  children,
  onFocus,
  resetKey,
}: TooltipCardContainerProps) {
  const [isOpen, setIsOpen] = useState(true);

  // resetKey changes trigger re-opening
  React.useEffect(() => {
    setIsOpen(true);
  }, [resetKey]);

  return (
    <div className="relative isolate flex flex-col overflow-hidden rounded-xl border border-slate-800 bg-slate-900/90 shadow-lg transition-all hover:border-slate-700">
      {/* Card Header */}
      <div className="flex items-center justify-between border-b border-slate-800 bg-slate-950/60 px-4 py-2.5">
        <div className="flex items-center gap-2">
          <span className="font-mono text-xs font-bold text-amber-400">
            {index}
          </span>
          <h2 className="text-xs font-semibold text-slate-200">{title}</h2>
          <span className="rounded bg-slate-800 px-1.5 py-0.5 text-[10px] font-medium text-slate-400">
            {categoryLabel}
          </span>
        </div>

        <div className="flex items-center gap-1">
          {onFocus && (
            <button
              type="button"
              onClick={onFocus}
              className="rounded p-1 text-slate-400 transition-colors hover:bg-slate-800 hover:text-white"
              title="포커스 모드 (전체 화면)"
            >
              <Maximize2 size={13} />
            </button>
          )}
          <button
            type="button"
            onClick={() => setIsOpen((prev) => !prev)}
            className="rounded p-1 text-slate-400 transition-colors hover:bg-slate-800 hover:text-white"
            title={isOpen ? '팝업 숨기기' : '팝업 표시'}
          >
            {isOpen ? (
              <Eye size={13} />
            ) : (
              <EyeOff size={13} className="text-amber-400" />
            )}
          </button>
        </div>
      </div>

      {/* Card Description */}
      <div className="border-b border-slate-800/40 bg-slate-950/30 px-4 py-1.5 text-[11px] text-slate-400">
        {description}
      </div>

      {/* Card Canvas Area: Centered, no awkward fixed clipping */}
      <div className="relative flex min-h-[460px] w-full flex-1 select-none items-center justify-center overflow-x-auto p-4 sm:p-6">
        {isOpen ? (
          <ShadowDomWrapper
            mode="preview"
            className="flex w-full items-center justify-center"
          >
            <ToggleTooltipContext.Provider
              value={{
                isTooltipShow: true,
                setIsTooltipShow: (show: boolean) => {
                  if (!show) {
                    setIsOpen(false);
                  }
                },
              }}
            >
              {children}
            </ToggleTooltipContext.Provider>
          </ShadowDomWrapper>
        ) : (
          <div className="m-auto flex flex-col items-center justify-center gap-2 p-6 text-center">
            <div className="flex h-9 w-9 items-center justify-center rounded-full bg-slate-800 text-slate-400">
              <EyeOff size={16} />
            </div>
            <p className="text-xs font-medium text-slate-400">
              팝업이 닫혔습니다.
            </p>
            <button
              type="button"
              onClick={() => setIsOpen(true)}
              className="inline-flex items-center gap-1.5 rounded-md bg-white px-3 py-1.5 text-xs font-semibold text-black shadow-sm transition-colors hover:bg-slate-200"
            >
              <RefreshCw size={12} />
              <span>다시 열기</span>
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
