import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";
import logoUrl from "../../logo.png";
import {
  QrCode,
  Video,
  HardDrive,
  FileSpreadsheet,
  FileArchive,
  PackageCheck,
  PackageX,
  ShieldCheck,
  Lock,
  ArrowRight,
  RotateCcw,
  Clock,
  CheckCircle2,
  ScanLine,
} from "lucide-react";

const features = [
  {
    icon: QrCode,
    title: "Barcode-linked recording",
    desc: "Scan an order ID and the packing video is bound to it automatically. No manual file naming, no mismatched clips.",
  },
  {
    icon: Video,
    title: "Full HD packing video",
    desc: "Record crisp browser-side video with adjustable quality and clarity presets — straight from the packing station.",
  },
  {
    icon: RotateCcw,
    title: "Reverse 6-angle capture",
    desc: "Front, back, left, right, top, bottom. Guided sequential photo capture for returns and dispute-proof condition records.",
  },
  {
    icon: HardDrive,
    title: "Local-first storage",
    desc: "Footage saves straight to a folder you pick, auto-organized by month into forward/ and reverse/. Your data never leaves the building.",
  },
  {
    icon: FileSpreadsheet,
    title: "Automatic Excel log",
    desc: "Every session writes Date, Start, End, Order ID, Mode and File path to session.xlsx — an instant audit trail.",
  },
  {
    icon: ShieldCheck,
    title: "Duplicate-barcode guard",
    desc: "The same order can't be recorded twice in the same mode. Clean records, no double-counting, no disputes over which clip is real.",
  },
];

const steps = [
  {
    icon: ScanLine,
    title: "Scan the order",
    desc: "Scan or type the barcode at the packing station. ShipSight reserves the order ID.",
  },
  {
    icon: Video,
    title: "Record the pack",
    desc: "Hit record. The clip is tied to the order and timestamped from the first frame.",
  },
  {
    icon: FileArchive,
    title: "Auto-organize",
    desc: "Video and reverse photos land in dated forward/reverse folders, logged to Excel.",
  },
  {
    icon: PackageCheck,
    title: "Resolve disputes",
    desc: "A claim comes in? Pull the order ID, play the proof, close the case in seconds.",
  },
];

const Landing = () => {
  const navigate = useNavigate();

  const handleGoToVms = () => {
    const host = typeof window !== "undefined" ? window.location.hostname : "";
    const isLocal =
      host === "localhost" ||
      host === "127.0.0.1" ||
      /^(?:\d{1,3}\.){3}\d{1,3}$/.test(host);
    if (isLocal) {
      navigate("/vms");
    } else {
      window.location.href = "https://vms.shipsight.in/";
    }
  };

  return (
    <div className="min-h-screen bg-[hsl(var(--background))] text-foreground overflow-x-hidden">
      {/* Background */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div className="absolute inset-0 bg-gradient-to-br from-[#0a0f1e] via-[#0d1117] to-[#050810]" />
        <div className="absolute -top-40 -right-40 w-[32rem] h-[32rem] rounded-full bg-primary/10 blur-3xl" />
        <div className="absolute top-1/3 -left-40 w-[28rem] h-[28rem] rounded-full bg-primary/5 blur-3xl" />
      </div>

      <div className="relative z-10">
        {/* Header */}
        <header className="border-b border-[var(--glass-border)] bg-[var(--glass-light)] backdrop-blur-2xl sticky top-0 z-50">
          <div className="container mx-auto px-6 py-3 flex items-center justify-between">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 rounded-xl bg-[var(--glass-medium)] backdrop-blur-2xl border border-[var(--glass-border)] shadow-[var(--shadow-lg)] flex items-center justify-center">
                <img src={logoUrl} alt="ShipSight Logo" className="w-8 h-8 object-contain" />
              </div>
              <div>
                <h1 className="text-xl font-bold tracking-tight bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">
                  ShipSight
                </h1>
                <p className="text-xs text-muted-foreground font-medium">
                  One platform for all your shipments
                </p>
              </div>
            </div>
            <div className="hidden md:flex items-center gap-6 text-sm text-muted-foreground">
              <a href="#features" className="hover:text-foreground transition-colors">Features</a>
              <a href="#how" className="hover:text-foreground transition-colors">How it works</a>
              <a href="#usecases" className="hover:text-foreground transition-colors">Use cases</a>
            </div>
            <Button variant="glass-white" className="h-11 px-6 gap-2" onClick={handleGoToVms}>
              Go to VMS <ArrowRight className="w-4 h-4" />
            </Button>
          </div>
        </header>

        {/* Hero */}
        <section className="container mx-auto px-6 pt-20 pb-16">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <div>
              <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-[var(--glass-medium)] border border-[var(--glass-border)] text-xs font-medium text-muted-foreground mb-6">
                <ShieldCheck className="w-3.5 h-3.5 text-primary" />
                Proof-of-packing for e-commerce
              </div>
              <h2 className="text-4xl md:text-5xl lg:text-6xl font-bold leading-tight tracking-tight mb-6">
                Record every pack.
                <br />
                <span className="bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">
                  Kill every false claim.
                </span>
              </h2>
              <p className="text-lg text-muted-foreground mb-8 max-w-xl">
                ShipSight records a barcode-linked video of every order as it's packed — so a
                "wrong item" or "empty box" claim is settled with one clip, not a refund.
              </p>
              <div className="flex flex-col sm:flex-row gap-4">
                <Button variant="glass-white" className="h-12 px-8 text-base gap-2" onClick={handleGoToVms}>
                  Go to VMS <ArrowRight className="w-4 h-4" />
                </Button>
                <a href="#how">
                  <Button variant="glass" className="h-12 px-8 text-base w-full sm:w-auto">
                    See how it works
                  </Button>
                </a>
              </div>
              <div className="flex flex-wrap items-center gap-x-6 gap-y-2 mt-8 text-sm text-muted-foreground">
                <span className="flex items-center gap-2"><Lock className="w-4 h-4 text-primary" /> Local-first storage</span>
                <span className="flex items-center gap-2"><CheckCircle2 className="w-4 h-4 text-primary" /> No install — runs in browser</span>
              </div>
            </div>

            {/* App preview mock */}
            <div className="relative">
              <div className="bg-[var(--glass-medium)] backdrop-blur-2xl border border-[var(--glass-border)] rounded-3xl p-5 shadow-[var(--shadow-lg)]">
                {/* fake camera frame */}
                <div className="relative rounded-2xl overflow-hidden border border-[var(--glass-border)] bg-gradient-to-br from-[#0d1320] to-[#080c14] aspect-video flex items-center justify-center">
                  <div className="absolute top-3 left-3 flex items-center gap-2 px-3 py-1 rounded-full bg-destructive/20 border border-destructive/30">
                    <span className="w-2 h-2 rounded-full bg-destructive animate-pulse" />
                    <span className="text-xs font-semibold text-destructive">REC</span>
                  </div>
                  <div className="absolute top-3 right-3 px-3 py-1 rounded-lg bg-black/40 border border-white/10 text-xs font-mono text-foreground">
                    00:12
                  </div>
                  <Video className="w-14 h-14 text-primary/40" />
                  <div className="absolute bottom-3 left-3 px-3 py-1 rounded-lg bg-black/40 border border-white/10 text-xs font-mono text-foreground">
                    Order #SS-48213
                  </div>
                </div>
                {/* fake barcode row */}
                <div className="mt-4 flex items-center gap-3 rounded-2xl bg-[var(--glass-light)] border border-[var(--glass-border)] px-4 py-3">
                  <QrCode className="w-5 h-5 text-primary" />
                  <span className="text-sm font-mono text-foreground">SS-48213</span>
                  <span className="ml-auto text-xs px-2 py-0.5 rounded-md bg-[hsl(var(--success))]/15 text-[hsl(var(--success))] border border-[hsl(var(--success))]/30">
                    linked
                  </span>
                </div>
                {/* fake log rows */}
                <div className="mt-3 space-y-2">
                  {["Start: forward SS-48213", "Saved: /May 2026/forward/SS-48213.mp4"].map((t) => (
                    <div key={t} className="flex items-center gap-2 text-xs text-muted-foreground rounded-xl bg-[var(--glass-light)] border border-[var(--glass-border)] px-3 py-2">
                      <CheckCircle2 className="w-3.5 h-3.5 text-[hsl(var(--success))]" />
                      <span className="font-mono truncate">{t}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Problem strip */}
        <section className="container mx-auto px-6 py-8">
          <div className="grid sm:grid-cols-3 gap-4">
            {[
              { icon: PackageX, stat: "\"Item never arrived\"", label: "Fraudulent non-delivery claims drain margins on every disputed order." },
              { icon: PackageX, stat: "\"Wrong / damaged item\"", label: "No proof of what shipped means you eat the refund and the restock." },
              { icon: PackageCheck, stat: "One clip ends it", label: "A barcode-linked video is irrefutable evidence for the marketplace." },
            ].map((c) => (
              <div key={c.stat} className="bg-[var(--glass-medium)] backdrop-blur-2xl border border-[var(--glass-border)] rounded-2xl p-6">
                <c.icon className="w-6 h-6 text-primary mb-3" />
                <div className="text-base font-semibold mb-1">{c.stat}</div>
                <p className="text-sm text-muted-foreground">{c.label}</p>
              </div>
            ))}
          </div>
        </section>

        {/* Features */}
        <section id="features" className="container mx-auto px-6 py-20 scroll-mt-20">
          <div className="text-center max-w-2xl mx-auto mb-14">
            <h3 className="text-3xl md:text-4xl font-bold mb-4">Everything the packing station needs</h3>
            <p className="text-muted-foreground text-lg">
              Built for warehouse reality: fast scanning, clean records, and footage you can find in seconds.
            </p>
          </div>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {features.map((f) => (
              <div
                key={f.title}
                className="bg-[var(--glass-medium)] backdrop-blur-2xl border border-[var(--glass-border)] rounded-3xl p-7 shadow-[var(--shadow-lg)] hover:bg-[var(--glass-hover)] hover:shadow-[var(--shadow-glow)] transition-all duration-300"
              >
                <div className="w-12 h-12 rounded-2xl bg-primary/10 border border-primary/20 flex items-center justify-center mb-5">
                  <f.icon className="w-6 h-6 text-primary" />
                </div>
                <h4 className="text-lg font-semibold mb-2">{f.title}</h4>
                <p className="text-sm text-muted-foreground leading-relaxed">{f.desc}</p>
              </div>
            ))}
          </div>
        </section>

        {/* How it works */}
        <section id="how" className="container mx-auto px-6 py-20 scroll-mt-20">
          <div className="text-center max-w-2xl mx-auto mb-14">
            <h3 className="text-3xl md:text-4xl font-bold mb-4">From scan to settled in four steps</h3>
            <p className="text-muted-foreground text-lg">No setup, no training. If your team can scan a barcode, they can run ShipSight.</p>
          </div>
          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {steps.map((s, i) => (
              <div key={s.title} className="relative bg-[var(--glass-medium)] backdrop-blur-2xl border border-[var(--glass-border)] rounded-3xl p-7 shadow-[var(--shadow-lg)]">
                <div className="absolute top-6 right-6 text-4xl font-bold text-white/5">{i + 1}</div>
                <div className="w-12 h-12 rounded-2xl bg-primary/10 border border-primary/20 flex items-center justify-center mb-5">
                  <s.icon className="w-6 h-6 text-primary" />
                </div>
                <h4 className="text-lg font-semibold mb-2">{s.title}</h4>
                <p className="text-sm text-muted-foreground leading-relaxed">{s.desc}</p>
              </div>
            ))}
          </div>
        </section>

        {/* Use cases */}
        <section id="usecases" className="container mx-auto px-6 py-20 scroll-mt-20">
          <div className="grid lg:grid-cols-2 gap-10 items-center">
            <div>
              <h3 className="text-3xl md:text-4xl font-bold mb-6">Two modes, every scenario covered</h3>
              <div className="space-y-5">
                <div className="flex gap-4">
                  <div className="w-11 h-11 shrink-0 rounded-2xl bg-primary/10 border border-primary/20 flex items-center justify-center">
                    <PackageCheck className="w-5 h-5 text-primary" />
                  </div>
                  <div>
                    <h4 className="font-semibold mb-1">Forward — proof of dispatch</h4>
                    <p className="text-sm text-muted-foreground">Record the order being packed so "empty box" and "wrong item" claims die on contact.</p>
                  </div>
                </div>
                <div className="flex gap-4">
                  <div className="w-11 h-11 shrink-0 rounded-2xl bg-primary/10 border border-primary/20 flex items-center justify-center">
                    <RotateCcw className="w-5 h-5 text-primary" />
                  </div>
                  <div>
                    <h4 className="font-semibold mb-1">Reverse — proof of condition</h4>
                    <p className="text-sm text-muted-foreground">Guided 6-angle photos document a return's exact state before you accept it or issue a refund.</p>
                  </div>
                </div>
                <div className="flex gap-4">
                  <div className="w-11 h-11 shrink-0 rounded-2xl bg-primary/10 border border-primary/20 flex items-center justify-center">
                    <Clock className="w-5 h-5 text-primary" />
                  </div>
                  <div>
                    <h4 className="font-semibold mb-1">Audit-ready, always</h4>
                    <p className="text-sm text-muted-foreground">Timestamped Excel logs and dated folders mean any order's evidence is one search away.</p>
                  </div>
                </div>
              </div>
            </div>
            <div className="bg-[var(--glass-medium)] backdrop-blur-2xl border border-[var(--glass-border)] rounded-3xl p-8 shadow-[var(--shadow-glow)]">
              <div className="grid grid-cols-2 gap-4">
                {[
                  { k: "Marketplace sellers", v: "Amazon, Flipkart, Meesho disputes" },
                  { k: "D2C & fulfillment", v: "Per-order packing proof" },
                  { k: "Returns desks", v: "Condition before refund" },
                  { k: "3PL & warehouses", v: "Client-facing accountability" },
                ].map((c) => (
                  <div key={c.k} className="rounded-2xl bg-[var(--glass-light)] border border-[var(--glass-border)] p-5">
                    <div className="text-sm font-semibold mb-1">{c.k}</div>
                    <div className="text-xs text-muted-foreground">{c.v}</div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </section>

        {/* CTA */}
        <section className="container mx-auto px-6 py-20">
          <div className="bg-[var(--glass-medium)] backdrop-blur-2xl border border-[var(--glass-border)] rounded-3xl p-12 text-center shadow-[var(--shadow-glow)]">
            <h3 className="text-3xl md:text-4xl font-bold mb-4">Stop refunding fraud. Start recording proof.</h3>
            <p className="text-muted-foreground text-lg mb-8 max-w-xl mx-auto">
              Open the VMS, pick a folder, scan your first order. You'll have dispute-proof footage in under a minute.
            </p>
            <Button variant="glass-white" className="h-12 px-10 text-base gap-2" onClick={handleGoToVms}>
              Go to VMS <ArrowRight className="w-4 h-4" />
            </Button>
          </div>
        </section>

        {/* Footer */}
        <footer className="border-t border-[var(--glass-border)] bg-[var(--glass-light)] backdrop-blur-2xl">
          <div className="container mx-auto px-6 py-8 flex flex-col sm:flex-row items-center justify-between gap-4">
            <div className="flex items-center gap-3">
              <img src={logoUrl} alt="ShipSight Logo" className="w-7 h-7 object-contain" />
              <span className="text-sm text-muted-foreground">
                ShipSight — one platform for all your shipments
              </span>
            </div>
            <div className="flex items-center gap-6 text-sm text-muted-foreground">
              <a href="#features" className="hover:text-foreground transition-colors">Features</a>
              <a href="#how" className="hover:text-foreground transition-colors">How it works</a>
              <button onClick={handleGoToVms} className="hover:text-foreground transition-colors">Sign in</button>
            </div>
          </div>
        </footer>
      </div>
    </div>
  );
};

export default Landing;
