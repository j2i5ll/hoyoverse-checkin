import { useTranslation } from 'react-i18next';
import {
  Sliders,
  Languages,
  Palette,
  RotateCcw,
  Sparkles,
  Layers,
  AlertTriangle,
  Info,
} from 'lucide-react';

export type CanvasTheme = 'dark' | 'light' | 'hoyolab';
export type FilterCategory = 'all' | 'register' | 'status' | 'system';

interface PreviewToolbarProps {
  fontSize: number;
  onFontSizeChange: (size: number) => void;
  canvasTheme: CanvasTheme;
  onCanvasThemeChange: (theme: CanvasTheme) => void;
  activeFilter: FilterCategory;
  onFilterChange: (filter: FilterCategory) => void;
  onResetAll: () => void;
  cardCount: number;
}

export function PreviewToolbar({
  fontSize,
  onFontSizeChange,
  canvasTheme,
  onCanvasThemeChange,
  activeFilter,
  onFilterChange,
  onResetAll,
  cardCount,
}: PreviewToolbarProps) {
  const { i18n } = useTranslation();

  const handleLanguageChange = (lng: string) => {
    i18n.changeLanguage(lng);
  };

  const currentLang = i18n.language || 'ko';
  const remMultiplier = (fontSize / 16).toFixed(2);
  const isScaled = fontSize !== 16;

  return (
    <header className="sticky top-0 z-[100] border-b border-slate-800 bg-slate-900/95 px-6 py-3.5 font-sans text-slate-100 shadow-xl backdrop-blur-md">
      <div className="mx-auto flex max-w-7xl flex-col gap-3">
        {/* Top row: Brand + Primary Info + Presets */}
        <div className="flex flex-wrap items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-white text-sm font-bold text-black shadow-md">
              <Sparkles size={16} className="text-black" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h1 className="text-sm font-bold tracking-tight text-white">
                  Content Script Tooltip Dev Showcase
                </h1>
                <span className="rounded-full border border-indigo-500/30 bg-indigo-500/20 px-2 py-0.5 text-[11px] font-semibold text-indigo-300">
                  {cardCount} Cards
                </span>
              </div>
              <p className="text-[11px] text-slate-400">
                실제 Shadow DOM 환경 및 호스트 페이지 rem 오버라이딩 시뮬레이터
              </p>
            </div>
          </div>

          {/* Right controls: Language & Theme & Reset */}
          <div className="flex items-center gap-2.5">
            {/* Language Switcher */}
            <div className="flex items-center gap-1.5 rounded-lg border border-slate-700 bg-slate-800/80 px-2 py-1">
              <Languages size={14} className="shrink-0 text-slate-400" />
              <div className="flex gap-1 text-[11px] font-medium">
                {[
                  { code: 'ko', label: 'KO' },
                  { code: 'en', label: 'EN' },
                  { code: 'ja', label: 'JA' },
                  { code: 'zh_TW', label: '繁中' },
                ].map((lang) => (
                  <button
                    key={lang.code}
                    type="button"
                    onClick={() => handleLanguageChange(lang.code)}
                    className={`rounded px-1.5 py-0.5 transition-colors ${
                      currentLang === lang.code ||
                      (currentLang.startsWith('zh') && lang.code === 'zh_TW')
                        ? 'bg-white font-semibold text-black'
                        : 'text-slate-400 hover:bg-slate-700/60 hover:text-white'
                    }`}
                  >
                    {lang.label}
                  </button>
                ))}
              </div>
            </div>

            {/* Canvas Theme Switcher */}
            <div className="flex items-center gap-1.5 rounded-lg border border-slate-700 bg-slate-800/80 px-2 py-1">
              <Palette size={14} className="shrink-0 text-slate-400" />
              <div className="flex gap-1 text-[11px] font-medium">
                {[
                  { id: 'dark', label: 'Dark' },
                  { id: 'light', label: 'Light' },
                  { id: 'hoyolab', label: 'HoYoLAB' },
                ].map((t) => (
                  <button
                    key={t.id}
                    type="button"
                    onClick={() => onCanvasThemeChange(t.id as CanvasTheme)}
                    className={`rounded px-1.5 py-0.5 transition-colors ${
                      canvasTheme === t.id
                        ? 'bg-white font-semibold text-black'
                        : 'text-slate-400 hover:bg-slate-700/60 hover:text-white'
                    }`}
                  >
                    {t.label}
                  </button>
                ))}
              </div>
            </div>

            {/* Reset Button */}
            <button
              type="button"
              onClick={onResetAll}
              className="flex items-center gap-1 rounded-lg border border-slate-700 bg-slate-800/80 px-2.5 py-1.5 text-[11px] font-medium text-slate-300 transition-colors hover:bg-slate-700 hover:text-white"
              title="모든 닫힌 팝업 초기화"
            >
              <RotateCcw size={12} />
              <span>Reset</span>
            </button>
          </div>
        </div>

        {/* Bottom row: Font-size Scaling Simulator (Key Feature) & Category Filter */}
        <div className="flex flex-wrap items-center justify-between gap-4 border-t border-slate-800/80 pt-2.5">
          {/* Font-size rem bug simulator */}
          <div className="flex items-center gap-3">
            <div className="flex items-center gap-1.5 text-xs font-medium text-slate-300">
              <Sliders size={14} className="text-amber-400" />
              <span>Host HTML font-size:</span>
              <span className="rounded bg-slate-800 px-1.5 py-0.5 font-mono text-xs font-bold text-amber-300">
                {fontSize}px ({remMultiplier}x rem)
              </span>
            </div>

            {/* Slider */}
            <input
              type="range"
              min="14"
              max="120"
              value={fontSize}
              onChange={(e) => onFontSizeChange(Number(e.target.value))}
              className="h-1.5 w-32 cursor-pointer appearance-none rounded-lg bg-slate-700 accent-amber-400"
            />

            {/* Quick Presets */}
            <div className="flex items-center gap-1 text-[11px]">
              <button
                type="button"
                onClick={() => onFontSizeChange(16)}
                className={`rounded border px-2 py-0.5 transition-colors ${
                  fontSize === 16
                    ? 'border-emerald-500 bg-emerald-500/20 font-semibold text-emerald-300'
                    : 'border-slate-700 bg-slate-800 text-slate-400 hover:text-white'
                }`}
              >
                16px (Normal)
              </button>
              <button
                type="button"
                onClick={() => onFontSizeChange(50)}
                className={`rounded border px-2 py-0.5 transition-colors ${
                  fontSize === 50
                    ? 'border-amber-500 bg-amber-500/20 font-semibold text-amber-300'
                    : 'border-slate-700 bg-slate-800 text-slate-400 hover:text-white'
                }`}
              >
                50px (Mobile)
              </button>
              <button
                type="button"
                onClick={() => onFontSizeChange(100)}
                className={`rounded border px-2 py-0.5 transition-colors ${
                  fontSize === 100
                    ? 'border-rose-500 bg-rose-500/20 font-semibold text-rose-300'
                    : 'border-slate-700 bg-slate-800 text-slate-400 hover:text-white'
                }`}
              >
                100px (Extreme)
              </button>
            </div>

            {isScaled && (
              <span className="hidden animate-pulse items-center gap-1 rounded border border-amber-400/20 bg-amber-400/10 px-2 py-0.5 text-[11px] text-amber-400 lg:flex">
                <AlertTriangle size={12} />
                <span>
                  rem scaling active. Cards must retain strict 380px layout!
                </span>
              </span>
            )}
          </div>

          {/* Category Filter */}
          <div className="flex items-center gap-1 rounded-lg border border-slate-700 bg-slate-800/80 p-0.5 text-[11px] font-medium">
            <Layers size={13} className="ml-1.5 mr-0.5 text-slate-400" />
            {[
              { id: 'all', label: 'All' },
              { id: 'register', label: 'Registration' },
              { id: 'status', label: 'Status/Account' },
              { id: 'system', label: 'System/Error' },
            ].map((f) => (
              <button
                key={f.id}
                type="button"
                onClick={() => onFilterChange(f.id as FilterCategory)}
                className={`rounded px-2.5 py-1 transition-colors ${
                  activeFilter === f.id
                    ? 'bg-slate-700 font-semibold text-white'
                    : 'text-slate-400 hover:text-slate-200'
                }`}
              >
                {f.label}
              </button>
            ))}
          </div>
        </div>
      </div>
    </header>
  );
}
