import { InteractivePanel } from "../components/InteractivePanel";
import { MagneticButton } from "../components/MagneticButton";
import { CinematicHero } from "../components/CinematicHero";
import { PageShell } from "../components/PageShell";
import { SectionReveal } from "../components/SectionReveal";
import { ParticleExplosion } from "../components/ParticleExplosion";
import {
  buildStack,
  clientCards,
  creatorProfile,
  discordFeatures,
  featuredTeams,
  footerFacts,
  heroStats,
  heroTags,
  particleExamples,
  showcaseReels,
  specialties,
} from "../data/portfolio";

const openingReel = showcaseReels[1];

export function Home() {
  return (
    <PageShell className="page page--minecraft">
      <CinematicHero reel={openingReel} tags={heroTags} stats={heroStats} />

      <section
        id="featured-teams"
        className="section section-panel section-panel--featured"
      >
        <SectionReveal className="section__intro">
          <div>
            <span className="section-label">Featured logos</span>
            <h2>Featured teams and collaborations.</h2>
          </div>
        </SectionReveal>

        <div className="featured-team-grid">
          {featuredTeams.map((team, index) => (
            <SectionReveal key={team.name} delay={index * 0.08}>
              <InteractivePanel className="featured-team-card glass-panel">
                <div className="featured-team-card__logo-wrap">
                  <img
                    className="featured-team-card__logo"
                    src={team.logo}
                    alt={`${team.name} logo`}
                    loading="lazy"
                  />
                </div>

                <div className="featured-team-card__body">
                  <span>{team.role}</span>
                  <h3>{team.name}</h3>
                  <p>{team.description}</p>
                </div>
              </InteractivePanel>
            </SectionReveal>
          ))}
        </div>
      </section>

      <section
        id="particle-examples"
        className="section section-panel section-panel--gallery particle-examples"
      >
        <SectionReveal className="section__intro">
          <div>
            <span className="section-label">Real particle footage</span>
            <h2>Real examples of my work.</h2>
          </div>
        </SectionReveal>

        <div className="particle-examples__grid">
          {particleExamples.map((example, index) => (
            <SectionReveal key={example.video} delay={index * 0.06}>
              <InteractivePanel
                className={`particle-example-card glass-panel${
                  index === 0 ? " particle-example-card--hero" : ""
                }${index === 3 ? " particle-example-card--wide" : ""}`}
              >
                <video
                  className="particle-example-card__video"
                  src={example.video}
                  poster={example.poster}
                  muted
                  autoPlay
                  loop
                  playsInline
                  preload="metadata"
                  aria-label={example.title}
                />
                <div className="particle-example-card__meta">
                  <span>Particle clip {index + 1}</span>
                  <strong>{example.title}</strong>
                </div>
              </InteractivePanel>
            </SectionReveal>
          ))}
        </div>
      </section>

      <section className="mc-strip">
        <div className="mc-strip__track">
          {[
            "Custom SMP plugins",
            "Particle systems",
            "Paper 1.21.x",
            "Block displays",
            "Trail effects",
            "Event visuals",
            "Boss fights",
            "Discord-first contact",
            "Custom SMP plugins",
            "Particle systems",
            "Paper 1.21.x",
            "Block displays",
          ].map((item, index) => (
            <span key={`${item}-${index}`}>{item}</span>
          ))}
        </div>
      </section>

      <section className="section section-panel section-panel--intro section--minecraft-intro">
        <SectionReveal className="section__intro">
          <div>
            <span className="section-label">{creatorProfile.role}</span>
            <h2>
              Professional plugin delivery for SMP servers with quality-first
              execution.
            </h2>
          </div>
          <p>{creatorProfile.bio}</p>
        </SectionReveal>

        <div className="specialty-grid">
          {specialties.map((item, index) => (
            <SectionReveal key={item.title} delay={index * 0.08}>
              <InteractivePanel className="specialty-card glass-panel">
                <h3>{item.title}</h3>
                <p>{item.description}</p>
              </InteractivePanel>
            </SectionReveal>
          ))}
        </div>
      </section>

      <ParticleExplosion />

      <section className="section section-panel section-panel--stack">
        <SectionReveal className="section__intro">
          <div>
            <span className="section-label">Build stack</span>
            <h2>Core stack used for current delivery.</h2>
          </div>
          <p>
            Built around Java and Paper 1.21.x with a focus on practical SMP
            delivery rather than generic portfolio filler claims.
          </p>
        </SectionReveal>

        <SectionReveal>
          <div className="stack-cloud">
            {buildStack.map((item) => (
              <span key={item} className="stack-cloud__item glass-panel">
                {item}
              </span>
            ))}
          </div>
        </SectionReveal>
      </section>

      <section
        id="clients"
        className="section section-panel section-panel--clients"
      >
        <SectionReveal className="section__intro">
          <div>
            <span className="section-label">Clients</span>
            <h2>Current and past SMP projects.</h2>
          </div>
          <p>
            Active collaborations: Bloodlust, Attribute, Mastery, Ring, and
            Curse SMP.
          </p>
        </SectionReveal>

        <div className="client-grid">
          {clientCards.map((client, index) => (
            <SectionReveal key={client.name} delay={index * 0.08}>
              <InteractivePanel className="client-card glass-panel">
                <div className="client-card__top">
                  <span className="client-card__status">{client.status}</span>
                  <span className="client-card__name">{client.name}</span>
                </div>
                <p className="client-card__focus">{client.focus}</p>
                <p className="client-card__note">{client.note}</p>
              </InteractivePanel>
            </SectionReveal>
          ))}
        </div>
      </section>

      <section id="discord" className="discord-section">
        <SectionReveal className="discord-panel glass-panel">
          <div className="discord-panel__copy">
            <span className="section-label">Discord features</span>
            <h2>Contact and community links.</h2>
            <p>
              Main contact is Discord. Username:{" "}
              <strong>{creatorProfile.discordHandle}</strong>. Community server:{" "}
              <a
                className="inline-link"
                href={creatorProfile.discordServer}
                target="_blank"
                rel="noreferrer"
              >
                {creatorProfile.discordServer.replace("https://", "")}
              </a>
              .
            </p>

            <div className="discord-panel__actions">
              <MagneticButton
                href={creatorProfile.discordServer}
                target="_blank"
                rel="noreferrer"
                variant="primary"
              >
                Join Discord
              </MagneticButton>
              <MagneticButton
                href={creatorProfile.youtube}
                target="_blank"
                rel="noreferrer"
                variant="secondary"
              >
                YouTube
              </MagneticButton>
            </div>
          </div>

          <div className="discord-panel__side">
            <div className="discord-widget-shell glass-panel">
              <span className="floating-media__label">Live server widget</span>
              <div className="discord-widget-shell__frame">
                <iframe
                  src="https://discord.com/widget?id=1483177962156069005&theme=dark"
                  width="350"
                  height="500"
                  allowTransparency={true}
                  frameBorder="0"
                  sandbox="allow-popups allow-popups-to-escape-sandbox allow-same-origin allow-scripts"
                  title="Celestial Discord server widget"
                />
              </div>
            </div>

            <div className="discord-panel__grid">
              {discordFeatures.map((feature) => (
                <InteractivePanel
                  key={feature.title}
                  className="discord-feature glass-panel"
                >
                  <h3>{feature.title}</h3>
                  <p>{feature.description}</p>
                </InteractivePanel>
              ))}
            </div>
          </div>
        </SectionReveal>
      </section>

      <section id="contact" className="contact-footer glass-panel">
        <div className="contact-footer__copy">
          <span className="section-label">Contact / handoff</span>
          <h2>Contact: Discord only.</h2>
          <p>
            Reach me at <strong>{creatorProfile.discordHandle}</strong> or join{" "}
            <a
              className="inline-link"
              href={creatorProfile.discordServer}
              target="_blank"
              rel="noreferrer"
            >
              {creatorProfile.discordServer.replace("https://", "")}
            </a>
            . You can also view showcases on{" "}
            <a
              className="inline-link"
              href={creatorProfile.youtube}
              target="_blank"
              rel="noreferrer"
            >
              @neverfakeemc
            </a>
            .
          </p>
        </div>

        <div className="contact-footer__facts">
          {footerFacts.map((fact) => (
            <span key={fact}>{fact}</span>
          ))}
        </div>
      </section>
    </PageShell>
  );
}
