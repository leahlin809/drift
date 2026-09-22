import { useEffect, useRef, useState } from 'react';

const sections = [
  { id: 'cover', label: 'Drift' },
  { id: 'problem', label: 'Why' },
  { id: 'concept', label: 'Model' },
  { id: 'experience', label: 'Flow' },
  { id: 'principles', label: 'Design' },
  { id: 'decisions', label: 'Build' },
  { id: 'roadmap', label: 'Next' },
] as const;

function assetUri(source: unknown) {
  if (typeof source === 'string') return source;
  if (source && typeof source === 'object') {
    const asset = source as { uri?: unknown; default?: unknown };
    if (typeof asset.uri === 'string') return asset.uri;
    if (typeof asset.default === 'string') return asset.default;
    if (asset.default && typeof asset.default === 'object') {
      const nested = asset.default as { uri?: unknown };
      if (typeof nested.uri === 'string') return nested.uri;
    }
  }
  return '';
}

const captures = {
  map: assetUri(require('../../promo-video/public/assets/map-home-v2.png')),
  detail: assetUri(require('../../promo-video/public/assets/entry-detail-v2.png')),
  library: assetUri(require('../../promo-video/public/assets/library-v3.png')),
  add: assetUri(require('../../promo-video/public/assets/add-entry-v2.png')),
  picker: assetUri(require('../../promo-video/public/assets/location-picker-v2.png')),
};

const geoLevels = [
  { kind: 'point', label: 'Point', example: '39.9042° N · 116.4074° E', note: 'Exact coordinate' },
  { kind: 'city', label: 'City', example: 'Beijing', note: 'Urban context' },
  { kind: 'region', label: 'Region', example: 'North China Plain', note: 'Cultural region' },
  { kind: 'country', label: 'Country', example: 'China', note: 'National context' },
] as const;

const styles = `
:root{--paper:#f4f6f3;--white:#fcfdfc;--ink:#17201c;--muted:#66706b;--green:#3c6b5b;--mist:#dde7e1;--line:#cdd6d1;--warm:#ece9e2}
*{box-sizing:border-box}html{scroll-behavior:smooth}body{margin:0;background:var(--paper);color:var(--ink);overflow:hidden;font-family:"Segoe UI","PingFang SC","Microsoft YaHei",sans-serif}button,a{font:inherit}button{color:inherit}::selection{background:var(--green);color:#fff}::-webkit-scrollbar{width:8px}::-webkit-scrollbar-track{background:var(--paper)}::-webkit-scrollbar-thumb{background:#aebbb4;border-radius:8px}
.showcase{height:100dvh;overflow-y:auto;scroll-snap-type:y mandatory;background:var(--paper);accent-color:var(--green)}
.showcase:focus{outline:none}.section{position:relative;min-height:100dvh;scroll-snap-align:start;display:flex;align-items:center;padding:clamp(72px,8vw,128px) clamp(28px,8vw,132px);overflow:hidden;border-bottom:1px solid var(--line)}
.section-inner{width:min(1240px,100%);margin:0 auto}.display{margin:0;font-family:Georgia,"Noto Serif SC","Songti SC",serif;font-weight:400;letter-spacing:-.03em;line-height:.94;text-wrap:balance}.display-xl{font-size:clamp(4rem,8.6vw,8.2rem)}.slogan-title{font-size:clamp(2.625rem,3.35vw,3.35rem);line-height:1.02;letter-spacing:-.035em;text-wrap:nowrap}.slogan-line{display:block;white-space:nowrap}.flow-title{font-size:clamp(3rem,5vw,5.25rem);line-height:1.02}.flow-title .slogan-line{display:inline}.lead{max-width:660px;margin:28px 0 0;font-size:clamp(1.05rem,1.5vw,1.35rem);line-height:1.75;color:#3e4944}.muted{color:var(--muted)}
.topbar{position:fixed;z-index:50;top:0;left:0;right:0;height:64px;display:flex;align-items:center;justify-content:space-between;padding:0 clamp(24px,4vw,64px);background:rgba(244,246,243,.94);border-bottom:1px solid rgba(205,214,209,.8)}.brand{font-family:Georgia,"Noto Serif SC",serif;font-size:18px;text-decoration:none;color:var(--ink)}.top-actions{display:flex;align-items:center;gap:10px}.button{min-height:44px;display:inline-flex;align-items:center;justify-content:center;gap:8px;padding:0 17px;border:1px solid var(--line);border-radius:999px;background:var(--white);color:var(--ink);text-decoration:none;cursor:pointer;transition:border-color .2s ease,background .2s ease}.button:hover{border-color:#87988f}.button-primary{background:var(--green);border-color:var(--green);color:#fff}.button-primary:hover{background:#315b4d;border-color:#315b4d}.icon-button{width:44px;padding:0}.button:focus-visible,.rail-button:focus-visible,.flow-card:focus-visible{outline:3px solid rgba(60,107,91,.32);outline-offset:3px}
.rail{position:fixed;z-index:45;right:5px;top:50%;transform:translateY(-50%);display:flex;flex-direction:column}.rail-button{position:relative;width:44px;height:44px;padding:0;border:0;background:transparent;cursor:pointer}.rail-button:before{content:"";position:absolute;left:19px;top:11px;width:6px;height:22px;border:1px solid #87948d;border-radius:6px;transform:scaleY(.34);transition:transform .25s ease,background .25s ease}.rail-button[aria-current=true]:before{transform:scaleY(1);background:var(--green);border-color:var(--green)}
.cover-grid{display:grid;grid-template-columns:minmax(0,1.08fr) minmax(330px,.72fr);gap:clamp(48px,8vw,126px);align-items:center}.cover-title-en{display:block}.cover-title-subtitle{display:block;margin-top:12px;color:var(--green);font-family:"Aptos Narrow","Segoe UI",sans-serif;font-size:.13em;font-weight:700;letter-spacing:.15em;line-height:1.25;text-transform:uppercase}.cover-title-cn{display:block;margin-top:26px;font-size:.28em;letter-spacing:.02em;line-height:1.25}.cover-copy{max-width:600px;margin:32px 0 34px;font-size:clamp(1.15rem,1.6vw,1.45rem);line-height:1.7}.cover-actions{display:flex;flex-wrap:wrap;gap:12px}.phone-stage{position:relative;display:flex;justify-content:center}.phone-stage:before{content:"";position:absolute;inset:14% -8%;border-radius:50%;background:var(--mist);transform:rotate(-8deg)}.live-label{position:absolute;z-index:3;left:-4px;top:74px;padding:8px 11px;background:var(--paper);border:1px solid var(--line);border-radius:999px;font-size:11px;font-weight:700;letter-spacing:.08em;text-transform:uppercase}.live-label:before{content:"";display:inline-block;width:7px;height:7px;margin-right:7px;border-radius:50%;background:var(--green)}.phone{position:relative;z-index:2;width:min(360px,76vw);aspect-ratio:414/896;padding:7px;border-radius:48px;background:#151916;box-shadow:0 28px 60px rgba(23,32,28,.18)}.phone:after{content:"";position:absolute;z-index:5;top:18px;left:50%;width:92px;height:25px;transform:translateX(-50%);border-radius:18px;background:#121512;pointer-events:none}.phone iframe{width:100%;height:100%;border:0;border-radius:41px;background:#f7f8f7}
.problem-grid{display:grid;grid-template-columns:.8fr 1.2fr;gap:clamp(64px,10vw,170px);align-items:start}.comparison{border-top:1px solid var(--ink)}.comparison-row{display:grid;grid-template-columns:180px 1fr;gap:24px;padding:25px 0;border-bottom:1px solid var(--line)}.comparison-row strong{font-family:Georgia,"Noto Serif SC",serif;font-size:1.15rem;font-weight:400}.comparison-row p{margin:0;color:var(--muted);line-height:1.7}.statement{grid-column:2;margin:58px 0 0;font-family:Georgia,"Noto Serif SC",serif;font-size:clamp(1.65rem,3vw,3.1rem);line-height:1.35;letter-spacing:-.02em}
.concept-grid{display:grid;grid-template-columns:.82fr 1.18fr;gap:clamp(54px,9vw,150px);align-items:center}.object-list{display:flex;flex-wrap:wrap;gap:9px;margin-top:34px}.object-list span,.chip{padding:8px 12px;border-radius:999px;background:var(--mist);font-size:13px}.object-list span:nth-child(3n){background:var(--warm)}.inheritance{position:relative;padding:28px 0}.geo-list{display:grid;grid-template-columns:1fr 1fr;gap:18px 28px;list-style:none;margin:0;padding:0}.geo-step{display:grid;grid-template-columns:52px minmax(0,1fr);align-items:center;gap:16px;min-height:84px;padding:12px 0}.geo-icon{width:52px;height:52px;display:grid;place-items:center;border-radius:50%;background:var(--mist);color:var(--green)}.geo-icon svg{width:28px;height:28px;display:block}.geo-content{min-width:0}.geo-name{display:block;margin-bottom:5px;font-family:"Aptos Narrow","Segoe UI",sans-serif;font-size:12px;font-weight:700;letter-spacing:.14em;text-transform:uppercase;color:var(--muted)}.geo-example{display:block;font-family:Georgia,"Noto Serif SC",serif;font-size:clamp(1.15rem,1.8vw,1.55rem);font-weight:400;line-height:1.2}.geo-detail{display:block;margin-top:5px;color:var(--muted);font-size:12px;line-height:1.35}.geo-notes{display:flex;gap:22px;margin:34px 0 0;color:var(--muted);font-size:13px}.geo-notes span{padding-top:10px;border-top:1px solid var(--line)}
.flow-head{display:flex;align-items:end;justify-content:space-between;gap:32px;margin-bottom:38px}.flow-head p{max-width:380px;margin:0;color:var(--muted);line-height:1.65}.flow{display:grid;grid-auto-flow:column;grid-auto-columns:minmax(180px,1fr);gap:18px;overflow-x:auto;padding:4px 2px 22px;scroll-snap-type:x mandatory;overscroll-behavior-x:contain}.flow-card{scroll-snap-align:start;scroll-snap-stop:always;margin:0;min-width:0}.capture{position:relative;aspect-ratio:460/720;overflow:hidden;border-radius:16px;background:var(--white)}.capture img{width:100%;height:100%;object-fit:contain;display:block}.capture-filter{padding:17px;background:#e9ece8;display:flex;align-items:end}.filter-sheet{width:100%;padding:21px 17px 25px;border-radius:22px 22px 12px 12px;background:#fbfcfb}.filter-sheet h3{margin:0 0 17px;font-family:Georgia,"Noto Serif SC",serif;font-size:23px;font-weight:400}.filter-row{display:flex;flex-wrap:wrap;gap:7px;margin-top:11px}.filter-row span{padding:7px 10px;border-radius:999px;background:#e3ebe6;font-size:11px}.filter-row span.selected{background:var(--green);color:#fff}.flow-card figcaption{padding-top:15px}.flow-card b{display:block;font-family:Georgia,"Noto Serif SC",serif;font-size:17px;font-weight:400}.flow-card small{display:block;margin-top:6px;color:var(--muted);line-height:1.45}
.principles-grid{display:grid;grid-template-columns:1fr 1fr;gap:clamp(56px,10vw,170px);align-items:center}.word-stack{display:flex;flex-direction:column}.word-stack span{font-family:Georgia,"Noto Serif SC",serif;font-size:clamp(2.8rem,6vw,6rem);line-height:1.02;letter-spacing:-.04em}.word-stack span:nth-child(even){margin-left:18%;color:var(--green)}.rules{border-top:1px solid var(--ink)}.rule{display:flex;justify-content:space-between;gap:30px;padding:18px 0;border-bottom:1px solid var(--line)}.rule span:last-child{color:var(--muted);text-align:right}
.build-grid{display:grid;grid-template-columns:.86fr 1.14fr;gap:clamp(54px,10vw,170px);align-items:center}.stack-lines{border-top:1px solid var(--ink)}.stack-line{display:flex;align-items:baseline;justify-content:space-between;gap:28px;padding:21px 0;border-bottom:1px solid var(--line)}.stack-line strong{font-family:Georgia,"Noto Serif SC",serif;font-size:clamp(1.35rem,2.2vw,2.2rem);font-weight:400}.stack-line span{color:var(--muted);text-align:right}.pill-pair{display:flex;gap:9px;margin-top:28px}.pill-pair span{padding:10px 14px;border:1px solid var(--line);border-radius:999px}.pill-pair span:first-child{background:var(--mist);border-color:var(--mist)}
.roadmap-grid{display:grid;grid-template-columns:.72fr 1.28fr;gap:clamp(60px,11vw,180px);align-items:start}.roadmap-columns{display:grid;grid-template-columns:1fr 1fr;gap:70px}.roadmap-columns h3{margin:0 0 26px;font-family:Georgia,"Noto Serif SC",serif;font-size:2rem;font-weight:400}.roadmap-columns ul{list-style:none;padding:0;margin:0;border-top:1px solid var(--ink)}.roadmap-columns li{padding:17px 0;border-bottom:1px solid var(--line);font-size:1.05rem}.closing{margin-top:54px;display:flex;align-items:center;justify-content:space-between;gap:24px}.closing p{max-width:500px;color:var(--muted);line-height:1.6}
.arrow{width:15px;height:15px;display:inline-block;border-right:1.5px solid currentColor;border-top:1.5px solid currentColor;transform:rotate(45deg)}.fullscreen-icon{width:15px;height:15px;border:1.5px solid currentColor;border-radius:2px}
@media(max-width:900px){body{overflow-y:auto;overflow-x:hidden}.showcase{height:auto;overflow:visible;overflow-x:hidden;scroll-snap-type:none}.section{min-height:auto;padding:108px 28px 72px;overflow:visible}.rail{display:none}.cover-grid,.problem-grid,.concept-grid,.principles-grid,.build-grid,.roadmap-grid{grid-template-columns:1fr}.phone-stage{margin-top:28px}.phone{width:min(360px,88vw)}.statement{grid-column:auto}.flow{grid-auto-columns:minmax(220px,72vw)}.roadmap-columns{gap:28px}.topbar{padding:0 18px}.topbar .button:not(.button-primary){display:none}}
@media(max-width:720px){.flow{grid-auto-flow:row;grid-auto-columns:unset;grid-template-columns:repeat(2,minmax(0,1fr));gap:30px 16px;overflow:visible;padding:4px 0 0;scroll-snap-type:none}.flow-card{scroll-snap-align:none}.flow-card figcaption{padding-top:12px}.flow-card small{min-height:3.9em}}
@media(max-width:560px){.display-xl{font-size:3.7rem}.slogan-title{font-size:clamp(2.15rem,10.5vw,2.625rem)}.flow-title{font-size:clamp(2.5rem,12vw,3.35rem)}.flow-title .slogan-line{display:block}.comparison-row{grid-template-columns:1fr;gap:8px}.geo-list{grid-template-columns:1fr;gap:6px}.geo-step{grid-template-columns:46px minmax(0,1fr);gap:14px;min-height:72px}.geo-icon{width:46px;height:46px}.geo-icon svg{width:25px;height:25px}.geo-notes{flex-direction:column;gap:12px}.flow-head{align-items:start;flex-direction:column}.roadmap-columns{grid-template-columns:1fr}.closing{align-items:start;flex-direction:column}.word-stack span:nth-child(even){margin-left:9%}.rule{flex-direction:column;gap:5px}.rule span:last-child{text-align:left}.live-label{left:0}.section{padding-left:22px;padding-right:22px}}
@media(max-width:430px){.flow{grid-template-columns:1fr;gap:34px}.flow-card small{min-height:0}}
@media(prefers-reduced-motion:reduce){html{scroll-behavior:auto}.button,.rail-button{transition:none}}
`;

function IconArrow() { return <span className="arrow" aria-hidden="true" />; }

function GeoIcon({ kind }: { kind: (typeof geoLevels)[number]['kind'] }) {
  if (kind === 'point') return <svg viewBox="0 0 32 32" fill="none" aria-hidden="true"><circle cx="16" cy="16" r="5" stroke="currentColor" strokeWidth="1.8"/><path d="M16 4v6M16 22v6M4 16h6M22 16h6" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round"/></svg>;
  if (kind === 'city') return <svg viewBox="0 0 32 32" fill="none" aria-hidden="true"><path d="M5 27h22M8 27V12h7v15M15 27V6h9v21" stroke="currentColor" strokeWidth="1.8" strokeLinejoin="round"/><path d="M11 16h1M11 20h1M19 11h1M19 15h1M19 19h1" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/></svg>;
  if (kind === 'region') return <svg viewBox="0 0 32 32" fill="none" aria-hidden="true"><path d="M6 10c5-4 8 2 12-2s7 1 8 5c1 5-4 5-5 10-2 5-7 2-10 3-4 1-6-3-5-7 1-3-3-6 0-9Z" stroke="currentColor" strokeWidth="1.8" strokeLinejoin="round"/><path d="M10 14c3-2 5 1 8-1M11 20c4-2 6 1 10-2" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/></svg>;
  return <svg viewBox="0 0 32 32" fill="none" aria-hidden="true"><circle cx="16" cy="16" r="11" stroke="currentColor" strokeWidth="1.8"/><path d="M5 16h22M16 5c3 3 5 7 5 11s-2 8-5 11c-3-3-5-7-5-11s2-8 5-11Z" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/></svg>;
}

export function ShowcasePage() {
  const rootRef = useRef<HTMLDivElement>(null);
  const [active, setActive] = useState(0);

  useEffect(() => {
    const previousTitle = document.title;
    const previousLanguage = document.documentElement.lang;
    document.title = 'Drift — Your Own Cultural Atlas';
    document.documentElement.lang = 'en';
    return () => {
      document.title = previousTitle;
      document.documentElement.lang = previousLanguage;
    };
  }, []);

  useEffect(() => {
    if (typeof IntersectionObserver === 'undefined') return;
    const observer = new IntersectionObserver(
      (entries) => entries.forEach((entry) => {
        if (entry.isIntersecting) {
          const index = sections.findIndex((section) => section.id === entry.target.id);
          if (index >= 0) setActive(index);
        }
      }),
      { root: rootRef.current, threshold: 0.56 },
    );
    const nodes = sections.map(({ id }) => document.getElementById(id)).filter(Boolean) as HTMLElement[];
    nodes.forEach((node) => observer.observe(node));
    return () => observer.disconnect();
  }, []);

  const moveTo = (index: number) => {
    const next = Math.max(0, Math.min(sections.length - 1, index));
    const section = sections[next];
    if (section) document.getElementById(section.id)?.scrollIntoView({ behavior: 'smooth', block: 'start' });
  };

  const onKeyDown = (event: React.KeyboardEvent<HTMLDivElement>) => {
    if (event.key === 'ArrowRight' || event.key === 'ArrowDown' || event.key === 'PageDown') {
      event.preventDefault(); moveTo(active + 1);
    }
    if (event.key === 'ArrowLeft' || event.key === 'ArrowUp' || event.key === 'PageUp') {
      event.preventDefault(); moveTo(active - 1);
    }
    if (event.key === 'Home') { event.preventDefault(); moveTo(0); }
    if (event.key === 'End') { event.preventDefault(); moveTo(sections.length - 1); }
  };

  useEffect(() => {
    const handleWindowKey = (event: KeyboardEvent) => {
      const target = event.target as HTMLElement | null;
      if (target?.closest('iframe, input, textarea, select')) return;
      if (event.key === 'ArrowRight' || event.key === 'ArrowDown' || event.key === 'PageDown') {
        event.preventDefault(); moveTo(active + 1);
      }
      if (event.key === 'ArrowLeft' || event.key === 'ArrowUp' || event.key === 'PageUp') {
        event.preventDefault(); moveTo(active - 1);
      }
      if (event.key === 'Home') { event.preventDefault(); moveTo(0); }
      if (event.key === 'End') { event.preventDefault(); moveTo(sections.length - 1); }
    };
    window.addEventListener('keydown', handleWindowKey);
    return () => window.removeEventListener('keydown', handleWindowKey);
  }, [active]);

  return <>
    <style>{styles}</style>
    <header className="topbar">
      <a className="brand" href="#cover" onClick={(event) => { event.preventDefault(); moveTo(0); }}>Drift</a>
      <div className="top-actions">
        <button className="button icon-button" type="button" aria-label="Enter fullscreen presentation" title="Fullscreen presentation" onClick={() => document.documentElement.requestFullscreen?.()}><span className="fullscreen-icon" aria-hidden="true" /></button>
        <a className="button button-primary" href={`${process.env.EXPO_BASE_URL ?? ''}/demo`}>Open Interactive Demo <IconArrow /></a>
      </div>
    </header>
    <nav className="rail" aria-label="Showcase sections">
      {sections.map((section, index) => <button key={section.id} type="button" className="rail-button" aria-label={section.label} aria-current={index === active} onClick={() => moveTo(index)} />)}
    </nav>
    <main ref={rootRef} className="showcase" tabIndex={-1} onKeyDown={onKeyDown}>
      <section className="section" id="cover">
        <div className="section-inner cover-grid">
          <div>
            <h1 className="display display-xl"><span className="cover-title-en">Drift</span><span className="cover-title-subtitle">Your Own Cultural Atlas</span></h1>
            <p className="cover-copy">Turn books, films, people, histories, and places into a cultural map of your own.</p>
            <div className="cover-actions"><a className="button button-primary" href={`${process.env.EXPO_BASE_URL ?? ''}/demo`}>Open Interactive Demo <IconArrow /></a><button className="button" type="button" onClick={() => moveTo(1)}>Explore the case study</button></div>
          </div>
          <div className="phone-stage">
            <span className="live-label">Live demo</span>
            <div className="phone"><iframe src={`${process.env.EXPO_BASE_URL ?? ''}/`} title="Drift interactive phone demo" loading="eager" /></div>
          </div>
        </div>
      </section>

      <section className="section" id="problem">
        <div className="section-inner problem-grid">
          <div>
            <h2 className="display slogan-title">
              <span className="slogan-line">Cultural interests</span>
              <span className="slogan-line">have no map of</span>
              <span className="slogan-line">their own.</span>
            </h2>
          </div>
          <div>
            <div className="comparison">
              <div className="comparison-row"><strong>Google Maps / Amap</strong><p>Excellent at places, but cultural collections disappear among everyday POIs.</p></div>
              <div className="comparison-row"><strong>Douban / Letterboxd / Books</strong><p>Rich in cultural content, but missing the spatial dimension.</p></div>
              <div className="comparison-row"><strong>Notes</strong><p>Flexible enough to capture anything, but unable to show how it spreads across the world.</p></div>
            </div>
            <p className="statement">Culture has a spatial dimension. Existing tools rarely preserve it over time.</p>
          </div>
        </div>
      </section>

      <section className="section" id="concept">
        <div className="section-inner concept-grid">
          <div>
            <h2 className="display slogan-title">
              <span className="slogan-line">Every entry</span>
              <span className="slogan-line">belongs somewhere</span>
              <span className="slogan-line">in the world.</span>
            </h2>
            <p className="lead">Each cultural entry connects to a Location. Tags and Topics gradually reveal a personal way of seeing.</p>
            <div className="object-list" aria-label="Entry types"><span>Book</span><span>Movie</span><span>Music</span><span>Person</span><span>History / Event</span><span>Place / Space</span><span>Article / Podcast</span></div>
          </div>
          <div>
            <div className="inheritance" aria-label="Location inheritance from point to country">
              <ol className="geo-list">
                {geoLevels.map((level) => <li className="geo-step" key={level.kind}>
                  <span className="geo-icon"><GeoIcon kind={level.kind} /></span>
                  <span className="geo-content">
                    <span className="geo-name">{level.label}</span>
                    <strong className="geo-example">{level.example}</strong>
                    <small className="geo-detail">{level.note}</small>
                  </span>
                </li>)}
              </ol>
              <div className="geo-notes"><span>Inherits upward</span><span>Never infers downward</span><span>Deduplicates by Entry ID</span></div>
            </div>
          </div>
        </div>
      </section>

      <section className="section" id="experience">
        <div className="section-inner">
          <div className="flow-head"><h2 className="display flow-title"><span className="slogan-line">Core</span>{' '}<span className="slogan-line">experience</span></h2><p>Move from a world overview into a country, then follow entries, topics, and places back into a personal library.</p></div>
          <div className="flow" aria-label="Core product screens">
            <figure className="flow-card"><div className="capture"><img src={captures.map} alt="Drift default map with interest layer" /></div><figcaption><b>Map + Interest Layer</b><small>See where your interests gather before deciding where to go next.</small></figcaption></figure>
            <figure className="flow-card"><div className="capture"><img src={captures.map} alt="Country selection and bottom sheet" /></div><figcaption><b>Country + Bottom Sheet</b><small>Select a country and continue exploring through its spatial list.</small></figcaption></figure>
            <figure className="flow-card"><div className="capture"><img src={captures.detail} alt="Entry detail screen" /></div><figcaption><b>Entry Detail</b><small>Keep content, location, and personal notes in one context.</small></figcaption></figure>
            <figure className="flow-card"><div className="capture capture-filter"><div className="filter-sheet"><h3>Filter interests</h3><small className="muted">Tag</small><div className="filter-row"><span className="selected">Architecture</span><span>Film</span><span>Museum</span></div><br /><small className="muted">Topic</small><div className="filter-row"><span className="selected">I. M. Pei’s Architecture</span><span>Cities on Screen</span></div></div></div><figcaption><b>Tag / Topic Filter</b><small>Temporarily reshape the map through your own vocabulary.</small></figcaption></figure>
            <figure className="flow-card"><div className="capture"><img src={captures.library} alt="Drift library screen" /></div><figcaption><b>Library</b><small>Return from the map to a collection built for scanning and revisiting.</small></figcaption></figure>
            <figure className="flow-card"><div className="capture"><img src={captures.add} alt="Add entry screen" /></div><figcaption><b>Add Entry</b><small>Capture the idea first, then give it a spatial relationship.</small></figcaption></figure>
          </div>
        </div>
      </section>

      <section className="section" id="principles">
        <div className="section-inner principles-grid">
          <div className="word-stack" aria-label="Design principles"><span>Minimal</span><span>Calm</span><span>Editorial</span><span>Spatial</span><span>Personal</span><span>Fluid</span></div>
          <div className="rules">
            <div className="rule"><span>Experience</span><span>Map-first · Browse &gt; Search</span></div>
            <div className="rule"><span>Country</span><span>Area fill</span></div>
            <div className="rule"><span>City / Region</span><span>Dot / Halo</span></div>
            <div className="rule"><span>Point</span><span>Marker</span></div>
            <div className="rule"><span>Selection</span><span>Outline</span></div>
            <div className="rule"><span>Type</span><span>Monochrome linear icon</span></div>
            <div className="rule"><span>Tags</span><span>Subtle colored chips</span></div>
          </div>
        </div>
      </section>

      <section className="section" id="decisions">
        <div className="section-inner build-grid">
          <div><h2 className="display slogan-title"><span className="slogan-line">Native at heart.</span><span className="slogan-line">Demoed anywhere.</span></h2><p className="lead">An iPhone-first product, paired with a low-friction browser demo for Windows.</p><div className="pill-pair"><span>Local-first</span><span>Cloud-ready</span></div></div>
          <div className="stack-lines">
            <div className="stack-line"><strong>React Native + Expo</strong><span>iPhone-first product</span></div>
            <div className="stack-line"><strong>TypeScript</strong><span>Shared domain rules</span></div>
            <div className="stack-line"><strong>Mapbox</strong><span>Native / Web adapters</span></div>
            <div className="stack-line"><strong>SQLite</strong><span>Local data ownership</span></div>
            <div className="stack-line"><strong>Decoupled data</strong><span>Business model ≠ map provider</span></div>
          </div>
        </div>
      </section>

      <section className="section" id="roadmap">
        <div className="section-inner roadmap-grid">
          <div><h2 className="display slogan-title"><span className="slogan-line">A focused</span><span className="slogan-line">first version.</span></h2><p className="lead">Close the loop between capture, spatial connection, and rediscovery before expanding into sync and more flexible geography.</p></div>
          <div>
            <div className="roadmap-columns"><div><h3>V1</h3><ul><li>Capture</li><li>Location</li><li>Map Browse</li><li>Library</li><li>Entry Detail</li></ul></div><div><h3>Next</h3><ul><li>Cloud backup / sync</li><li>Topic enhancement</li><li>Custom area</li><li>App Store</li></ul></div></div>
            <div className="closing"><p>Start with one cultural entry. Gradually see how you come to know the world.</p><a className="button button-primary" href={`${process.env.EXPO_BASE_URL ?? ''}/demo`}>Open Interactive Demo <IconArrow /></a></div>
          </div>
        </div>
      </section>
    </main>
  </>;
}
