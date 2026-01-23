import { TrendingUp } from "lucide-react";

const LoginLeftPanel = () => {
  return (
    <div className="hidden lg:flex lg:w-1/2 gradient-hero relative overflow-hidden">
      {/* Mesh Gradient Overlay */}
      <div className="absolute inset-0 gradient-mesh opacity-60" />

      {/* Floating Shapes */}
      <div className="absolute top-20 left-20 w-64 h-64 bg-primary/10 rounded-full blur-3xl animate-pulse" />
      <div
        className="absolute bottom-20 right-20 w-96 h-96 bg-accent/10 rounded-full blur-3xl animate-pulse"
        style={{ animationDelay: "1s" }}
      />

      {/* Content */}
      <div className="relative z-10 flex flex-col justify-center px-16 text-white">
        {/* Logo */}
        <div className="flex items-center gap-3 mb-12">
          <div className="w-14 h-14 gradient-primary rounded-2xl flex items-center justify-center shadow-glow-primary">
            <TrendingUp className="w-7 h-7" />
          </div>
          <div>
            <h1 className="text-3xl font-bold tracking-tight">eCash</h1>
            <p className="text-slate-400 text-sm">Financial Tracking System</p>
          </div>
        </div>

        {/* Tagline */}
        <h2 className="text-4xl font-bold leading-tight mb-6">
          Always know where
          <br />
          <span className="text-primary">the money goes.</span>
        </h2>

      </div>

      <div className="absolute bottom-0 left-0 right-0">
        <svg
          viewBox="0 0 1440 120"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path
            d="M0 120L60 105C120 90 240 60 360 45C480 30 600 30 720 37.5C840 45 960 60 1080 67.5C1200 75 1320 75 1380 75L1440 75V120H1380C1320 120 1200 120 1080 120C960 120 840 120 720 120C600 120 480 120 360 120C240 120 120 120 60 120H0Z"
            fill="rgba(255,255,255,0.02)"
          />
        </svg>
      </div>
    </div>
  );
};

export default LoginLeftPanel;
