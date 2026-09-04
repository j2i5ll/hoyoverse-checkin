import React, { useEffect, useRef, useState } from 'react';
import { createPortal } from 'react-dom';
import globalInjectedStyle from '@front/external/assets/global.css?inline';

interface ShadowDomWrapperProps {
  children: React.ReactNode;
  className?: string;
  style?: React.CSSProperties;
  mode?: 'preview' | 'viewport';
}

const baseResetStyle = `
  :host, #shadow-root {
    font-size: 14px !important;
    line-height: 1.5 !important;
    font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Arial, sans-serif !important;
    text-align: left !important;
    direction: ltr !important;
    writing-mode: horizontal-tb !important;
    letter-spacing: normal !important;
  }
  #shadow-root * {
    box-sizing: border-box !important;
    writing-mode: horizontal-tb !important;
  }
`;

const previewModeStyle = `
  :host {
    display: flex !important;
    width: 100% !important;
    height: 100% !important;
    align-items: center !important;
    justify-content: center !important;
  }
  #shadow-root {
    display: flex !important;
    align-items: center !important;
    justify-content: center !important;
    width: 100% !important;
    min-height: 100% !important;
    padding: 16px !important;
    box-sizing: border-box !important;
  }
  /* In preview mode, neutralize fixed positioning & z-index so tooltip centers neatly inside card frame */
  #shadow-root > div {
    position: relative !important;
    z-index: 1 !important;
    bottom: auto !important;
    left: auto !important;
    margin: auto !important;
    max-width: 100% !important;
  }
`;

export function ShadowDomWrapper({
  children,
  className,
  style,
  mode = 'preview',
}: ShadowDomWrapperProps) {
  const hostRef = useRef<HTMLDivElement>(null);
  const [container, setContainer] = useState<HTMLDivElement | null>(null);
  const styleElRef = useRef<HTMLStyleElement | null>(null);

  useEffect(() => {
    if (!hostRef.current) return;

    let shadowRoot = hostRef.current.shadowRoot;
    let rootDiv: HTMLDivElement;

    if (!shadowRoot) {
      shadowRoot = hostRef.current.attachShadow({ mode: 'open' });

      const styleEl = document.createElement('style');
      styleElRef.current = styleEl;
      shadowRoot.appendChild(styleEl);

      rootDiv = document.createElement('div');
      rootDiv.id = 'shadow-root';
      shadowRoot.appendChild(rootDiv);
    } else {
      rootDiv = shadowRoot.getElementById('shadow-root') as HTMLDivElement;
      styleElRef.current = shadowRoot.querySelector('style');
    }

    setContainer(rootDiv);
  }, []);

  // Update styles whenever mode changes
  useEffect(() => {
    if (!styleElRef.current) return;
    const modeCss = mode === 'preview' ? previewModeStyle : '';
    styleElRef.current.textContent =
      baseResetStyle + '\n' + modeCss + '\n' + globalInjectedStyle;
  }, [mode]);

  return (
    <div ref={hostRef} className={className} style={style}>
      {container && createPortal(children, container)}
    </div>
  );
}
