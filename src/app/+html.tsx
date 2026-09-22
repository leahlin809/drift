import { ScrollViewStyleReset } from 'expo-router/html';
import type { PropsWithChildren } from 'react';

const globalStyles = `
  html, body, #root { width: 100%; height: 100%; margin: 0; }
  body { overflow: hidden; background: #e7eae6; }
  * { box-sizing: border-box; }
  *:focus-visible { outline: 2px solid #356a5a !important; outline-offset: -2px !important; }
  ::selection { color: #ffffff; background: #356a5a; }
  ::-webkit-scrollbar { width: 7px; height: 7px; }
  ::-webkit-scrollbar-thumb { border-radius: 8px; background: rgba(53, 106, 90, 0.35); }
  @media (prefers-color-scheme: dark) {
    body { background: #0b0e0c; }
    *:focus-visible { outline-color: #76a996 !important; }
    ::selection { color: #10231d; background: #76a996; }
  }
`;

export default function Root({ children }: PropsWithChildren) {
  return (
    <html lang="zh-CN">
      <head>
        <meta charSet="utf-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1, viewport-fit=cover" />
        <meta name="theme-color" content="#356A5A" />
        <title>Drift · 所见</title>
        <ScrollViewStyleReset />
        <style dangerouslySetInnerHTML={{ __html: globalStyles }} />
      </head>
      <body>{children}</body>
    </html>
  );
}
