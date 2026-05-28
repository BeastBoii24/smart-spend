import { Link } from "react-router-dom";
import { ArrowRight, Calculator, Download, ShieldCheck, Target, TrendingUp, Wallet } from "lucide-react";
import { Button } from "@/components/ui/button";

export default function Index() {
  return (
    <div className="min-h-screen">
      <div className="relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-primary/10 via-transparent to-secondary/10" />

        <div className="max-w-6xl mx-auto px-4 py-20 sm:py-28 relative">
          <div className="text-center animate-slide-in">
            <div className="inline-flex items-center justify-center w-20 h-20 rounded-2xl btn-gradient shadow-lg mb-8">
              <Wallet size={36} />
            </div>

            <h1 className="text-4xl sm:text-6xl font-extrabold mb-6">
              <span className="text-gradient">SmartSpend</span>
            </h1>
            <p className="text-xl sm:text-2xl text-muted-foreground mb-4">
              Personal Finance Management System
            </p>
            <p className="max-w-2xl mx-auto text-muted-foreground mb-8">
              Track income, monitor expenses, manage budgets, set savings goals, calculate EMI, and export your data from one responsive dashboard.
            </p>

            <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
              <Link to="/login">
                <Button size="lg" className="btn-gradient text-lg px-8 h-14">
                  Open Application <ArrowRight className="ml-2" size={20} />
                </Button>
              </Link>
              <Link to="/register">
                <Button size="lg" variant="outline" className="text-lg px-8 h-14 border-border/50">
                  Create Account
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-6xl mx-auto px-4 py-16">
        <h2 className="text-2xl font-bold text-center mb-12">Key Features</h2>
        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {[
            { icon: Wallet, title: "Transactions", desc: "Capture income and expense entries with category tags." },
            { icon: Target, title: "Budgets & Goals", desc: "Track monthly spending limits and long-term savings goals." },
            { icon: TrendingUp, title: "Reports", desc: "Review totals, savings, and category-wise spending trends." },
            { icon: Calculator, title: "EMI Calculator", desc: "Estimate loan repayments directly inside the dashboard." },
          ].map((feature, index) => (
            <div
              key={feature.title}
              className="glass-card rounded-2xl p-6 text-center animate-slide-in hover:scale-105 transition-transform"
              style={{ animationDelay: `${index * 0.1}s` }}
            >
              <div className="w-14 h-14 rounded-xl bg-primary/20 flex items-center justify-center mx-auto mb-4">
                <feature.icon className="text-primary" size={28} />
              </div>
              <h3 className="font-semibold mb-2">{feature.title}</h3>
              <p className="text-sm text-muted-foreground">{feature.desc}</p>
            </div>
          ))}
        </div>
      </div>

      <div className="max-w-5xl mx-auto px-4 py-16">
        <div className="glass-card rounded-2xl p-8">
          <div className="grid lg:grid-cols-2 gap-8 items-start">
            <div>
              <h2 className="text-2xl font-bold mb-4">Project Run Guide</h2>
              <p className="text-muted-foreground mb-4">
                SmartSpend includes a React frontend and an Express backend. Run both services locally for the complete project submission.
              </p>
              <div className="space-y-3 text-sm text-muted-foreground">
                <p><span className="font-semibold text-foreground">Frontend:</span> <code>npm install</code> and <code>npm run dev</code></p>
                <p><span className="font-semibold text-foreground">Backend:</span> <code>cd public/backend</code>, <code>npm install</code>, <code>node server.js</code></p>
              </div>
            </div>

            <div className="rounded-2xl border border-border/50 bg-muted/20 p-6">
              <div className="flex items-center gap-2 mb-3">
                <ShieldCheck size={18} className="text-primary" />
                <h3 className="font-semibold">Submission Notes</h3>
              </div>
              <ul className="space-y-2 text-sm text-muted-foreground">
                <li>Use the root README for installation and repository structure.</li>
                <li>Use the docs folder for test cases, presentation content, and submission checklist.</li>
                <li>Use the backend sample data to demonstrate the dashboard immediately.</li>
              </ul>
              <a href="/backend/README.md" target="_blank" rel="noreferrer" className="inline-flex mt-4">
                <Button variant="outline" className="border-border/50">
                  <Download size={18} className="mr-2" />
                  View Backend Guide
                </Button>
              </a>
            </div>
          </div>
        </div>
      </div>

    </div>
  );
}
