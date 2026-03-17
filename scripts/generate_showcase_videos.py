from __future__ import annotations

import math
from pathlib import Path

import imageio.v2 as imageio
import numpy as np
from PIL import Image, ImageDraw, ImageFilter, ImageFont


ROOT = Path(__file__).resolve().parent.parent
OUTPUT_DIR = ROOT / "public" / "videos"
WIDTH = 1280
HEIGHT = 720
FPS = 24
FRAMES = 144


def load_font(size: int, bold: bool = False) -> ImageFont.FreeTypeFont | ImageFont.ImageFont:
    candidates = [
        "C:/Windows/Fonts/arialbd.ttf" if bold else "C:/Windows/Fonts/arial.ttf",
        "C:/Windows/Fonts/segoeuib.ttf" if bold else "C:/Windows/Fonts/segoeui.ttf",
    ]
    for candidate in candidates:
        path = Path(candidate)
        if path.exists():
            return ImageFont.truetype(str(path), size=size)
    return ImageFont.load_default()


FONT_H1 = load_font(54, bold=True)
FONT_H2 = load_font(32, bold=True)
FONT_BODY = load_font(22)
FONT_SMALL = load_font(16)
FONT_CODE = load_font(20)


def lerp(a: float, b: float, t: float) -> float:
    return a + ((b - a) * t)


def hex_rgb(value: str) -> tuple[int, int, int]:
    value = value.lstrip("#")
    return tuple(int(value[index : index + 2], 16) for index in (0, 2, 4))


def vertical_gradient(top: tuple[int, int, int], bottom: tuple[int, int, int]) -> np.ndarray:
    gradient = np.zeros((HEIGHT, WIDTH, 3), dtype=np.uint8)
    for y in range(HEIGHT):
      t = y / max(HEIGHT - 1, 1)
      gradient[y, :, 0] = int(lerp(top[0], bottom[0], t))
      gradient[y, :, 1] = int(lerp(top[1], bottom[1], t))
      gradient[y, :, 2] = int(lerp(top[2], bottom[2], t))
    return gradient


def add_glow(base: Image.Image, xy: tuple[float, float], radius: int, color: tuple[int, int, int], alpha: int) -> None:
    overlay = Image.new("RGBA", base.size, (0, 0, 0, 0))
    draw = ImageDraw.Draw(overlay)
    x, y = xy
    draw.ellipse((x - radius, y - radius, x + radius, y + radius), fill=(*color, alpha))
    overlay = overlay.filter(ImageFilter.GaussianBlur(radius / 2))
    base.alpha_composite(overlay)


def add_grid(draw: ImageDraw.ImageDraw, spacing: int, color: tuple[int, int, int, int]) -> None:
    for x in range(0, WIDTH, spacing):
        draw.line((x, 0, x, HEIGHT), fill=color, width=1)
    for y in range(0, HEIGHT, spacing):
        draw.line((0, y, WIDTH, y), fill=color, width=1)


def make_coding_frame(index: int) -> np.ndarray:
    progress = index / (FRAMES - 1)
    background = vertical_gradient(hex_rgb("#0A1420"), hex_rgb("#0D1017"))
    image = Image.fromarray(background).convert("RGBA")
    draw = ImageDraw.Draw(image)

    add_grid(draw, 64, (114, 146, 184, 18))
    add_glow(image, (190, 160), 220, hex_rgb("#4E8FE8"), 90)
    add_glow(image, (1120, 560), 180, hex_rgb("#89D3FF"), 54)

    left_panel = (64, 72, 296, 648)
    editor = (326, 72, 1212, 568)
    terminal = (326, 592, 1212, 648)
    draw.rounded_rectangle(left_panel, radius=28, fill=(14, 23, 38, 232), outline=(115, 156, 204, 40))
    draw.rounded_rectangle(editor, radius=28, fill=(8, 14, 24, 235), outline=(136, 180, 232, 38))
    draw.rounded_rectangle(terminal, radius=24, fill=(10, 16, 25, 232), outline=(136, 180, 232, 34))

    draw.text((88, 96), "Plugin Workspace", font=FONT_H2, fill=(232, 241, 252))
    file_items = [
        "ParticleStormPlugin.java",
        "SpellEmitter.java",
        "ClientBridgeListener.java",
        "CommandSyncService.java",
        "plugin.yml",
        "server.log",
    ]
    for idx, item in enumerate(file_items):
        y = 152 + (idx * 62)
        selected = idx == 0
        if selected:
            draw.rounded_rectangle((82, y - 6, 278, y + 34), radius=16, fill=(78, 124, 188, 64))
        draw.text((96, y), item, font=FONT_BODY, fill=(222, 233, 247) if selected else (148, 169, 196))

    draw.text((350, 98), "ParticleStormPlugin.java", font=FONT_H2, fill=(245, 248, 252))
    draw.text((1058, 98), "Java / Paper 1.21", font=FONT_SMALL, fill=(142, 171, 210))

    code_lines = [
        ("public final class ParticleStormPlugin extends JavaPlugin {", "#E6F3FF"),
        ("  private EffectRegistry registry;", "#B9D2F2"),
        ("  private TrailScheduler trailScheduler;", "#B9D2F2"),
        ("", "#B9D2F2"),
        ("  @Override", "#8AC2FF"),
        ("  public void onEnable() {", "#E6F3FF"),
        ('    saveDefaultConfig();', "#D5E8FF"),
        ('    registry = new EffectRegistry(this);', "#FBD38D"),
        ('    trailScheduler = new TrailScheduler(this, registry);', "#FBD38D"),
        ('    getServer().getPluginManager().registerEvents(', "#D5E8FF"),
        ('      new ClientBridgeListener(registry), this', "#9FE6C1"),
        ("    );", "#D5E8FF"),
        ("  }", "#E6F3FF"),
        ("", "#B9D2F2"),
        ("  public void spawnPreview(Player player) {", "#E6F3FF"),
        ("    registry.create(\"arcane_orbit\")", "#D5E8FF"),
        ("      .color(92, 167, 255)", "#F38BA8"),
        ("      .density(64)", "#F38BA8"),
        ("      .radius(3.25)", "#F38BA8"),
        ("      .emit(player.getLocation());", "#9FE6C1"),
        ("  }", "#E6F3FF"),
        ("}", "#E6F3FF"),
    ]
    scroll = int(progress * 380)
    cursor_line = 14 + int(progress * 4)
    cursor_visible = (index // 8) % 2 == 0
    for line_index, (text, color) in enumerate(code_lines):
        y = 152 + (line_index * 34) - scroll
        if 120 < y < 546:
            if line_index == cursor_line:
                draw.rounded_rectangle((356, y - 4, 1188, y + 26), radius=12, fill=(64, 92, 132, 34))
            line_no = str(line_index + 1).rjust(2)
            draw.text((360, y), line_no, font=FONT_CODE, fill=(91, 112, 138))
            draw.text((412, y), text, font=FONT_CODE, fill=hex_rgb(color))
            if line_index == cursor_line and cursor_visible:
                cursor_x = 412 + (min(len(text), 30) * 10)
                draw.rectangle((cursor_x, y + 1, cursor_x + 3, y + 25), fill=(190, 222, 255))

    terminal_lines = [
        "[INFO] Bootstrapping ParticleStormPlugin",
        "[INFO] Loading client sync channels",
        "[INFO] Registered 38 particle presets",
        "[INFO] Connected to SkyForge production shard",
    ]
    for terminal_index, text in enumerate(terminal_lines):
        terminal_y = 604 + (terminal_index * 12)
        color = (141, 240, 194) if terminal_index == len(terminal_lines) - 1 else (177, 198, 224)
        draw.text((350, terminal_y), text, font=FONT_SMALL, fill=color)

    draw.text((78, 678), "Java plugin architecture / command systems / packet-safe particle emitters", font=FONT_SMALL, fill=(150, 176, 210))
    return np.array(image.convert("RGB"))


def make_particle_frame(index: int) -> np.ndarray:
    progress = index / (FRAMES - 1)
    background = vertical_gradient(hex_rgb("#090F16"), hex_rgb("#07090F"))
    image = Image.fromarray(background).convert("RGBA")
    draw = ImageDraw.Draw(image)
    add_grid(draw, 72, (116, 146, 184, 14))
    add_glow(image, (280, 168), 200, hex_rgb("#507EB8"), 70)
    add_glow(image, (980, 240), 180, hex_rgb("#7CA6FF"), 54)
    add_glow(image, (640, 508), 180, hex_rgb("#B5DAFF"), 36)

    center_x = 760 + (math.sin(progress * math.pi * 1.8) * 28)
    center_y = 382 + (math.cos(progress * math.pi * 1.3) * 22)
    overlay = Image.new("RGBA", image.size, (0, 0, 0, 0))
    particle_draw = ImageDraw.Draw(overlay)

    for idx in range(260):
        angle = (idx / 260) * math.tau * 4 + (progress * math.tau * 1.9)
        spiral = 42 + (idx * 1.34)
        x = center_x + math.cos(angle) * spiral * 0.88
        y = center_y + math.sin(angle * 0.9) * spiral * 0.42
        size = 2 + ((idx % 7) * 0.3)
        alpha = 160 if idx % 9 == 0 else 92
        color = (140, 186, 255, alpha) if idx % 5 else (191, 227, 255, 220)
        particle_draw.ellipse((x - size, y - size, x + size, y + size), fill=color)

    for idx in range(120):
        angle = (idx / 120) * math.tau + (progress * math.tau * 2.6)
        radius = 120 + (28 * math.sin((progress * math.pi * 2) + idx))
        x = center_x + math.cos(angle) * radius
        y = center_y + math.sin(angle) * radius * 0.5
        particle_draw.ellipse((x - 3, y - 3, x + 3, y + 3), fill=(111, 224, 255, 150))

    overlay = overlay.filter(ImageFilter.GaussianBlur(1.5))
    image.alpha_composite(overlay)

    draw = ImageDraw.Draw(image)
    draw.rounded_rectangle((78, 82, 514, 250), radius=32, fill=(12, 18, 28, 186), outline=(126, 171, 226, 34))
    draw.text((108, 110), "Particle Systems", font=FONT_H1, fill=(238, 246, 255))
    draw.text((110, 184), "Scroll-scrubbed previews for helixes, orbit trails, ability bursts,\nand server-safe visual sequencing inside Paper/Spigot plugins.", font=FONT_BODY, fill=(169, 190, 217))

    info_cards = [
        ("Arc Burst", "32 emitters / async-safe"),
        ("Aura Trail", "player-follow spline"),
        ("Boss Spell", "multi-phase telegraph"),
    ]
    for card_index, (title, subtitle) in enumerate(info_cards):
        x = 92 + (card_index * 182)
        y = 540
        draw.rounded_rectangle((x, y, x + 164, y + 102), radius=24, fill=(10, 15, 24, 205), outline=(126, 171, 226, 30))
        draw.text((x + 18, y + 20), title, font=FONT_BODY, fill=(233, 242, 255))
        draw.text((x + 18, y + 58), subtitle, font=FONT_SMALL, fill=(146, 170, 198))

    draw.rounded_rectangle((954, 88, 1196, 150), radius=22, fill=(10, 15, 24, 196), outline=(126, 171, 226, 30))
    draw.text((980, 110), "Plugin Reel 02", font=FONT_BODY, fill=(228, 239, 252))
    draw.text((950, 646), "Boss arenas / trails / cosmetics / skill VFX", font=FONT_SMALL, fill=(158, 184, 214))
    return np.array(image.convert("RGB"))


def make_client_frame(index: int) -> np.ndarray:
    progress = index / (FRAMES - 1)
    background = vertical_gradient(hex_rgb("#0B121B"), hex_rgb("#070A10"))
    image = Image.fromarray(background).convert("RGBA")
    draw = ImageDraw.Draw(image)
    add_grid(draw, 56, (126, 150, 180, 12))
    add_glow(image, (220, 180), 220, hex_rgb("#5B82B7"), 64)
    add_glow(image, (1040, 260), 200, hex_rgb("#90AFFF"), 40)

    draw.rounded_rectangle((72, 70, 1208, 650), radius=36, fill=(10, 16, 26, 218), outline=(132, 169, 214, 32))
    draw.text((106, 100), "Client Network + Discord Tools", font=FONT_H1, fill=(241, 247, 255))
    draw.text((108, 166), "Custom plugins shipped for network teams, live ops dashboards, Discord integrations, and event systems that keep communities moving.", font=FONT_BODY, fill=(161, 185, 217))

    client_names = ["SkyForge", "AetherRealms", "BeaconMC", "IronVale"]
    for idx, name in enumerate(client_names):
        x = 106 + ((idx % 2) * 272)
        y = 254 + ((idx // 2) * 148)
        active = idx == int(progress * len(client_names)) % len(client_names)
        fill = (26, 42, 66, 215) if active else (15, 24, 38, 205)
        outline = (131, 195, 255, 70) if active else (131, 169, 214, 28)
        draw.rounded_rectangle((x, y, x + 236, y + 120), radius=24, fill=fill, outline=outline)
        draw.text((x + 22, y + 22), name, font=FONT_H2, fill=(239, 246, 255))
        draw.text((x + 22, y + 68), "plugin support / gameplay VFX / ops tooling", font=FONT_SMALL, fill=(151, 175, 205))

    dashboard = (678, 232, 1164, 538)
    draw.rounded_rectangle(dashboard, radius=28, fill=(13, 20, 33, 228), outline=(132, 169, 214, 34))
    bar_heights = [0.36, 0.58, 0.44, 0.8, 0.66, 0.72]
    for idx, level in enumerate(bar_heights):
        x = 724 + (idx * 64)
        bar_top = 494 - int(level * 170 * (0.72 + (progress * 0.28)))
        draw.rounded_rectangle((x, bar_top, x + 32, 494), radius=12, fill=(105, 163, 235, 204))
        draw.rounded_rectangle((x, bar_top - 34, x + 32, bar_top - 6), radius=10, fill=(201, 227, 255, 72))
    draw.text((718, 266), "Live Plugin Rollouts", font=FONT_H2, fill=(238, 245, 254))
    draw.text((718, 312), "Shard deployments, command sync status, effect package loads,\nand Discord bridge health in a single view.", font=FONT_SMALL, fill=(151, 174, 204))

    draw.rounded_rectangle((678, 560, 1164, 626), radius=22, fill=(14, 21, 33, 212), outline=(132, 169, 214, 26))
    status_x = 720 + (progress * 340)
    draw.line((722, 593, 1116, 593), fill=(86, 110, 138), width=8)
    draw.ellipse((status_x - 18, 575, status_x + 18, 611), fill=(159, 220, 255))
    draw.text((726, 575), "Discord bridge synced / slash commands deployed / webhook rules live", font=FONT_SMALL, fill=(200, 221, 247))
    return np.array(image.convert("RGB"))


def render_video(filename: str, poster_filename: str, frame_factory) -> None:
    OUTPUT_DIR.mkdir(parents=True, exist_ok=True)
    output_path = OUTPUT_DIR / filename
    writer = imageio.get_writer(
        output_path,
        fps=FPS,
        codec="libx264",
        quality=8,
        pixelformat="yuv420p",
    )
    try:
        for frame_index in range(FRAMES):
            frame = frame_factory(frame_index)
            if frame_index == 0:
                imageio.imwrite(OUTPUT_DIR / poster_filename, frame)
            writer.append_data(frame)
    finally:
        writer.close()


def main() -> None:
    render_video("coding-reel.mp4", "coding-reel-poster.jpg", make_coding_frame)
    render_video("particle-reel.mp4", "particle-reel-poster.jpg", make_particle_frame)
    render_video("client-reel.mp4", "client-reel-poster.jpg", make_client_frame)
    print("Generated showcase videos in", OUTPUT_DIR)


if __name__ == "__main__":
    main()
