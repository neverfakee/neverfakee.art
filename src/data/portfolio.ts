export type AccentTone = "steel" | "ice" | "signal";

export type ShowcaseReel = {
  id: string;
  kicker: string;
  title: string;
  description: string;
  video: string;
  poster: string;
  accent: AccentTone;
  stats: string[];
  bullets: string[];
};

export type ClientCard = {
  name: string;
  status: string;
  focus: string;
  note: string;
};

export type CodeLine = {
  lineNumber: string;
  text: string;
  tone?: "default" | "accent" | "signal" | "comment";
};

export type MotionGalleryItem = {
  title: string;
  caption: string;
  src: string;
  alt: string;
};

export type ParticleExample = {
  title: string;
  video: string;
  poster: string;
};

export type FeaturedTeam = {
  name: string;
  role: string;
  description: string;
  logo: string;
};

export const heroStats = [
  {
    value: "USD $20-$110",
    label: "plugin pricing range based on project complexity",
  },
  {
    value: "1-5 weeks",
    label: "typical delivery window from start to handoff",
  },
  {
    value: "1.21.x / Paper",
    label: "active support stack for current plugin work",
  },
];

export const heroTags = [
  "neverfakee",
  "Professional plugin developer",
  "Particle systems",
  "Paper 1.21.x",
  "SMP-focused development",
];

export const showcaseReels: ShowcaseReel[] = [
  {
    id: "coding",
    kicker: "Just saw workflow",
    title: "Professional SMP plugins and high quality results",
    description: "",
    video: "/videos/coding-reel.mp4",
    poster: "/videos/coding-reel-poster.jpg",
    accent: "steel",
    stats: [
      "Professional plugin developer",
      "Paper 1.21.x",
      "1-5 week delivery",
    ],
    bullets: [
      "Built for SMP projects that need reliable results and polished implementation.",
      "Scope and pricing adjust by complexity to fit server needs.",
    ],
  },
  {
    id: "particles",
    kicker: "",
    title: "Bloodlust SMP particle systems and event-ready visual effects.",
    description:
      "Real particle work shipped for SMP use cases: trails, aura loops, event visuals, and combat feedback tuned for live gameplay and clear readability.",
    video: "/videos/12341.mov",
    poster: "/videos/particle-example-1.jpg",
    accent: "ice",
    stats: [
      "Bloodlust SMP",
      "Event particle systems",
      "Complex particles + block displays",
    ],
    bullets: [
      "Designed for smooth SMP gameplay without visual spam or heavy tick impact.",
      "Built to feel cinematic while still staying practical for daily server use.",
      "Focused on quality delivery with stable behavior in real server environments.",
    ],
  },
  {
    id: "ops",
    kicker: "Collab Reel 03",
    title: "Live SMP client collaborations and production plugin delivery.",
    description:
      "Real collaboration work across SMP servers with ongoing support, updates, and high-quality feature delivery.",
    video: "/videos/client-reel.mp4",
    poster: "/videos/client-reel-poster.jpg",
    accent: "signal",
    stats: [
      "Bloodlust active",
      "Celestial owner/developer",
      "Discord-first contact",
    ],
    bullets: [
      "Client work built around practical SMP needs and clear timelines.",
      "Updates and rollouts handled with production-focused consistency.",
      "Primary contact and community handoff is through Discord.",
    ],
  },
];

export const particleExamples: ParticleExample[] = [
  {
    title: "Standalone Particle Showcase",
    video: "/videos/particle-clip-1.mp4",
    poster: "/videos/particle-clip-1-poster.svg",
  },
  {
    title: "Event Particle Systems",
    video: "/videos/particle-example-2.mp4",
    poster: "/videos/particle-example-2.jpg",
  },
  {
    title: "Celestial SMP",
    video: "/videos/particle-example-3.mp4",
    poster: "/videos/particle-example-3.jpg",
  },
  {
    title: "Complex Particles and block displays",
    video: "/videos/particle-example-4.mp4",
    poster: "/videos/particle-example-4.jpg",
  },
  {
    title: "Ring SMP showcase",
    video: "/videos/particle-example-5.mp4",
    poster: "/videos/particle-example-5.jpg",
  },
];

export const codeSequence: CodeLine[] = [
  {
    lineNumber: "01",
    text: "public final class ParticleEngine extends JavaPlugin {",
    tone: "accent",
  },
  {
    lineNumber: "02",
    text: "  private final TrailService trails = new TrailService();",
    tone: "default",
  },
  {
    lineNumber: "03",
    text: "  private final AbilityBus abilities = new AbilityBus();",
    tone: "default",
  },
  {
    lineNumber: "04",
    text: "  private final DiscordBridge discordBridge = new DiscordBridge();",
    tone: "signal",
  },
  {
    lineNumber: "05",
    text: "  public void onEnable() {",
    tone: "accent",
  },
  {
    lineNumber: "06",
    text: "    listeners.register(new SpellCastListener(trails, abilities));",
    tone: "default",
  },
  {
    lineNumber: "07",
    text: '    scheduler.repeat("boss.telegraph", 1L, tick -> emitArcaneRing());',
    tone: "signal",
  },
  {
    lineNumber: "08",
    text: '    discordBridge.publish("deploy", buildMetadata());',
    tone: "default",
  },
  {
    lineNumber: "09",
    text: "  }",
    tone: "accent",
  },
  {
    lineNumber: "10",
    text: "}",
    tone: "accent",
  },
];

export const motionGallery: MotionGalleryItem[] = [
  {
    title: "Trail playground",
    caption:
      "Orbit rings, aura pulses, and rank cosmetics staged for player-facing wow moments.",
    src: "/videos/particle-example-1.jpg",
    alt: "Minecraft particle plugin showcase poster",
  },
  {
    title: "Java build pass",
    caption:
      "Code structure, command layers, listeners, and deployment-safe plugin organization.",
    src: "/videos/coding-reel-poster.jpg",
    alt: "Java plugin code poster",
  },
  {
    title: "Ops bridge",
    caption:
      "Client tooling, Discord relays, dashboards, and staff-side automation hooks.",
    src: "/videos/client-reel-poster.jpg",
    alt: "Client operations plugin poster",
  },
];

export const specialties = [
  {
    title: "Custom SMP plugins",
    description:
      "Professional Minecraft plugin systems for SMP servers with clean structure and reliable gameplay behavior.",
  },
  {
    title: "Event particle systems",
    description:
      "High-quality trails, bursts, rings, and cinematic particle choreography tuned for player visibility.",
  },
  {
    title: "Complex block displays",
    description:
      "Advanced particle + block display compositions for bosses, showcases, and custom event moments.",
  },
  {
    title: "Reliable delivery",
    description:
      "Pricing usually ranges from USD $20-$110 with delivery windows around 1-5 weeks based on complexity.",
  },
];

export const clientCards: ClientCard[] = [
  {
    name: "Bloodlust",
    status: "Currently working with",
    focus: "SMP gameplay systems and particle effect work",
    note: "High-quality particle systems and custom gameplay features.",
  },
  {
    name: "Celestial SMP",
    status: "Owner and developer",
    focus: "Primary SMP direction, events, and visual plugin systems",
    note: "Main server project with full plugin development.",
  },
  {
    name: "Future SMP",
    status: "Worked with",
    focus: "SMP plugin development and backend support",
    note: "Custom server systems and backend development.",
  },
  {
    name: "Attribute SMP",
    status: "Currently working with",
    focus: "Custom gameplay and performance-aware effects",
    note: "Custom gameplay mechanics and particle effects.",
  },
  {
    name: "Mastery SMP",
    status: "Currently working with",
    focus: "Feature implementation and visual content systems",
    note: "Feature delivery and ongoing plugin support.",
  },
  {
    name: "Ring SMP",
    status: "Currently working with",
    focus: "Particle showcases and ring-based effect systems",
    note: "Advanced particle systems and visual effects.",
  },
  {
    name: "Curse SMP",
    status: "Currently working with",
    focus: "Core plugin systems and advanced event visuals",
    note: "Team developer for core systems and events.",
  },
];

export const featuredTeams: FeaturedTeam[] = [
  {
    name: "Mastery SMP",
    role: "Currently working with",
    description: "Feature delivery, plugin support, and live SMP systems.",
    logo: "/logos/mastery-smp.webp",
  },
  {
    name: "Celestial SMP",
    role: "Owner and developer",
    description: "Primary SMP project, events, and long-term plugin direction.",
    logo: "/logos/celestial-smp.webp",
  },
  {
    name: "Curse SMP",
    role: "Developer",
    description: "Team-side plugin development and production rollout support.",
    logo: "/logos/curse-smp.webp",
  },
];

export const buildStack = [
  "Java",
  "Paper",
  "1.21.x",
  "Bukkit API",
  "Gradle",
  "Event listeners",
  "Particle systems",
  "Block displays",
  "SMP mechanics",
  "Discord community links",
];

export const discordFeatures = [
  {
    title: "Direct Discord contact",
    description:
      "Primary contact handle: neverfakee for project discussion and delivery handoff.",
  },
  {
    title: "Celestial community server",
    description:
      "Join discord.gg/Celestialpub for updates, SMP content, and plugin showcase drops.",
  },
  {
    title: "YouTube showcases",
    description:
      "Project clips and visual work published at youtube.com/@neverfakeemc.",
  },
];

export const footerFacts = [
  "Pricing range: USD $20-$110",
  "Delivery window: 1-5 weeks",
  "Focused support: Paper 1.21.x",
  "Project support: Global",
];

export const creatorProfile = {
  brand: "neverfakees plugins",
  role: "Professional minecraft plugin developer",
  bio: "I can create professional minecraft plugins for your SMP's or even just in general with high quality results and I will never fail to deliver.",
  discordHandle: "neverfakee",
  discordServer: "https://discord.gg/sN7F9BEqTz",
  youtube: "https://www.youtube.com/@neverfakeemc",
};
