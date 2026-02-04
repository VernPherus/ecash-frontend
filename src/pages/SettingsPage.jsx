import { Settings as SettingsIcon, Sun, Moon, Eye, Info } from "lucide-react";
import Header from "../components/Header";

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
      {/* Header */}
      <Header />

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
            About
          </h3>

          <div className="bg-base-200 rounded-xl p-4 space-y-2">
            <div className="flex justify-between">
              <span className="text-base-content/60">Version</span>
              <span className="font-mono">0.9.0</span>
            </div>
            <div className="flex justify-between">
              <span className="text-base-content/60">Build</span>
              <span className="font-mono">2026.01.15</span>
            </div>
            <div className="flex justify-between">
              <span className="text-base-content/60">Environment</span>
              <span className="font-mono">Development</span>
            </div>
          </div>

          <p className="text-center text-sm text-base-content/40 mt-6">
            eCash © {new Date().getFullYear()} — Financial Tracking Made Easier
          </p>
        </div>
      </div>
    </div>
  );
};

export default SettingsPage;
