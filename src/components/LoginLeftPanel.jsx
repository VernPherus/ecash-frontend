import React from "react";
import dostSeal from "../assets/dost_seal.svg";

const LoginLeftPanel = () => {
  return (
    <div className="hidden lg:flex lg:w-1/2 relative overflow-hidden bg-slate-900">
      {/* 1. Background Image / Gradient Base */}
      <div className="absolute inset-0 gradient-hero" />

      {/* 2. "Tech" Grid Pattern Overlay - Adds structure and a 'finance' feel */}
      <div
        className="absolute inset-0 opacity-[0.03]"
        style={{
          backgroundImage: `linear-gradient(#fff 1px, transparent 1px), linear-gradient(90deg, #fff 1px, transparent 1px)`,
          backgroundSize: "40px 40px",
        }}
      />

      {/* 3. The "Watermark" Seal - Adds corporate depth */}
      <div className="absolute -right-24 -bottom-24 w-[600px] h-[600px] opacity-[0.02] pointer-events-none grayscale">
        <img
          src={dostSeal}
          alt=""
          className="w-full h-full object-contain animate-spin-slow-custom"
          style={{ animationDuration: "60s" }}
        />
      </div>

      {/* 4. Ambient Lighting */}
      <div className="absolute top-0 left-0 w-full h-full bg-gradient-to-b from-black/0 via-black/10 to-black/40 z-0" />

      {/* 5. Main Content */}
      <div className="relative z-10 flex flex-col justify-center h-full px-16 text-white">
        {/* Official Badge */}
        <div className="mb-6">
          <span className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/5 border border-white/10 text-xs font-medium tracking-wider uppercase text-slate-300 backdrop-blur-sm">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
            DOST Region 1 System
          </span>
        </div>

        {/* Logo Lockup */}
        <div className="flex items-center gap-5 mb-10">
          {/* Glass Container for Seal */}
          <div className="w-20 h-20 p-3 bg-white/5 backdrop-blur-md rounded-2xl border border-white/10 shadow-2xl shadow-black/20 flex items-center justify-center">
            <img
              src={dostSeal}
              alt="DOST Seal"
              className="w-full h-full object-contain drop-shadow-lg"
            />
          </div>

          <div className="flex flex-col">
            <h1 className="text-4xl font-extrabold tracking-tight text-white drop-shadow-sm">
              DOST 1 - eCash
            </h1>
            <div className="h-0.5 w-12 bg-primary/50 my-1 rounded-full"></div>
            <p className="text-slate-300 text-sm font-medium tracking-wide uppercase opacity-90">
              Financial Tracking System
            </p>
          </div>
        </div>

        {/* Tagline */}
        <div className="space-y-4 max-w-md">
          <h2 className="text-4xl font-bold leading-[1.15]">
            Streamlined <br />
            Fund Management.
          </h2>
          <p className="text-lg text-slate-400 font-light leading-relaxed">
            "Always know where{" "}
            <span className="text-primary font-semibold text-white">
              the money goes
            </span>
            ."
          </p>
        </div>
      </div>

      {/* 6. Footer Decoration */}
      <div className="absolute bottom-8 left-16 z-10">
        <p className="text-[10px] text-slate-500 uppercase tracking-widest font-semibold">
          © 2026 Department of Science and Technology
        </p>
      </div>
    </div>
  );
};

export default LoginLeftPanel;
