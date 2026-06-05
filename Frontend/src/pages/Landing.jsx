import { useState } from "react";
import { Link } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import {
  Layers,
  ArrowRight,
  CheckCircle,
  FolderKanban,
  ListTodo,
  BarChart3,
  ShieldCheck,
  ChevronDown,
  ChevronUp,
  Sparkles,
} from "lucide-react";

export default function Landing() {
  const { currentUser } = useAuth();
  const [expandedFaq, setExpandedFaq] = useState(null);

  const toggleFaq = (index) => {
    setExpandedFaq(expandedFaq === index ? null : index);
  };

  const faqs = [
    {
      q: "Is TaskFlow really free?",
      a: "Yes! TaskFlow is free to use for personal project and task management. Create an account, sign in, and manage your workspace through the connected backend.",
    },
    {
      q: "Where is my project data stored?",
      a: "Your project data is stored in MongoDB through the TaskFlow API. Authentication uses secure HTTP-only cookies for session handling.",
    },
    {
      q: "Does TaskFlow include a backend server?",
      a: "Yes. The app includes an Express and Mongoose API for users, projects, tasks, and subtasks, with Axios used on the frontend.",
    },
    {
      q: "Does it support mobile devices?",
      a: "Yes, TaskFlow is designed to be fully responsive, scaling smoothly from large desktop displays to mobile phones and tablets.",
    },
  ];

  return (
    <div className="min-h-screen bg-slate-50/50 dark:bg-slate-950 text-slate-805 dark:text-slate-100 selection:bg-indigo-500 selection:text-white relative transition-colors duration-200">
      <div className="absolute top-0 left-1/4 w-[600px] h-[600px] bg-indigo-50/30 dark:bg-indigo-950/10 rounded-full blur-3xl pointer-events-none -z-10" />
      <div className="absolute top-[800px] right-1/4 w-[500px] h-[500px] bg-slate-100/40 dark:bg-slate-900/10 rounded-full blur-3xl pointer-events-none -z-10" />

      <header className="sticky top-0 z-50 bg-white/75 dark:bg-slate-900/75 backdrop-blur-md border-b border-slate-100 dark:border-slate-800 px-6 py-4 flex items-center justify-between transition-colors">
        <div className="max-w-7xl mx-auto w-full flex items-center justify-between">
          <Link to="/" className="flex items-center gap-2.5">
            <div className="p-2 bg-indigo-600 rounded-lg text-white">
              <Layers className="w-5 h-5" />
            </div>
            <span className="font-display font-bold text-xl tracking-tight text-slate-800 dark:text-slate-100">
              TaskFlow
            </span>
          </Link>

          <nav className="hidden md:flex items-center gap-8 text-sm font-semibold text-slate-500 dark:text-slate-400">
            <a
              href="#features"
              className="hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors"
            >
              Features
            </a>
            <a
              href="#pricing"
              className="hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors"
            >
              Pricing
            </a>
            <a
              href="#faq"
              className="hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors"
            >
              FAQ
            </a>
          </nav>

          <div className="flex items-center gap-3">
            {currentUser ? (
              <Link
                to="/dashboard"
                className="inline-flex items-center gap-1.5 px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white font-semibold rounded-lg text-xs transition-colors shadow-xs"
              >
                Go to Workspace <ArrowRight className="w-3.5 h-3.5" />
              </Link>
            ) : (
              <>
                <Link
                  to="/login"
                  className="px-3.5 py-2 text-slate-600 dark:text-slate-405 hover:text-slate-900 dark:hover:text-slate-200 text-xs font-semibold transition-colors"
                >
                  Sign In
                </Link>
                <Link
                  to="/register"
                  className="px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white font-semibold rounded-lg text-xs transition-colors shadow-xs"
                >
                  Get Started Free
                </Link>
              </>
            )}
          </div>
        </div>
      </header>

      <section className="pt-20 pb-16 px-6 text-center">
        <div className="max-w-4xl mx-auto space-y-6">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 bg-indigo-50 dark:bg-indigo-950/30 border border-indigo-100/50 dark:border-indigo-900/35 rounded-full text-indigo-700 dark:text-indigo-400 text-xs font-bold uppercase tracking-wider animate-pulse">
            <Sparkles className="w-3.5 h-3.5 text-indigo-500" /> Public Beta
            Sandbox
          </div>

          <h1 className="text-4xl sm:text-6xl font-extrabold text-slate-800 dark:text-slate-100 tracking-tight font-display leading-[1.1] max-w-3xl mx-auto">
            Streamline your project{" "}
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-600 to-indigo-500 dark:from-indigo-400 dark:to-indigo-300">
              workspaces
            </span>{" "}
            in one place
          </h1>

          <p className="text-slate-505 dark:text-slate-400 text-base sm:text-lg max-w-2xl mx-auto leading-relaxed font-medium">
            Plan, organize, and track your projects, tasks, and collapsible
            subtasks effortlessly. A clean workspace designed to elevate your
            daily productivity.
          </p>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-4">
            {currentUser ? (
              <Link
                to="/dashboard"
                className="w-full sm:w-auto inline-flex items-center justify-center gap-1.5 px-6 py-3 bg-indigo-600 hover:bg-indigo-700 text-white font-bold rounded-lg text-sm transition-all shadow-md"
              >
                Open Dashboard Panel <ArrowRight className="w-4 h-4" />
              </Link>
            ) : (
              <>
                <Link
                  to="/register"
                  className="w-full sm:w-auto inline-flex items-center justify-center gap-1.5 px-6 py-3 bg-indigo-600 hover:bg-indigo-700 text-white font-bold rounded-lg text-sm transition-all shadow-md"
                >
                  Get Started Free <ArrowRight className="w-4 h-4" />
                </Link>
                <Link
                  to="/login"
                  className="w-full sm:w-auto inline-flex items-center justify-center gap-1 px-6 py-3 bg-white dark:bg-slate-800 hover:bg-slate-50 dark:hover:bg-slate-700 border border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-300 hover:text-slate-800 dark:hover:text-white font-bold rounded-lg text-sm transition-all shadow-xs"
                >
                  Try Demo login
                </Link>
              </>
            )}
          </div>
        </div>
      </section>

      <section className="px-6 py-6 max-w-5xl mx-auto">
        <div className="bg-white dark:bg-slate-900 p-4 sm:p-6 rounded-2xl border border-slate-100 dark:border-slate-800 shadow-premium relative group">
          <div className="absolute inset-0 bg-gradient-to-tr from-indigo-500/5 to-transparent rounded-2xl pointer-events-none" />

          <div className="border border-slate-200/60 dark:border-slate-800 rounded-xl overflow-hidden shadow-xs flex flex-col bg-slate-50/50 dark:bg-slate-950/50">
            <div className="bg-slate-100/80 dark:bg-slate-850 px-4 py-3 border-b border-slate-200/50 dark:border-slate-800 flex items-center gap-2">
              <div className="w-2.5 h-2.5 rounded-full bg-red-400" />
              <div className="w-2.5 h-2.5 rounded-full bg-amber-400" />
              <div className="w-2.5 h-2.5 rounded-full bg-emerald-400" />
              <div className="ml-4 h-4 bg-slate-200/60 dark:bg-slate-800 rounded w-48 animate-pulse" />
            </div>

            <div className="p-6 grid grid-cols-1 sm:grid-cols-3 gap-4">
              <div className="bg-white dark:bg-slate-900 p-4 rounded-xl border border-slate-100 dark:border-slate-800 shadow-xs space-y-3">
                <div className="flex justify-between items-center">
                  <span className="text-[10px] font-bold text-slate-400 dark:text-slate-500 uppercase">
                    TaskFlow app
                  </span>
                  <span className="text-xs font-bold text-indigo-600 bg-indigo-50 dark:bg-indigo-950/40 px-2 py-0.5 rounded-full">
                    66%
                  </span>
                </div>
                <h4 className="text-sm font-bold text-slate-700 dark:text-slate-200 font-display">
                  Development phase
                </h4>
                <div className="w-full bg-slate-100 dark:bg-slate-800 h-1 rounded-full overflow-hidden">
                  <div className="w-2/3 h-full bg-indigo-500 rounded-full" />
                </div>
              </div>

              <div className="bg-white dark:bg-slate-900 p-4 rounded-xl border border-slate-100 dark:border-slate-800 shadow-xs space-y-3">
                <div className="flex justify-between items-center">
                  <span className="text-[10px] font-bold text-slate-400 dark:text-slate-500 uppercase">
                    Marketing Q3
                  </span>
                  <span className="text-xs font-bold text-amber-600 bg-amber-50 dark:bg-amber-950/40 px-2 py-0.5 rounded-full">
                    50%
                  </span>
                </div>
                <h4 className="text-sm font-bold text-slate-700 dark:text-slate-200 font-display">
                  Ads Creative Drafts
                </h4>
                <div className="w-full bg-slate-100 dark:bg-slate-800 h-1 rounded-full overflow-hidden">
                  <div className="w-1/2 h-full bg-amber-500 rounded-full" />
                </div>
              </div>

              <div className="bg-white dark:bg-slate-900 p-4 rounded-xl border border-slate-100 dark:border-slate-800 shadow-xs space-y-3">
                <div className="flex justify-between items-center">
                  <span className="text-[10px] font-bold text-slate-400 dark:text-slate-500 uppercase">
                    App wireframes
                  </span>
                  <span className="text-xs font-bold text-emerald-600 bg-emerald-50 dark:bg-emerald-950/40 px-2 py-0.5 rounded-full">
                    100%
                  </span>
                </div>
                <h4 className="text-sm font-bold text-slate-700 dark:text-slate-200 font-display">
                  Figma Wireframes
                </h4>
                <div className="w-full bg-slate-100 dark:bg-slate-800 h-1 rounded-full overflow-hidden">
                  <div className="w-full h-full bg-emerald-500 rounded-full" />
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section
        id="features"
        className="py-20 px-6 max-w-7xl mx-auto space-y-12 animate-fade-in"
      >
        <div className="text-center space-y-2">
          <h2 className="text-3xl font-extrabold text-slate-800 dark:text-slate-100 font-display tracking-tight">
            Engineered for high performance productivity
          </h2>
          <p className="text-sm text-slate-400 dark:text-slate-550 font-semibold max-w-md mx-auto">
            Everything you need to handle massive workloads without hitting
            structural clutter.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div className="bg-white dark:bg-slate-900 p-6 rounded-xl border border-slate-100 dark:border-slate-800 shadow-premium space-y-4">
            <div className="p-3 bg-indigo-50 dark:bg-indigo-950/40 rounded-lg text-indigo-600 dark:text-indigo-400 w-fit">
              <FolderKanban className="w-6 h-6" />
            </div>
            <h3 className="text-lg font-bold text-slate-800 dark:text-slate-100 font-display">
              Workspaces & Projects
            </h3>
            <p className="text-sm text-slate-500 dark:text-slate-400 leading-relaxed">
              Create clean workspaces for separate initiatives, keep items
              grouped by domain, and track overarching completion progress
              instantly.
            </p>
          </div>

          <div className="bg-white dark:bg-slate-900 p-6 rounded-xl border border-slate-100 dark:border-slate-800 shadow-premium space-y-4">
            <div className="p-3 bg-indigo-50 dark:bg-indigo-950/40 rounded-lg text-indigo-600 dark:text-indigo-400 w-fit">
              <ListTodo className="w-6 h-6" />
            </div>
            <h3 className="text-lg font-bold text-slate-800 dark:text-slate-100 font-display">
              Granular Subtasks
            </h3>
            <p className="text-sm text-slate-505 dark:text-slate-400 leading-relaxed">
              Break tasks down into executable micro-items. Toggle and edit
              subtasks inline with collapsible folders, updating progress states
              automatically.
            </p>
          </div>

          <div className="bg-white dark:bg-slate-900 p-6 rounded-xl border border-slate-100 dark:border-slate-800 shadow-premium space-y-4">
            <div className="p-3 bg-indigo-50 dark:bg-indigo-950/40 rounded-lg text-indigo-600 dark:text-indigo-400 w-fit">
              <BarChart3 className="w-6 h-6" />
            </div>
            <h3 className="text-lg font-bold text-slate-800 dark:text-slate-100 font-display">
              Performance Analytics
            </h3>
            <p className="text-sm text-slate-505 dark:text-slate-400 leading-relaxed">
              Visualize completion velocities, daily progress metrics, weekly
              charts, and priority distributions with lightweight native SVG
              graphics.
            </p>
          </div>
        </div>
      </section>

      <section className="bg-white dark:bg-slate-900 border-y border-slate-100 dark:border-slate-800 py-16 px-6 transition-colors">
        <div className="max-w-4xl mx-auto flex flex-col md:flex-row items-center justify-between gap-8">
          <div className="flex items-start gap-4">
            <div className="p-3 bg-emerald-50 dark:bg-emerald-950/30 rounded-lg text-emerald-600 dark:text-emerald-450 shrink-0">
              <ShieldCheck className="w-8 h-8" />
            </div>
            <div className="space-y-1.5">
              <h3 className="text-xl font-bold text-slate-800 dark:text-slate-100 font-display">
                Protected Workspace Data
              </h3>
              <p className="text-sm text-slate-505 dark:text-slate-400 leading-relaxed">
                TaskFlow keeps your workspace behind authenticated API routes
                and HTTP-only session cookies, with project data persisted
                through MongoDB.
              </p>
            </div>
          </div>
        </div>
      </section>

      <section id="pricing" className="py-20 px-6 max-w-5xl mx-auto space-y-12">
        <div className="text-center space-y-2">
          <h2 className="text-3xl font-extrabold text-slate-800 dark:text-slate-100 font-display tracking-tight">
            Simple, honest pricing
          </h2>
          <p className="text-sm text-slate-405 dark:text-slate-500 font-semibold max-w-sm mx-auto">
            Get started for free or upgrade as your team operations expand.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-3xl mx-auto">
          <div className="bg-white dark:bg-slate-900 p-8 rounded-xl border border-slate-205 dark:border-slate-800 shadow-premium space-y-6 flex flex-col justify-between">
            <div className="space-y-4">
              <p className="text-xs font-bold text-slate-400 dark:text-slate-500 uppercase tracking-wider">
                Free Sandbox
              </p>
              <h3 className="text-4xl font-extrabold text-slate-800 dark:text-slate-100 font-display">
                $0{" "}
                <span className="text-sm text-slate-400 dark:text-slate-500 font-normal">
                  / lifetime
                </span>
              </h3>
              <p className="text-sm text-slate-500 dark:text-slate-400">
                Perfect for single developers, students, and local organizers.
              </p>

              <ul className="text-xs text-slate-505 dark:text-slate-400 space-y-2.5 pt-4">
                <li className="flex items-center gap-2">
                  <CheckCircle className="w-3.5 h-3.5 text-emerald-500" />{" "}
                  Unlimited Projects
                </li>
                <li className="flex items-center gap-2">
                  <CheckCircle className="w-3.5 h-3.5 text-emerald-500" />{" "}
                  Unlimited Tasks & Subtasks
                </li>
                <li className="flex items-center gap-2">
                  <CheckCircle className="w-3.5 h-3.5 text-emerald-500" />{" "}
                  MongoDB-backed Workspace
                </li>
                <li className="flex items-center gap-2">
                  <CheckCircle className="w-3.5 h-3.5 text-emerald-500" /> SVG
                  Productivity Analytics
                </li>
              </ul>
            </div>

            <Link
              to="/register"
              className="block w-full py-2.5 text-center bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 text-slate-750 dark:text-slate-200 font-bold rounded-lg text-xs transition-colors"
            >
              Get Started Free
            </Link>
          </div>

          <div className="bg-white dark:bg-slate-900 p-8 rounded-xl border-2 border-indigo-650 dark:border-indigo-500 shadow-premium space-y-6 flex flex-col justify-between relative">
            <div className="absolute top-0 right-6 -translate-y-1/2 bg-indigo-600 dark:bg-indigo-500 text-white text-[9px] font-bold px-2 py-0.5 rounded-full uppercase tracking-wider">
              Popular
            </div>

            <div className="space-y-4">
              <p className="text-xs font-bold text-indigo-650 dark:text-indigo-400 uppercase tracking-wider">
                Team Server
              </p>
              <h3 className="text-4xl font-extrabold text-slate-800 dark:text-slate-100 font-display">
                $8{" "}
                <span className="text-sm text-slate-400 dark:text-slate-500 font-normal">
                  / user / mo
                </span>
              </h3>
              <p className="text-sm text-slate-505 dark:text-slate-400">
                Best for collaborative teams, startups, and agile syncs.
              </p>

              <ul className="text-xs text-slate-505 dark:text-slate-400 space-y-2.5 pt-4">
                <li className="flex items-center gap-2">
                  <CheckCircle className="w-3.5 h-3.5 text-indigo-500" />{" "}
                  Everything in Free
                </li>
                <li className="flex items-center gap-2">
                  <CheckCircle className="w-3.5 h-3.5 text-indigo-500" /> Team
                  Cloud Synchronization
                </li>
                <li className="flex items-center gap-2">
                  <CheckCircle className="w-3.5 h-3.5 text-indigo-500" />{" "}
                  Role-based Member Permissions
                </li>
                <li className="flex items-center gap-2">
                  <CheckCircle className="w-3.5 h-3.5 text-indigo-500" /> Slack
                  & GitHub API Integrations
                </li>
                <li className="flex items-center gap-2">
                  <CheckCircle className="w-3.5 h-3.5 text-indigo-500" />{" "}
                  Priority Support SLA
                </li>
              </ul>
            </div>

            <Link
              to="/register"
              className="block w-full py-2.5 text-center bg-indigo-600 hover:bg-indigo-700 text-white font-bold rounded-lg text-xs transition-colors shadow-sm"
            >
              Sign Up For Trial
            </Link>
          </div>
        </div>
      </section>

      <section id="faq" className="py-20 px-6 max-w-3xl mx-auto space-y-12">
        <div className="text-center space-y-2">
          <h2 className="text-3xl font-extrabold text-slate-800 dark:text-slate-100 tracking-tight font-display">
            Frequently Asked Questions
          </h2>
          <p className="text-sm text-slate-400 dark:text-slate-550 font-semibold max-w-sm mx-auto">
            Quick responses to common questions about TaskFlow.
          </p>
        </div>

        <div className="space-y-4">
          {faqs.map((faq, idx) => (
            <div
              key={idx}
              className="bg-white dark:bg-slate-900 border border-slate-100 dark:border-slate-800 rounded-xl shadow-sm overflow-hidden transition-colors"
            >
              <button
                type="button"
                onClick={() => toggleFaq(idx)}
                className="w-full px-6 py-4 flex items-center justify-between text-left font-bold text-slate-700 dark:text-slate-200 hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors text-sm"
              >
                <span>{faq.q}</span>
                {expandedFaq === idx ? (
                  <ChevronUp className="w-4 h-4 text-slate-400" />
                ) : (
                  <ChevronDown className="w-4 h-4 text-slate-400" />
                )}
              </button>

              {expandedFaq === idx && (
                <div className="px-6 pb-4 text-xs text-slate-500 dark:text-slate-400 leading-relaxed border-t border-slate-50 dark:border-slate-800 pt-2 animate-fade-in">
                  {faq.a}
                </div>
              )}
            </div>
          ))}
        </div>
      </section>

      <footer className="bg-white dark:bg-slate-900 border-t border-slate-100 dark:border-slate-800 py-8 px-6 text-center text-xs text-slate-400 dark:text-slate-505 font-semibold transition-colors">
        <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-2">
            <Layers className="w-4.5 h-4.5 text-indigo-500" />
            <span>
              TaskFlow &copy; {new Date().getFullYear()} Shivam Choudhary. All
              rights reserved.
            </span>
          </div>
          <div className="flex items-center gap-6">
            <a
              href="#features"
              className="hover:text-slate-600 dark:hover:text-slate-400"
            >
              Privacy Policy
            </a>
            <a
              href="#pricing"
              className="hover:text-slate-600 dark:hover:text-slate-400"
            >
              Terms of Use
            </a>
          </div>
        </div>
      </footer>
    </div>
  );
}
