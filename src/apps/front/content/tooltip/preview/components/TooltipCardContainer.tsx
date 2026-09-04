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
    <div className="isolate relative flex flex-col rounded-xl border border-slate-800 bg-slate-900/90 shadow-lg overflow-hidden transition-all hover:border-slate-700">
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
              className="p-1 rounded text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
              title="포커스 모드 (전체 화면)"
            >
              <Maximize2 size={13} />
            </button>
          )}
          <button
            type="button"
            onClick={() => setIsOpen((prev) => !prev)}
            className="p-1 rounded text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
            title={isOpen ? '팝업 숨기기' : '팝업 표시'}
          >
            {isOpen ? <Eye size={13} /> : <EyeOff size={13} className="text-amber-400" />}
          </button>
        </div>
      </div>

      {/* Card Description */}
      <div className="px-4 py-1.5 bg-slate-950/30 border-b border-slate-800/40 text-[11px] text-slate-400">
        {description}
      </div>

      {/* Card Canvas Area: Centered, no awkward fixed clipping */}
      <div className="relative flex-1 min-h-[460px] w-full p-4 sm:p-6 flex items-center justify-center select-none overflow-x-auto">
        {isOpen ? (
          <ShadowDomWrapper mode="preview" className="w-full flex items-center justify-center">
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
          <div className="m-auto flex flex-col items-center justify-center gap-2 text-center p-6">
            <div className="h-9 w-9 rounded-full bg-slate-800 flex items-center justify-center text-slate-400">
              <EyeOff size={16} />
            </div>
            <p className="text-xs text-slate-400 font-medium">
              팝업이 닫혔습니다.
            </p>
            <button
              type="button"
              onClick={() => setIsOpen(true)}
              className="inline-flex items-center gap-1.5 rounded-md bg-white px-3 py-1.5 text-xs font-semibold text-black hover:bg-slate-200 transition-colors shadow-sm"
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
