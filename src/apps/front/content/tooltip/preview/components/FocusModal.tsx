import React, { useEffect, useState } from 'react';
import { ShadowDomWrapper } from '../ShadowDomWrapper';
import { ToggleTooltipContext } from '../../provider/toggleTooltip';
import { X, RefreshCw, EyeOff, LayoutTemplate, MapPin } from 'lucide-react';

interface FocusModalProps {
  title: string;
  description: string;
  onClose: () => void;
  children: React.ReactNode;
}

export function FocusModal({
  title,
  description,
  onClose,
  children,
}: FocusModalProps) {
  const [isOpen, setIsOpen] = useState(true);
  const [viewPosition, setViewPosition] = useState<'center' | 'fixed'>('center');

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        onClose();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [onClose]);

  return (
    <div className="fixed inset-0 z-[999999] isolate flex flex-col bg-slate-950/90 backdrop-blur-md duration-200 animate-in fade-in select-none">
      {/* Top Banner */}
      <div className="flex items-center justify-between border-b border-slate-800 bg-slate-900/90 px-6 py-3 shadow-md">
        <div className="flex items-center gap-3">
          <div className="rounded bg-amber-400/20 px-2 py-0.5 text-xs font-bold text-amber-300">
            Focus Mode
          </div>
          <div>
            <h3 className="text-sm font-semibold text-white">{title}</h3>
            <p className="text-xs text-slate-400">{description}</p>
          </div>
        </div>

        <div className="flex items-center gap-3">
          {/* Position Mode Toggle */}
          <div className="flex items-center gap-1 rounded-lg border border-slate-700 bg-slate-800/80 p-0.5 text-[11px] font-medium">
            <button
              type="button"
              onClick={() => setViewPosition('center')}
              className={`flex items-center gap-1 px-2.5 py-1 rounded transition-colors ${
                viewPosition === 'center'
                  ? 'bg-white text-black font-semibold shadow-xs'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              <LayoutTemplate size={12} />
              <span>중앙 정렬</span>
            </button>
            <button
              type="button"
              onClick={() => setViewPosition('fixed')}
              className={`flex items-center gap-1 px-2.5 py-1 rounded transition-colors ${
                viewPosition === 'fixed'
                  ? 'bg-white text-black font-semibold shadow-xs'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              <MapPin size={12} />
              <span>실제 좌측 하단 고정</span>
            </button>
          </div>

          <button
            type="button"
            onClick={onClose}
            className="flex items-center gap-1.5 rounded-lg border border-slate-700 bg-slate-800 px-3 py-1.5 text-xs font-medium text-slate-300 transition-colors hover:bg-slate-700 hover:text-white"
          >
            <X size={14} />
            <span>닫기 (ESC)</span>
          </button>
        </div>
      </div>

      {/* Full Viewport Canvas */}
      <div className="relative h-full w-full flex-1 flex items-center justify-center p-8 overflow-hidden">
        {isOpen ? (
          <ShadowDomWrapper
            mode={viewPosition === 'center' ? 'preview' : 'viewport'}
            className="h-full w-full flex items-center justify-center"
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
          <div className="m-auto h-full flex flex-col items-center justify-center gap-3 text-center">
            <div className="h-12 w-12 rounded-full bg-slate-800 flex items-center justify-center text-slate-400">
              <EyeOff size={20} />
            </div>
            <p className="text-sm text-slate-300 font-medium">
              팝업이 닫혔습니다.
            </p>
            <button
              type="button"
              onClick={() => setIsOpen(true)}
              className="inline-flex items-center gap-1.5 rounded-md bg-white px-4 py-2 text-xs font-semibold text-black hover:bg-slate-200 transition-colors shadow-sm"
            >
              <RefreshCw size={13} />
              <span>팝업 다시 열기</span>
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
