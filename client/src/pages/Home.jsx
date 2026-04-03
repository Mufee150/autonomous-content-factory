import { Link } from "react-router-dom";
import { ArrowRight, Zap, Brain, CheckCircle2, Mail, Sparkles } from "lucide-react";

export default function Home() {
  const features = [
    {
      icon: Brain,
      title: "Research Agent",
      description: "Extracts facts and key insights from your source material"
    },
    {
      icon: Sparkles,
      title: "Content Generation",
      description: "Creates blog posts, LinkedIn updates, Twitter threads, and emails"
    },
    {
      icon: CheckCircle2,
      title: "Editor Review",
      description: "Validates tone, consistency, and alignment automatically"
    }
  ];

  return (
    <div className="flex min-h-screen flex-col bg-gradient-to-br from-slate-50 via-blue-50 to-cyan-50">
      {/* Navigation */}
      <nav className="border-b border-white/20 bg-white/70 backdrop-blur-lg">
        <div className="mx-auto flex max-w-7xl items-center justify-between px-6 py-4">
          <div className="flex items-center gap-2">
            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-gradient-to-br from-blue-600 to-cyan-600">
              <Zap className="h-5 w-5 text-white" strokeWidth={3} />
            </div>
            <span className="font-bold text-slate-900">Autonomous</span>
          </div>
          <Link
            to="/dashboard"
            className="inline-flex items-center gap-2 rounded-lg bg-gradient-to-r from-blue-600 to-cyan-600 px-4 py-2 text-sm font-semibold text-white transition-all hover:shadow-lg"
          >
            Get Started
            <ArrowRight className="h-4 w-4" />
          </Link>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="mx-auto flex max-w-7xl flex-col items-center justify-center px-6 py-20 text-center sm:py-32">
        {/* Kicker */}
        <div className="mb-6 inline-flex items-center gap-2 rounded-full border border-blue-200/50 bg-blue-50/50 px-4 py-2 backdrop-blur-sm">
          <Sparkles className="h-4 w-4 text-blue-600" />
          <span className="text-sm font-semibold text-blue-700">
            AI Multi-Agent Platform
          </span>
        </div>

        {/* Main Headline */}
        <h1 className="mb-6 text-5xl font-bold leading-tight sm:text-6xl">
          Turn any document into
          <span className="bg-gradient-to-r from-blue-600 to-cyan-600 bg-clip-text text-transparent">
            {" "}
            a full campaign
          </span>
        </h1>

        {/* Subheadline */}
        <p className="mb-8 max-w-2xl text-lg text-slate-600">
          Transform source material into blog posts, LinkedIn articles, Twitter
          threads, and email content with AI-powered research and editorial
          review—all in minutes.
        </p>

        {/* CTA Button */}
        <div className="mb-16 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-center">
          <Link
            to="/dashboard"
            className="group relative inline-flex overflow-hidden rounded-xl bg-gradient-to-r from-blue-600 to-cyan-600 px-8 py-4 font-semibold text-white shadow-lg transition-all hover:shadow-xl hover:shadow-blue-500/40"
          >
            <span className="relative flex items-center gap-2">
              <span>Start Creating</span>
              <ArrowRight className="h-5 w-5 transition-transform group-hover:translate-x-1" />
            </span>
          </Link>
          <a
            href="#features"
            className="inline-flex items-center gap-2 rounded-xl border border-slate-300 px-8 py-4 font-semibold text-slate-900 transition-all hover:border-slate-400 hover:bg-slate-50"
          >
            Learn More
          </a>
        </div>

        {/* Hero Visual */}
        <div className="relative w-full max-w-4xl">
          <div className="absolute inset-0 -z-10 bg-gradient-to-r from-blue-600/20 to-cyan-600/20 blur-3xl" />
          <div className="rounded-2xl border border-white/20 bg-gradient-to-br from-white/80 to-white/60 p-8 shadow-2xl backdrop-blur-xl">
            <div className="space-y-4">
              {[1, 2, 3].map((i) => (
                <div key={i} className="h-3 rounded-full bg-gradient-to-r from-slate-200 to-slate-100" />
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section id="features" className="mx-auto w-full max-w-7xl px-6 py-20">
        <div className="mb-16 text-center">
          <h2 className="mb-4 text-4xl font-bold">How it Works</h2>
          <p className="text-lg text-slate-600">
            Our multi-agent system orchestrates research, generation, and review
          </p>
        </div>

        <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-3">
          {features.map((feature, index) => {
            const Icon = feature.icon;
            return (
              <div
                key={index}
                className="group rounded-2xl border border-white/20 bg-gradient-to-br from-white/80 to-white/60 p-8 shadow-lg transition-all duration-300 hover:-translate-y-2 hover:shadow-xl backdrop-blur-xl"
              >
                <div className="mb-4 inline-block rounded-xl bg-gradient-to-br from-blue-100 to-cyan-100 p-4 transition-all group-hover:scale-110">
                  <Icon className="h-6 w-6 text-blue-600" />
                </div>
                <h3 className="mb-2 text-lg font-bold text-slate-900">
                  {feature.title}
                </h3>
                <p className="text-slate-600">{feature.description}</p>
              </div>
            );
          })}
        </div>
      </section>

      {/* Output Examples Section */}
      <section className="mx-auto w-full max-w-7xl px-6 py-20">
        <div className="mb-16 text-center">
          <h2 className="mb-4 text-4xl font-bold">Generate Everything</h2>
          <p className="text-lg text-slate-600">
            From a single source, create multiple content formats
          </p>
        </div>

        <div className="grid gap-6 sm:grid-cols-2">
          {[
            { icon: "📄", label: "Blog Posts", color: "from-blue-100 to-blue-50" },
            { icon: "💼", label: "LinkedIn Content", color: "from-cyan-100 to-cyan-50" },
            {
              icon: "🧵",
              label: "Twitter Threads",
              color: "from-indigo-100 to-indigo-50"
            },
            { icon: "✉️", label: "Email Campaigns", color: "from-teal-100 to-teal-50" }
          ].map((item, index) => (
            <div
              key={index}
              className={`rounded-2xl border border-white/20 bg-gradient-to-br ${item.color} p-8 shadow-lg backdrop-blur-xl`}
            >
              <div className="text-4xl mb-4">{item.icon}</div>
              <h3 className="text-xl font-bold text-slate-900">{item.label}</h3>
              <p className="mt-2 text-sm text-slate-600">
                AI-generated and editorial-reviewed
              </p>
            </div>
          ))}
        </div>
      </section>

      {/* CTA Section */}
      <section className="mx-auto w-full max-w-7xl px-6 py-20">
        <div className="rounded-3xl border border-white/20 bg-gradient-to-r from-blue-600/10 to-cyan-600/10 p-12 text-center backdrop-blur-xl">
          <h2 className="mb-4 text-3xl font-bold">Ready to get started?</h2>
          <p className="mb-8 text-lg text-slate-600">
            Create your first campaign in seconds
          </p>
          <Link
            to="/dashboard"
            className="inline-flex items-center gap-2 rounded-xl bg-gradient-to-r from-blue-600 to-cyan-600 px-8 py-4 font-semibold text-white transition-all hover:shadow-lg hover:shadow-blue-500/40"
          >
            <span>Open Dashboard</span>
            <ArrowRight className="h-5 w-5" />
          </Link>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-white/20 bg-slate-900/50 py-8 backdrop-blur-lg">
        <div className="mx-auto max-w-7xl px-6 text-center text-sm text-slate-400">
          <p>© {new Date().getFullYear()} Autonomous Content Factory. All rights reserved.</p>
        </div>
      </footer>
    </div>
  );
}

