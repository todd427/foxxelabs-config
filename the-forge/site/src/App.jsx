import React, { useState, useEffect, useRef } from "react";
import {
  Brain, PenTool, Server, Gamepad2, Compass,
  Cpu, MemoryStick, HardDrive, Zap, Fan, CircuitBoard, Box, PcCase,
  ChevronRight, ChevronDown, RotateCcw, Share2, ExternalLink,
} from "lucide-react";

/* ──────────────────────────────────────────────────────────────────────────
   THE FORGE — a FoxxeLabs destination
   "What do you want it to do?" is the hook. Every answer is a doorway.
   Opinionated, named recipes. Click any part for info + a link.
─────────────────────────────────────────────────────────────────────────── */

const pp = (q) => `https://pcpartpicker.com/search/?q=${encodeURIComponent(q)}`;

const ARCHETYPES = [
  { id: "think",   Icon: Brain,    verb: "Think",   line: "Run models on your own iron. Train a voice. Own the weights.", klass: "Iris-class",  glow: "#5fd3c4" },
  { id: "make",    Icon: PenTool,  verb: "Make",    line: "A writer's rig. Words out, books out, nobody watching.",       klass: "Daisy-class", glow: "#f0a350" },
  { id: "serve",   Icon: Server,   verb: "Serve",   line: "Always on, never noticed. Your stack, your basement.",         klass: "Anseo-class", glow: "#9d7cff" },
  { id: "play",    Icon: Gamepad2, verb: "Play",    line: "The daily driver that quietly does real work too.",            klass: "Rose-class",  glow: "#ff6b8b" },
  { id: "explore", Icon: Compass,  verb: "Explore", line: "It comes with you. Field-ready, no apologies.",                klass: "Lava-class",  glow: "#ffd35f" },
];

const BUILDS = {
  think: {
    title: "The machine that thinks for itself",
    blurb:
      "This is the kind of box I run Macalla on — a QLoRA fine-tune that keeps a novelist's voice. Built it four times. The PSU is not where you save money.",
    price: "€5,870",
    parts: [
      { Icon: Cpu, name: "Intel Core Ultra 9 285K", note: "24 threads of patience.", q: "Intel Core Ultra 9 285K",
        info: "For local AI the win is the PCIe lanes and memory bandwidth feeding the GPU, not raw clock speed. Don't pay for overclock headroom you'll never touch under sustained inference." },
      { Icon: CircuitBoard, name: "Z890 board · DDR5 · Wi-Fi 6E", note: "Boring on purpose.", q: "Z890 motherboard DDR5",
        info: "The board should do nothing exciting: clean power delivery, two M.2 slots, a BIOS that doesn't fight you. Wi-Fi 6E is a nicety, not a reason to pay up." },
      { Icon: Box, name: "RTX 5080 · 16GB", note: "5090 if you've the budget. You don't.", q: "RTX 5080",
        info: "VRAM is the wall, not FLOPS. 16GB fine-tunes 7–8B models comfortably with QLoRA; 70B wants a 5090's 32GB or aggressive quantisation. Buy the most VRAM you can stomach." },
      { Icon: MemoryStick, name: "128GB DDR5-6000", note: "RAM is cheap. Regret is not.", q: "DDR5 6000 128GB",
        info: "Offloading layers to system RAM rescues you when a model won't fit in VRAM, and dataset prep is memory-hungry. 6000 MT/s is the ceiling before you start fighting the memory controller." },
      { Icon: HardDrive, name: "2TB Gen4 NVMe + 8TB store", note: "Models are fat.", q: "2TB Gen4 NVMe SSD",
        info: "Fast NVMe for the OS and the model you're running; a bulk drive for the dozen you're hoarding. A single 7B checkpoint is 14GB+ before you've started collecting." },
      { Icon: Zap, name: "1200W Platinum · ATX 3.1", note: "The be quiet! 1000W died on first power-on. Don't.", q: "1200W Platinum ATX 3.1 PSU",
        info: "ATX 3.1 matters because a 5090 spikes hard and briefly; a PSU sized off average watts will trip under load a calculator says is fine. This is the part people cheap out on and the part that takes the rest of the build with it." },
      { Icon: Fan, name: "360mm AIO", note: "Measure your case first. Ask me how I know.", q: "360mm AIO cooler",
        info: "The 285K dumps real heat under sustained load; air can manage it, a 360 keeps it quiet. Measure your case's radiator clearance before buying — a 360 that won't fit is an expensive paperweight." },
      { Icon: PcCase, name: "Fractal Meshify 2 · airflow", note: "The full one. The Compact only takes a 240 — that's the lesson.", q: "Fractal Design Meshify 2",
        info: "Mesh front for the heat a 285K and a 5080 throw off, clearance for a 360 up top, and length for a long card. The Compact tops out at a 240 radiator — learn that before you buy the cooler, not after." },
    ],
    doorway: { world: "Macalla",
      pitch: "Once it boots, the interesting question isn't the hardware — it's what you teach it. Macalla is a voice-preserving fine-tune: feed it a writer's corpus, get the writer back." },
    boot: ["POST… ok", "cuda-keyring repo — NOT autoinstall (Blackwell, 24.04)", "nvidia-smi → RTX 5080 detected", "ollama serve → up", "loading Macalla · voice model warm", "> first token"],
  },

  make: {
    title: "A writer's rig",
    blurb:
      "Quiet, fast where it counts, no light show. You're here to put words on a page and ship books — not to watch fans spin. Ubuntu, vi, done.",
    price: "€2,280",
    parts: [
      { Icon: Cpu, name: "Ryzen 7 9700X", note: "Cool and quick.", q: "Ryzen 7 9700X",
        info: "Eight fast cores, low heat, no drama. Compiling, layout, and light local models all run happily — you don't need more silicon to write and ship books." },
      { Icon: CircuitBoard, name: "B650 board · DDR5", note: "Spend the savings on storage.", q: "B650 motherboard",
        info: "B650 covers everything a creator needs and skips the enthusiast tax. Put the saved money into storage, where you'll actually feel it day to day." },
      { Icon: Box, name: "RTX 5060 OC · 8GB", note: "Plenty for layout and light local AI.", q: "RTX 5060",
        info: "Drives layout previews, handles small local AI, stays quiet. 8GB is honest here; the day you're fine-tuning seriously, you've outgrown this build and want the Think box." },
      { Icon: MemoryStick, name: "128GB DDR5", note: "Because tabs.", q: "DDR5 128GB",
        info: "Overkill for prose, exactly right for keeping forty browser tabs, a design app, and a resident local model open at once without ever thinking about it." },
      { Icon: HardDrive, name: "2TB NVMe", note: "Manuscripts don't weigh much.", q: "2TB NVMe SSD",
        info: "The manuscripts are tiny; the asset library, fonts, and exports aren't. One fast drive keeps the whole workflow snappy without juggling." },
      { Icon: Zap, name: "750W Gold", note: "Right-sized. Resist the urge.", q: "750W Gold PSU",
        info: "Correctly sized for a single mid GPU with headroom to spare. Bigger isn't safer here — just less efficient sitting at idle all day." },
      { Icon: Fan, name: "Tower air cooler", note: "No pump to fail at 2am.", q: "tower air cooler CPU",
        info: "A good air tower matches a 240 AIO thermally with nothing to leak or fail. For an always-on writer's machine, that reliability beats a couple of degrees." },
      { Icon: PcCase, name: "Fractal North · quiet", note: "Looks like furniture. That's the point.", q: "Fractal Design North",
        info: "A walnut front and sound-dampened panels — it belongs on the desk you write at, not on a gamer's shelf. Good airflow without the light show, which is exactly the brief." },
    ],
    doorway: { world: "Cló",
      pitch: "The rig is the easy part. Cló is the publishing spine — import a manuscript, translate a chapter, export an EPUB that passes epubcheck clean. The machine just gets out of the way." },
    boot: ["POST… ok", "Ubuntu 24.04 LTS", "vi /home/Projects/manuscript.md", "epubcheck → 0 errors", "> chapter one"],
  },

  serve: {
    title: "Always on, never noticed",
    blurb:
      "The box that runs your life and never asks for attention. Modest silicon, serious storage, and an uptime number you'll quietly be proud of.",
    price: "€1,290",
    parts: [
      { Icon: Cpu, name: "Ryzen 5 8500G", note: "Sips power. Does the job.", q: "Ryzen 5 8500G",
        info: "An APU sips power and hands you a GPU for free, which is all a headless box needs. Low TDP means low heat means it survives in a cupboard for years." },
      { Icon: CircuitBoard, name: "B650 ITX", note: "Small footprint, big patience.", q: "B650 ITX motherboard",
        info: "Small board, small case, small power bill. ITX keeps the footprint honest for something that lives on a shelf and is forgotten." },
      { Icon: Box, name: "iGPU", note: "A server doesn't need a graphics card. Truly.", q: "AMD APU",
        info: "A server genuinely doesn't want a discrete card — it's heat, noise, and cost for nothing. The APU's integrated graphics drive the console you'll never look at." },
      { Icon: MemoryStick, name: "64GB DDR5", note: "Headroom for containers.", q: "DDR5 64GB",
        info: "Containers are cheap until they aren't. 64GB lets you stack databases, a reverse proxy, and a dozen services without ever touching swap." },
      { Icon: HardDrive, name: "4× 8TB + NVMe boot", note: "Redundancy is not optional.", q: "8TB NAS HDD",
        info: "Redundancy isn't optional on a box you trust with your data. Mirror the spinning disks and boot from a small fast NVMe kept separate from the array." },
      { Icon: Zap, name: "650W Gold", note: "Efficiency over headroom here.", q: "650W Gold PSU",
        info: "Efficiency beats headroom for an always-on machine — you pay for every idle watt, every hour, forever. Size it tight." },
      { Icon: Fan, name: "Low-noise 120mm", note: "It lives in a cupboard. Be kind.", q: "Noctua 120mm fan",
        info: "It lives near people. Pick fans rated quiet at low RPM — a server you can hear is a server you'll come to resent." },
      { Icon: PcCase, name: "Fractal Node 304 · 6 bays", note: "Small box, room for the array.", q: "Fractal Design Node 304",
        info: "An ITX footprint with bays for the mirrored drives, so the whole array lives in one quiet shelf-sized box. A server's case is about drive cages and silence, not glass." },
    ],
    doorway: { world: "Anseo",
      pitch: "Self-hosting is the gateway drug. Anseo is what you point it at — a community platform on Django and the Fly stack. Start with one service; you'll have nine by spring." },
    boot: ["POST… ok", "docker compose up -d", "postgres → healthy", "tailscale up → mesh joined", "uptime: 364 days (don't jinx it)", "> serving"],
  },

  play: {
    title: "The daily driver",
    blurb:
      "Looks like a gaming PC. Is also where the real work hides — WSL2, a sane GPU, and enough RAM that you never think about it. The honest workhorse.",
    price: "€2,590",
    parts: [
      { Icon: Cpu, name: "Ryzen 7 9800X3D", note: "The one that actually games.", q: "Ryzen 7 9800X3D",
        info: "The 3D V-Cache is what actually moves frame rates, and it doesn't cost you in the dev work either. The one CPU that's genuinely best-in-class for play." },
      { Icon: CircuitBoard, name: "X670E board", note: "Room to grow.", q: "X670E motherboard",
        info: "More lanes and better upgrade headroom than B-series, which matters when this 'gaming' box quietly becomes your everything box." },
      { Icon: Box, name: "RTX 5070 · 12GB", note: "1440p high, all day.", q: "RTX 5070",
        info: "12GB and the horsepower for 1440p at high settings all day. The sweet spot before prices go silly for marginal extra frames." },
      { Icon: MemoryStick, name: "64GB DDR5-6000", note: "Game and a dozen containers.", q: "DDR5 6000 64GB",
        info: "Enough to game and run a WSL2 dev stack with containers at the same time without either noticing. 6000 is the value/latency sweet spot on AM5." },
      { Icon: HardDrive, name: "2TB Gen4 NVMe", note: "Fast loads, no fuss.", q: "2TB Gen4 NVMe SSD",
        info: "Modern games are enormous; one fast 2TB drive saves you the constant install-uninstall shuffle." },
      { Icon: Zap, name: "850W Gold · ATX 3.1", note: "Honest headroom.", q: "850W Gold ATX 3.1 PSU",
        info: "Honest headroom for a 5070 with transient-spike support, so a future GPU bump doesn't also mean a new PSU." },
      { Icon: Fan, name: "280mm AIO", note: "Quiet under load.", q: "280mm AIO cooler",
        info: "Keeps the X3D cool and quiet under sustained load. 280 is a sensible middle ground when a 360 is overkill for the case." },
      { Icon: PcCase, name: "Lian Li Lancool 216 · glass", note: "Show the build. You earned it.", q: "Lian Li Lancool 216",
        info: "Big front fans, a tempered-glass side, room for the AIO and a long card. This is the one build where looking like a gaming PC is the brief — so let it." },
    ],
    doorway: { world: "the whole cast",
      pitch: "Every machine here started as somebody's daily driver. Rose runs my day and a WSL2 dev stack at the same time. The fun secret: the box you bought for games is the one you'll learn everything on." },
    boot: ["POST… ok", "Windows + WSL2 Ubuntu", "GPU passthrough → ok", "steam → ready · code → ready", "> press play"],
  },

  explore: {
    title: "It comes with you",
    blurb:
      "Not a build — a choice. The machine that goes where you go and still pulls its weight on the train, in a café, at someone else's kitchen table. Field-ready.",
    price: "€1,950",
    parts: [
      { Icon: Cpu, name: "Mobile Ryzen AI 9", note: "Battery and brains.", q: "Ryzen AI 9 laptop",
        info: "An NPU plus a capable CPU means real on-device AI without the battery falling off a cliff. The whole point of a portable is doing the work away from the wall." },
      { Icon: Box, name: "RTX 5070 mobile", note: "Real GPU, real bag weight.", q: "RTX 5070 laptop",
        info: "A real mobile GPU buys actual inference and rendering on the move — at the cost of bag weight and battery life. Choose it only if you'll genuinely use it." },
      { Icon: MemoryStick, name: "64GB soldered", note: "Order it right the first time.", q: "64GB laptop",
        info: "Laptop RAM is usually soldered, so there's no upgrading later. Order the configuration you'll want in three years, today — there are no second chances." },
      { Icon: HardDrive, name: "2TB NVMe", note: "Everything, with you.", q: "2TB laptop SSD",
        info: "Everything you own, in a bag. Get the bigger drive up front — you can't bolt on a second one at a café." },
      { Icon: Zap, name: "100W USB-C PD", note: "One cable to rule them.", q: "100W USB-C PD charger",
        info: "One cable charges the laptop, the phone, and the dock. That freedom is most of the reason you bought a portable in the first place." },
      { Icon: Fan, name: "Vapour chamber", note: "It'll get warm. It's a laptop.", q: "laptop vapour chamber cooling",
        info: "Thin chassis plus a real GPU means heat has nowhere to go; a vapour chamber is the line between sustained performance and thermal throttling. It'll still get warm — physics doesn't negotiate." },
    ],
    doorway: { world: "the field",
      pitch: "The desktops stay home. Lava goes to Barnt Green, to the viva, to wherever the work is. A portable that does real inference changes where you're allowed to think." },
    boot: ["POST… ok", "lid open → resume in 0.8s", "battery: 91%", "vi on a train → still works", "> anywhere"],
  },
};

const INSTANCE_NAMES = ["Sionnach", "Rua", "Faolán", "Breac", "Luan", "Néal", "Tine", "Gaoth", "Aodh", "Caoán", "Méabh", "Oisín"];

const styles = `
@import url('https://fonts.googleapis.com/css2?family=Fraunces:ital,opsz,wght@0,9..144,400;0,9..144,600;1,9..144,400;1,9..144,500&family=JetBrains+Mono:wght@400;500;700&display=swap');
* { box-sizing: border-box; margin: 0; padding: 0; }
.forge {
  --ink:#0c0d11; --ink-2:#141620; --panel:#181a25; --line:#2a2d3d;
  --amber:#f0a350; --txt:#e7e4dc; --dim:#8a8a98; --glow:#5fd3c4;
  font-family:'JetBrains Mono',monospace; background:var(--ink); color:var(--txt);
  min-height:100vh; position:relative; overflow-x:hidden;
}
.forge::before { content:""; position:fixed; inset:0; pointer-events:none; z-index:1;
  background-image:url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='120' height='120'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='2'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)' opacity='0.035'/%3E%3C/svg%3E"); }
.wrap { position:relative; z-index:2; max-width:980px; margin:0 auto; padding:0 24px; }
.serif { font-family:'Fraunces',serif; }

.brand { display:flex; align-items:baseline; gap:12px; padding:28px 0 0; letter-spacing:0.04em; }
.brand .dot { width:9px; height:9px; border-radius:50%; background:var(--amber); box-shadow:0 0 12px var(--amber); align-self:center; }
.brand .name { font-weight:700; font-size:13px; }
.brand .by { font-size:11px; color:var(--dim); margin-left:auto; }

.hook { padding:60px 0 40px; text-align:center; }
.hook h1 { font-family:'Fraunces',serif; font-weight:400; font-size:clamp(40px,8vw,78px); line-height:1.02; letter-spacing:-0.02em; margin-bottom:8px; }
.hook h1 em { font-style:italic; color:var(--amber); }
.hook .sub { color:var(--dim); font-size:14px; max-width:480px; margin:0 auto 12px; line-height:1.6; }
.cards { display:grid; grid-template-columns:repeat(auto-fit,minmax(168px,1fr)); gap:14px; margin-top:38px; }
.card { background:var(--panel); border:1px solid var(--line); border-radius:4px; padding:22px 18px; text-align:left; cursor:pointer; position:relative; overflow:hidden;
  transition:transform .25s cubic-bezier(.2,.8,.2,1),border-color .25s,box-shadow .25s; opacity:0; animation:rise .6s forwards; }
.card:hover { transform:translateY(-4px); border-color:var(--cardglow); box-shadow:0 12px 40px -20px var(--cardglow); }
.card .ic { color:var(--cardglow); margin-bottom:14px; }
.card .verb { font-family:'Fraunces',serif; font-size:26px; font-weight:500; margin-bottom:8px; }
.card .ln { font-size:12px; color:var(--dim); line-height:1.55; min-height:54px; }
.card .klass { font-size:10px; letter-spacing:0.12em; text-transform:uppercase; color:var(--cardglow); margin-top:14px; display:flex; align-items:center; gap:4px; }
.card::after { content:""; position:absolute; left:0; right:0; bottom:0; height:2px; background:var(--cardglow); transform:scaleX(0); transform-origin:left; transition:transform .3s; }
.card:hover::after { transform:scaleX(1); }
@keyframes rise { to { opacity:1; transform:translateY(0); } }

.stage { padding:44px 0 80px; opacity:0; animation:fade .5s forwards; }
@keyframes fade { from { opacity:0; transform:translateY(8px);} to { opacity:1; transform:translateY(0);} }
.back { background:none; border:none; color:var(--dim); font-family:inherit; font-size:12px; cursor:pointer; display:inline-flex; align-items:center; gap:6px; margin-bottom:26px; }
.back:hover { color:var(--amber); }
.eyebrow { font-size:11px; letter-spacing:0.2em; text-transform:uppercase; color:var(--klass); margin-bottom:12px; }
.r-title { font-family:'Fraunces',serif; font-size:clamp(30px,5vw,46px); font-weight:400; line-height:1.05; letter-spacing:-0.01em; margin-bottom:18px; }
.guide { border-left:2px solid var(--amber); padding:4px 0 4px 18px; margin:0 0 30px; font-family:'Fraunces',serif; font-style:italic; font-size:16px; line-height:1.6; color:#cfc9bd; max-width:620px; }

.partlist { display:flex; flex-direction:column; gap:1px; background:var(--line); border:1px solid var(--line); border-radius:4px; overflow:hidden; }
.part { background:var(--panel); }
.part-head { display:flex; align-items:center; gap:16px; padding:15px 18px; cursor:pointer; transition:background .15s; }
.part-head:hover { background:#1d2030; }
.part-head .pi { color:var(--klass); flex-shrink:0; }
.part-head .col { display:flex; flex-direction:column; flex:1; }
.part-head .pn { font-size:14px; font-weight:500; }
.part-head .pnote { font-size:11px; color:var(--dim); margin-top:2px; }
.part-head .chev { color:var(--dim); transition:transform .25s; flex-shrink:0; }
.part-head .chev.open { transform:rotate(180deg); color:var(--klass); }
.part-body { max-height:0; overflow:hidden; transition:max-height .3s ease; }
.part-body.open { max-height:240px; }
.part-body .inner { padding:2px 18px 18px 54px; }
.part-body .info { font-size:12.5px; line-height:1.65; color:#bdb9b0; margin-bottom:12px; }
.part-link { display:inline-flex; align-items:center; gap:6px; font-size:11px; letter-spacing:0.05em; text-transform:uppercase; color:var(--klass); text-decoration:none; border:1px solid var(--line); padding:7px 12px; border-radius:3px; transition:border-color .2s,color .2s; }
.part-link:hover { border-color:var(--klass); }

.pricebar { display:flex; align-items:center; justify-content:space-between; margin-top:26px; flex-wrap:wrap; gap:18px; }
.price { font-family:'Fraunces',serif; font-size:34px; }
.price small { font-size:12px; color:var(--dim); font-family:'JetBrains Mono'; display:block; letter-spacing:0.1em; }
.hint { font-size:11px; color:var(--dim); margin-top:10px; }

.btn { background:var(--amber); color:#1a1206; border:none; border-radius:3px; font-family:inherit; font-weight:700; font-size:13px; letter-spacing:0.06em; padding:14px 26px; cursor:pointer; display:inline-flex; align-items:center; gap:8px; transition:transform .15s,background .2s; text-transform:uppercase; }
.btn:hover { background:#ffbc6e; transform:translateY(-2px); }
.btn.ghost { background:transparent; color:var(--txt); border:1px solid var(--line); }
.btn.ghost:hover { border-color:var(--amber); color:var(--amber); }

.assemble { min-height:60vh; }
.asm-part { display:flex; align-items:center; gap:16px; background:var(--panel); border:1px solid var(--line); border-radius:4px; padding:16px 18px; margin-bottom:10px; opacity:0; transform:translateX(-24px); animation:slot .5s forwards; }
@keyframes slot { to { opacity:1; transform:translateX(0); } }
.asm-part .pi { color:var(--klass); }
.asm-narr { font-family:'Fraunces',serif; font-style:italic; color:#cfc9bd; font-size:15px; min-height:30px; margin:8px 0 24px; padding-left:4px; }
.progress { height:3px; background:var(--line); border-radius:2px; overflow:hidden; margin-bottom:30px; }
.progress > div { height:100%; background:var(--amber); transition:width .5s ease; }

.boot { background:#06070a; border:1px solid var(--line); border-radius:6px; padding:28px; min-height:320px; box-shadow:inset 0 0 60px -20px var(--glow); }
.boot .bar { display:flex; gap:7px; margin-bottom:20px; }
.boot .bar i { width:11px; height:11px; border-radius:50%; display:block; }
.boot-line { font-size:13px; line-height:1.9; color:var(--glow); opacity:0; animation:fade .3s forwards; }
.boot-line.prompt { color:var(--amber); font-weight:700; font-size:16px; }
.boot-line .pre { color:var(--dim); margin-right:8px; }
.cursor { display:inline-block; width:9px; height:16px; background:var(--glow); margin-left:4px; animation:blink 1s steps(1) infinite; vertical-align:middle; }
@keyframes blink { 50% { opacity:0; } }

.specwrap { text-align:center; }
.alive { font-family:'Fraunces',serif; font-style:italic; font-size:22px; color:var(--glow); margin-bottom:6px; opacity:0; animation:fade .6s .1s forwards; }
.spec { background:linear-gradient(160deg,var(--ink-2),var(--panel)); border:1px solid var(--cardglow); border-radius:8px; padding:34px; margin:24px auto 0; max-width:560px; text-align:left; box-shadow:0 30px 80px -40px var(--cardglow); position:relative; overflow:hidden; }
.spec::before { content:""; position:absolute; top:0; left:0; right:0; height:3px; background:var(--cardglow); }
.spec .sname { font-family:'Fraunces',serif; font-size:42px; line-height:1; margin-bottom:4px; }
.spec .sclass { font-size:11px; letter-spacing:0.2em; text-transform:uppercase; color:var(--cardglow); margin-bottom:22px; }
.spec .srow { display:flex; justify-content:space-between; font-size:12px; padding:7px 0; border-bottom:1px dashed var(--line); }
.spec .srow span:first-child { color:var(--dim); }
.spec .sprice { font-family:'Fraunces',serif; font-size:26px; margin-top:18px; }
.doorway { background:var(--ink-2); border:1px solid var(--line); border-radius:6px; padding:26px; margin:30px auto 0; max-width:560px; text-align:left; }
.doorway .dlabel { font-size:11px; letter-spacing:0.18em; text-transform:uppercase; color:var(--amber); margin-bottom:10px; }
.doorway .dpitch { font-family:'Fraunces',serif; font-size:16px; line-height:1.65; color:#cfc9bd; }
.endrow { display:flex; gap:12px; justify-content:center; margin-top:30px; flex-wrap:wrap; }
.foot { text-align:center; color:var(--dim); font-size:11px; padding:40px 0 60px; line-height:1.7; }
.foot .cast { color:var(--amber); }
`;

function Hook({ onPick }) {
  return (
    <div className="hook">
      <h1>What do you want<br />it to <em>do?</em></h1>
      <p className="sub">Not "what's your budget." The machine is the vehicle. The question is the doorway.</p>
      <div className="cards">
        {ARCHETYPES.map((a, i) => (
          <button key={a.id} className="card" style={{ "--cardglow": a.glow, animationDelay: `${i * 0.08}s` }} onClick={() => onPick(a)}>
            <a.Icon className="ic" size={28} strokeWidth={1.5} />
            <div className="verb serif">{a.verb}</div>
            <div className="ln">{a.line}</div>
            <div className="klass">{a.klass} <ChevronRight size={12} /></div>
          </button>
        ))}
      </div>
    </div>
  );
}

function Recipe({ arch, onBack, onBuild }) {
  const b = BUILDS[arch.id];
  const [open, setOpen] = useState(null);
  return (
    <div className="stage" style={{ "--klass": arch.glow }}>
      <button className="back" onClick={onBack}><RotateCcw size={13} /> start over</button>
      <div className="eyebrow">{arch.klass} · to {arch.verb.toLowerCase()}</div>
      <h2 className="r-title serif">{b.title}</h2>
      <p className="guide">{b.blurb}</p>
      <div className="partlist">
        {b.parts.map((p, i) => {
          const isOpen = open === i;
          return (
            <div className="part" key={i}>
              <div className="part-head" onClick={() => setOpen(isOpen ? null : i)}>
                <p.Icon className="pi" size={20} strokeWidth={1.5} />
                <div className="col">
                  <span className="pn">{p.name}</span>
                  <span className="pnote">{p.note}</span>
                </div>
                <ChevronDown className={`chev ${isOpen ? "open" : ""}`} size={18} />
              </div>
              <div className={`part-body ${isOpen ? "open" : ""}`}>
                <div className="inner">
                  <p className="info">{p.info}</p>
                  <a className="part-link" href={pp(p.q)} target="_blank" rel="noopener noreferrer">
                    Look it up <ExternalLink size={12} />
                  </a>
                </div>
              </div>
            </div>
          );
        })}
      </div>
      <p className="hint">↳ tap any part for why it's here and where to buy it.</p>
      <div className="pricebar">
        <div className="price serif">{b.price}<small>OPINIONATED · EU EST.</small></div>
        <button className="btn" onClick={onBuild}>Build it <ChevronRight size={16} /></button>
      </div>
    </div>
  );
}

function Assemble({ arch, onDone }) {
  const b = BUILDS[arch.id];
  const [n, setN] = useState(0);
  useEffect(() => {
    if (n >= b.parts.length) { const t = setTimeout(onDone, 900); return () => clearTimeout(t); }
    const t = setTimeout(() => setN((x) => x + 1), 620); return () => clearTimeout(t);
  }, [n]);
  const shown = b.parts.slice(0, n);
  const narration = n > 0 && n <= b.parts.length ? b.parts[n - 1].note : "Laying out the bench…";
  return (
    <div className="stage assemble" style={{ "--klass": arch.glow }}>
      <div className="eyebrow">Assembling · {arch.klass}</div>
      <h2 className="r-title serif" style={{ fontSize: "30px", marginBottom: 12 }}>{b.title}</h2>
      <div className="progress"><div style={{ width: `${(n / b.parts.length) * 100}%` }} /></div>
      <div className="asm-narr">“{narration}”</div>
      {shown.map((p, i) => (
        <div className="asm-part" key={i}><p.Icon className="pi" size={20} strokeWidth={1.5} /><span className="pn">{p.name}</span></div>
      ))}
    </div>
  );
}

function Boot({ arch, onDone }) {
  const b = BUILDS[arch.id];
  const [n, setN] = useState(0);
  useEffect(() => {
    if (n >= b.boot.length) { const t = setTimeout(onDone, 1100); return () => clearTimeout(t); }
    const last = n === b.boot.length - 1;
    const t = setTimeout(() => setN((x) => x + 1), last ? 700 : 520); return () => clearTimeout(t);
  }, [n]);
  return (
    <div className="stage" style={{ "--glow": arch.glow }}>
      <div className="boot">
        <div className="bar"><i style={{ background: "#ff5f57" }} /><i style={{ background: "#febc2e" }} /><i style={{ background: "#28c840" }} /></div>
        {b.boot.slice(0, n).map((line, i) => {
          const prompt = line.startsWith(">");
          return (
            <div className={`boot-line ${prompt ? "prompt" : ""}`} key={i}>
              {!prompt && <span className="pre">·</span>}{line}{prompt && i === n - 1 && <span className="cursor" />}
            </div>
          );
        })}
      </div>
    </div>
  );
}

function SpecCard({ arch, name, onRestart }) {
  const b = BUILDS[arch.id];
  return (
    <div className="stage specwrap" style={{ "--cardglow": arch.glow }}>
      <div className="alive">it's alive.</div>
      <div className="spec">
        <div className="sname serif">{name}</div>
        <div className="sclass">{arch.klass} · built to {arch.verb.toLowerCase()}</div>
        {b.parts.map((p, i) => (
          <div className="srow" key={i}><span>{p.name.split(",")[0].split("·")[0].trim()}</span><span>✓</span></div>
        ))}
        <div className="sprice serif">{b.price}</div>
      </div>
      <div className="doorway">
        <div className="dlabel">↳ where this leads · {b.doorway.world}</div>
        <div className="dpitch">{b.doorway.pitch}</div>
      </div>
      <div className="endrow">
        <button className="btn" onClick={() => alert(`Spec card for "${name}" — share sheet would open here.`)}><Share2 size={15} /> Share {name}</button>
        <button className="btn ghost" onClick={onRestart}><RotateCcw size={15} /> Build another</button>
      </div>
    </div>
  );
}

export default function App() {
  const [stage, setStage] = useState("hook");
  const [arch, setArch] = useState(null);
  const nameRef = useRef("");
  function pick(a) { setArch(a); setStage("recipe"); }
  function build() { nameRef.current = INSTANCE_NAMES[Math.floor(Math.random() * INSTANCE_NAMES.length)]; setStage("assemble"); }
  function restart() { setArch(null); setStage("hook"); }
  return (
    <div className="forge">
      <style>{styles}</style>
      <div className="wrap">
        <div className="brand"><span className="dot" /><span className="name">THE FORGE</span><span className="by">a FoxxeLabs destination</span></div>
        {stage === "hook" && <Hook onPick={pick} />}
        {stage === "recipe" && <Recipe arch={arch} onBack={restart} onBuild={build} />}
        {stage === "assemble" && <Assemble arch={arch} onDone={() => setStage("boot")} />}
        {stage === "boot" && <Boot arch={arch} onDone={() => setStage("card")} />}
        {stage === "card" && <SpecCard arch={arch} name={nameRef.current} onRestart={restart} />}
        <div className="foot">
          The cast: <span className="cast">Iris</span> · <span className="cast">Rose</span> · <span className="cast">Daisy</span> · <span className="cast">Lava</span>
          <br />Named machines with jobs. Every other build site shows you "Gaming Build — €1,500."
        </div>
      </div>
    </div>
  );
}
