import { Settings as SettingsIcon, Sun, Moon, Eye, Info } from "lucide-react";
import FloatingNotification from "../components/FloatingNotification";
import dostSeal from "../assets/dost_seal.svg";

import useThemeStore from "../store/useThemeStore";

const SettingsPage = () => {
  const { theme, setTheme } = useThemeStore();

  const themeOptions = [
    {
      value: "light",
      label: "Light",
      icon: Sun,
      description: "Classic light appearance",
    },
    {
      value: "dark",
      label: "Dark",
      icon: Moon,
      description: "Easy on the eyes",
    },
  ];

  return (
    <div className="min-h-screen bg-base-200">
      <FloatingNotification />

      {/* Main Content */}
      <div className="p-8 max-w-4xl mx-auto space-y-6">
        {/* Appearance */}
        <div className="card-static p-6">
          <h3 className="text-lg font-bold text-base-content mb-2 flex items-center gap-2">
            <Eye className="w-5 h-5 text-primary" />
            Appearance
          </h3>
          {/* Theme Selection */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {themeOptions.map((option) => (
              <button
                key={option.value}
                onClick={() => setTheme(option.value)}
                className={`p-4 rounded-xl border-2 transition-all text-left ${
                  theme === option.value
                    ? "border-primary bg-primary/5"
                    : "border-base-300 hover:border-base-content/20"
                }`}
              >
                <div className="flex items-center gap-3 mb-2">
                  <div
                    className={`w-10 h-10 rounded-lg flex items-center justify-center ${
                      theme === option.value
                        ? "bg-primary text-white"
                        : "bg-base-200"
                    }`}
                  >
                    <option.icon className="w-5 h-5" />
                  </div>
                  <div>
                    <p className="font-semibold">{option.label}</p>
                    <p className="text-xs text-base-content/60">
                      {option.description}
                    </p>
                  </div>
                  {theme === option.value && (
                    <div className="ml-auto w-5 h-5 rounded-full bg-primary flex items-center justify-center">
                      <svg
                        className="w-3 h-3 text-white"
                        fill="currentColor"
                        viewBox="0 0 20 20"
                      >
                        <path
                          fillRule="evenodd"
                          d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                          clipRule="evenodd"
                        />
                      </svg>
                    </div>
                  )}
                </div>
              </button>
            ))}
          </div>
        </div>

        {/* About */}
        <div className="card-static p-6">
          <h3 className="text-lg font-bold text-base-content mb-4 flex items-center gap-2">
            <Info className="w-5 h-5 text-primary" />
            About System
          </h3>

          <div className="space-y-4">
            {/* System Identity */}
            <div className="p-4 rounded-xl bg-base-200/50 border border-base-200 flex items-start gap-4">
              <div className="w-12 h-12 rounded-lg bg-primary/10 flex items-center justify-center shrink-0">
                <img
                  src={dostSeal}
                  alt="DOST Seal"
                  className="w-full h-full object-contain"
                />
              </div>
              <div>
                <h4 className="font-bold text-base-content">DOST 1 - eCash</h4>
                <p className="text-xs text-base-content/60 font-mono mt-1">
                  v2.4.0 (Stable Release)
                </p>
                <p className="text-sm text-base-content/70 mt-2 leading-relaxed">
                  A comprehensive financial tracking and liquidity management
                  system designed to streamline disbursement processes, monitor
                  NCA utilization, and ensure real-time fund tracking for
                  DOST 1 Cashier operations
                </p>
              </div>
            </div>

            {/* Core Modules List */}
            <div>
              <h5 className="text-xs font-bold uppercase tracking-wider text-base-content/50 mb-3">
                Core Modules
              </h5>
              <div className="grid grid-cols-2 gap-2">
                {[
                  "Disbursement Tracking",
                  "NCA & Fund Management",
                  "Cash Utilization Analytics",
                  "Automated Ledgering",
                ].map((item, idx) => (
                  <div
                    key={idx}
                    className="flex items-center gap-2 text-xs font-medium text-base-content/70 p-2 rounded-lg bg-base-100 border border-base-200"
                  >
                    <div className="w-1.5 h-1.5 rounded-full bg-primary/60" />
                    {item}
                  </div>
                ))}
              </div>
            </div>
          </div>

          <div className="divider my-4"></div>

          {/* Footer / Credits */}
          <div className="text-center">
            <p className="text-xs text-base-content/40">
              Developed by PCLU and UPANG Interns - 2026-2026
            </p>
            <p className="text-xs text-base-content/40 mt-1">
              eCash © {new Date().getFullYear()} — Financial Tracking Made
              Easier
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SettingsPage;
