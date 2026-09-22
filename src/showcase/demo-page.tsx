import { useEffect, useState } from 'react';

const styles = `
:root{--stage:#e7eae6;--paper:#f7f8f7;--ink:#17201c;--muted:#66706b;--green:#3c6b5b;--line:#cbd3ce}
*{box-sizing:border-box}body{margin:0;overflow:hidden;background:var(--stage);color:var(--ink);font-family:"Segoe UI",sans-serif}::selection{background:var(--green);color:#fff}
.demo-page{position:relative;height:100dvh;display:grid;grid-template-columns:minmax(260px,1fr) minmax(414px,1.25fr);align-items:center;gap:clamp(36px,7vw,112px);padding:24px clamp(28px,7vw,110px)}
.demo-nav{position:fixed;z-index:10;top:0;left:0;right:0;height:64px;display:flex;align-items:center;justify-content:space-between;padding:0 clamp(22px,4vw,58px);background:rgba(231,234,230,.94);border-bottom:1px solid rgba(203,211,206,.86)}
.demo-brand{font-family:Georgia,serif;font-size:clamp(1.05rem,1.5vw,1.35rem);color:var(--ink);text-decoration:none}.back-link{min-height:44px;display:inline-flex;align-items:center;padding:0 16px;border:1px solid var(--line);border-radius:999px;background:var(--paper);color:var(--ink);text-decoration:none}.back-link:hover{border-color:var(--muted)}.back-link:focus-visible{outline:3px solid rgba(60,107,91,.32);outline-offset:3px}
.demo-intro{max-width:410px;padding-top:36px}.demo-intro h1{margin:0;font-family:Georgia,serif;font-size:clamp(3rem,6vw,6rem);font-weight:400;letter-spacing:-.035em;line-height:1.02}.demo-title-line{display:block;white-space:nowrap}.demo-intro p{max-width:34ch;margin:28px 0 0;color:var(--muted);font-size:clamp(1.05rem,1.5vw,1.35rem);line-height:1.7}.demo-meta{display:flex;flex-wrap:wrap;gap:9px;margin-top:28px}.demo-meta span{padding:8px 11px;border-radius:999px;background:var(--mist);color:var(--green);font-size:12px;font-weight:600}
.device-stage{position:relative;display:flex;justify-content:center;padding-top:40px}.device-stage:before{content:"";position:absolute;inset:18% 2%;border-radius:50%;background:var(--mist);transform:rotate(-7deg)}.device{position:relative;width:min(414px,calc((100dvh - 98px)*.462));aspect-ratio:414/896;padding:7px;border-radius:48px;background:var(--ink);box-shadow:0 28px 60px rgba(23,32,28,.2);overflow:hidden}.device:after{content:"";position:absolute;z-index:3;top:18px;left:50%;width:96px;height:27px;transform:translateX(-50%);border-radius:999px;background:var(--ink);pointer-events:none}.device iframe{position:relative;z-index:2;width:100%;height:100%;display:block;border:0;border-radius:41px;background:var(--paper)}.loading{position:absolute;z-index:1;inset:7px;display:grid;place-items:center;border-radius:41px;background:var(--paper);color:var(--muted);font-size:12px}.live{position:absolute;z-index:4;top:86px;left:calc(50% - min(207px,calc((100dvh - 98px)*.231)) - 42px);padding:8px 11px;border:1px solid var(--line);border-radius:999px;background:var(--paper);font-size:12px;font-weight:700;letter-spacing:.08em;text-transform:uppercase}.live:before{content:"";display:inline-block;width:7px;height:7px;margin-right:7px;border-radius:50%;background:var(--green)}
@media(max-width:850px){.demo-page{display:flex;align-items:center;justify-content:center;padding:78px 16px 14px}.demo-intro{display:none}.device-stage{width:100%;padding:0}.device-stage:before{inset:16% 4%}.device{width:min(414px,calc((100dvh - 98px)*.462),calc(100vw - 24px))}.live{top:22px;left:max(0px,calc(50% - min(207px,calc((100dvh - 98px)*.231),calc(50vw - 12px)) - 2px))}}
@media(max-width:520px){.demo-page{padding:64px 0 0}.demo-nav{padding:0 16px}.device-stage{height:calc(100dvh - 64px)}.device{width:100%;height:100%;aspect-ratio:auto;padding:0;border-radius:0;box-shadow:none}.device iframe,.loading{inset:0;border-radius:0}.device:after,.device-stage:before,.live{display:none}}
`;

export function DemoPage() {
  const [ready, setReady] = useState(false);

  useEffect(() => {
    const previousTitle = document.title;
    const previousLanguage = document.documentElement.lang;
    document.title = 'Drift — Interactive Demo';
    document.documentElement.lang = 'en';
    return () => {
      document.title = previousTitle;
      document.documentElement.lang = previousLanguage;
    };
  }, []);

  return <>
    <style>{styles}</style>
    <main className="demo-page">
      <header className="demo-nav">
        <a className="demo-brand" href={`${process.env.EXPO_BASE_URL ?? ''}/demo`}>Drift</a>
        <a className="back-link" href={`${process.env.EXPO_BASE_URL ?? ''}/showcase`}>View case study</a>
      </header>
      <section className="demo-intro" aria-labelledby="demo-title">
        <h1 id="demo-title"><span className="demo-title-line">Explore</span><span className="demo-title-line">Drift.</span></h1>
        <p>A browser-ready product demo. Browse the map, open a country, filter your interests, revisit the library, or capture a new entry.</p>
        <div className="demo-meta" aria-label="Available demo flows"><span>Map</span><span>Library</span><span>Entry Detail</span><span>Add Entry</span></div>
      </section>
      <section className="device-stage" aria-label="Interactive phone demo">
        <span className="live">Interactive</span>
        <div className="device">
          {!ready ? <span className="loading">Loading interactive demo…</span> : null}
          <iframe src={`${process.env.EXPO_BASE_URL ?? ''}/`} title="Drift interactive phone demo" onLoad={() => setReady(true)} />
        </div>
      </section>
    </main>
  </>;
}
