import React from "react";
import {
    Settings as SettingsIcon,
    Sun,
    Moon,
    Monitor,
    Bell,
    Eye,
    Globe,
    Database,
    Info,
} from "lucide-react";

import useThemeStore from "../store/useThemeStore";

const SettingsPage = () => {
    const { theme, setTheme } = useThemeStore();

    const themeOptions = [
        { value: "light", label: "Light", icon: Sun, description: "Classic light appearance" },
        { value: "dark", label: "Dark", icon: Moon, description: "Easy on the eyes" },
    ];

    return (
        <div className="min-h-screen bg-base-200">
            {/* Header */}
            <header className="bg-base-100 border-b border-base-300 px-8 py-5 sticky top-0 z-10 shadow-soft">
                <div className="max-w-4xl mx-auto">
                    <h1 className="text-2xl font-bold text-base-content flex items-center gap-3">
                        <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center">
                            <SettingsIcon className="w-5 h-5 text-primary" />
                        </div>
                        Settings
                    </h1>
                    <p className="text-sm text-base-content/60 mt-1">
                        Customize your FundWatch experience
                    </p>
                </div>
            </header>

            {/* Main Content */}
            <div className="p-8 max-w-4xl mx-auto space-y-6">
                {/* Appearance */}
                <div className="card-static p-6">
                    <h3 className="text-lg font-bold text-base-content mb-2 flex items-center gap-2">
                        <Eye className="w-5 h-5 text-primary" />
                        Appearance
                    </h3>
                    <p className="text-sm text-base-content/60 mb-6">
                        Customize how FundWatch looks on your device
                    </p>

                    {/* Theme Selection */}
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        {themeOptions.map((option) => (
                            <button
                                key={option.value}
                                onClick={() => setTheme(option.value)}
                                className={`p-4 rounded-xl border-2 transition-all text-left ${theme === option.value
                                        ? "border-primary bg-primary/5"
                                        : "border-base-300 hover:border-base-content/20"
                                    }`}
                            >
                                <div className="flex items-center gap-3 mb-2">
                                    <div className={`w-10 h-10 rounded-lg flex items-center justify-center ${theme === option.value ? "bg-primary text-white" : "bg-base-200"
                                        }`}>
                                        <option.icon className="w-5 h-5" />
                                    </div>
                                    <div>
                                        <p className="font-semibold">{option.label}</p>
                                        <p className="text-xs text-base-content/60">{option.description}</p>
                                    </div>
                                    {theme === option.value && (
                                        <div className="ml-auto w-5 h-5 rounded-full bg-primary flex items-center justify-center">
                                            <svg className="w-3 h-3 text-white" fill="currentColor" viewBox="0 0 20 20">
                                                <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                                            </svg>
                                        </div>
                                    )}
                                </div>
                            </button>
                        ))}
                    </div>
                </div>

                {/* Notifications */}
                <div className="card-static p-6">
                    <h3 className="text-lg font-bold text-base-content mb-2 flex items-center gap-2">
                        <Bell className="w-5 h-5 text-primary" />
                        Notifications
                    </h3>
                    <p className="text-sm text-base-content/60 mb-6">
                        Manage how you receive notifications
                    </p>

                    <div className="space-y-4">
                        <div className="flex items-center justify-between py-3 border-b border-base-200">
                            <div>
                                <p className="font-medium">Overdue Alerts</p>
                                <p className="text-sm text-base-content/60">Get notified when disbursements become overdue</p>
                            </div>
                            <input type="checkbox" className="toggle toggle-primary" defaultChecked />
                        </div>
                        <div className="flex items-center justify-between py-3 border-b border-base-200">
                            <div>
                                <p className="font-medium">Approval Reminders</p>
                                <p className="text-sm text-base-content/60">Receive reminders for pending approvals</p>
                            </div>
                            <input type="checkbox" className="toggle toggle-primary" defaultChecked />
                        </div>
                        <div className="flex items-center justify-between py-3">
                            <div>
                                <p className="font-medium">Email Notifications</p>
                                <p className="text-sm text-base-content/60">Send important alerts to your email</p>
                            </div>
                            <input type="checkbox" className="toggle toggle-primary" />
                        </div>
                    </div>
                </div>

                {/* Regional */}
                <div className="card-static p-6">
                    <h3 className="text-lg font-bold text-base-content mb-2 flex items-center gap-2">
                        <Globe className="w-5 h-5 text-primary" />
                        Regional Settings
                    </h3>
                    <p className="text-sm text-base-content/60 mb-6">
                        Configure regional preferences
                    </p>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        <div className="form-control">
                            <label className="label">
                                <span className="label-text font-medium">Currency</span>
                            </label>
                            <select className="select select-bordered">
                                <option value="PHP">Philippine Peso (₱)</option>
                                <option value="USD">US Dollar ($)</option>
                            </select>
                        </div>
                        <div className="form-control">
                            <label className="label">
                                <span className="label-text font-medium">Date Format</span>
                            </label>
                            <select className="select select-bordered">
                                <option value="mdy">MM/DD/YYYY</option>
                                <option value="dmy">DD/MM/YYYY</option>
                                <option value="ymd">YYYY-MM-DD</option>
                            </select>
                        </div>
                    </div>
                </div>

                {/* Data & Storage */}
                <div className="card-static p-6">
                    <h3 className="text-lg font-bold text-base-content mb-2 flex items-center gap-2">
                        <Database className="w-5 h-5 text-primary" />
                        Data & Storage
                    </h3>
                    <p className="text-sm text-base-content/60 mb-6">
                        Manage cached data and storage
                    </p>

                    <div className="space-y-4">
                        <div className="flex items-center justify-between bg-base-200 rounded-xl p-4">
                            <div>
                                <p className="font-medium">Clear Cache</p>
                                <p className="text-sm text-base-content/60">Remove locally stored data</p>
                            </div>
                            <button className="btn btn-ghost btn-sm">Clear</button>
                        </div>
                        <div className="flex items-center justify-between bg-base-200 rounded-xl p-4">
                            <div>
                                <p className="font-medium">Export Data</p>
                                <p className="text-sm text-base-content/60">Download your data as CSV</p>
                            </div>
                            <button className="btn btn-ghost btn-sm">Export</button>
                        </div>
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
                            <span className="font-mono">1.0.0</span>
                        </div>
                        <div className="flex justify-between">
                            <span className="text-base-content/60">Build</span>
                            <span className="font-mono">2026.01.15</span>
                        </div>
                        <div className="flex justify-between">
                            <span className="text-base-content/60">Environment</span>
                            <span className="font-mono">Production</span>
                        </div>
                    </div>

                    <p className="text-center text-sm text-base-content/40 mt-6">
                        FundWatch © {new Date().getFullYear()} — Financial Tracking Made Easier
                    </p>
                </div>
            </div>
        </div>
    );
};

export default SettingsPage;
