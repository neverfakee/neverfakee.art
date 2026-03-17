import { useState, useCallback } from "react";
import { CosmicBackdrop } from "./components/CosmicBackdrop";
import { MagneticButton } from "./components/MagneticButton";
import { MusicDock } from "./components/MusicDock";
import { MouseGlow } from "./components/MouseGlow";
import { ParticleCursor } from "./components/ParticleCursor";
import { ScrollProgress } from "./components/ScrollProgress";
import { IntroScreen } from "./components/IntroScreen";
import { creatorProfile } from "./data/portfolio";
import { Home } from "./pages/Home";

const navigation = [
  { label: "Top", href: "#top" },
  { label: "Showcase", href: "#showcase" },
  { label: "Clients", href: "#clients" },
  { label: "Teams", href: "#featured-teams" },
  { label: "Discord", href: "#discord" },
  { label: "Contact", href: "#contact" },
];

export default function App() {
  const [introComplete, setIntroComplete] = useState(false);

  const handleIntroDone = useCallback(() => {
    setIntroComplete(true);
    window.dispatchEvent(new CustomEvent("intro:done"));
  }, []);

  return (
    <div className="site-frame">
      {!introComplete && <IntroScreen onDone={handleIntroDone} />}

      <CosmicBackdrop />
      <ScrollProgress />
      <MouseGlow />
      <ParticleCursor />
      <MusicDock />

      <div className="app-shell">
        <header className="site-header">
          <a href="#top" className="site-brand glass-panel">
            <span className="site-brand__mark">{creatorProfile.brand}</span>
            <span className="site-brand__meta">
              {creatorProfile.role}. Paper 1.21.x support. Contact on Discord:{" "}
              {creatorProfile.discordHandle}.
            </span>
          </a>

          <nav className="site-nav glass-panel" aria-label="Primary">
            {navigation.map((item) => (
              <a key={item.href} href={item.href} className="site-nav__link">
                {item.label}
              </a>
            ))}
          </nav>

          <MagneticButton
            href={creatorProfile.discordServer}
            target="_blank"
            rel="noreferrer"
            variant="primary"
            className="site-header__cta"
          >
            Discord: neverfakee
          </MagneticButton>
        </header>

        <Home />
      </div>
    </div>
  );
}
