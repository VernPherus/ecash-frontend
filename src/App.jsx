import React from "react";
import {
  LayoutDashboard,
  PlusCircle,
  Wallet,
  Users,
  Settings,
  Search,
  Bell,
  Menu,
  ArrowUpRight,
  ArrowDownRight,
  FileText,
  AlertCircle,
  CheckCircle2,
  Clock,
} from "lucide-react";

const App = () => {
  // Mock Data for the design
  const funds = [
    {
      code: "GF-101",
      name: "General Fund",
      budget: 500000,
      spent: 124000,
      color: "bg-emerald-500",
    },
    {
      code: "TF-300",
      name: "Trust Fund",
      budget: 150000,
      spent: 85000,
      color: "bg-blue-500",
    },
    {
      code: "NCA-003",
      name: "Nat. Cash Alloc.",
      budget: 300000,
      spent: 4000,
      color: "bg-indigo-500",
    },
  ];

  const transactions = [
    {
      date: "Dec 12, 2025",
      payee: "Kimmy no nawa",
      fund: "TF-300",
      amount: 9500.0,
      status: "Pending",
      days: 4,
    },
    {
      date: "Dec 12, 2025",
      payee: "Bins-Mraz",
      fund: "NCA-003",
      amount: 4000.0,
      status: "Pending",
      days: 4,
    },
    {
      date: "Dec 10, 2025",
      payee: "Meralco",
      fund: "GF-101",
      amount: 7200.0,
      status: "Approved",
      days: 3,
    },
    {
      date: "Dec 09, 2025",
      payee: "Larkin-Yundt",
      fund: "TF-300",
      amount: 7550.0,
      status: "Overdue",
      days: 8,
    },
    {
      date: "Dec 09, 2025",
      payee: "Meralco",
      fund: "GF-101",
      amount: 50000.0,
      status: "Pending",
      days: 7,
    },
  ];

  return (
    <div className="flex h-screen bg-slate-50 font-sans text-slate-800">
      {/* Sidebar */}
      <aside className="w-64 bg-slate-900 text-white flex flex-col shadow-xl">
        <div className="p-6 flex items-center gap-3">
          <div className="w-8 h-8 bg-emerald-500 rounded-lg flex items-center justify-center">
            <ArrowUpRight className="text-white w-5 h-5" />
          </div>
          <span className="text-xl font-bold tracking-tight">FundWatch</span>
        </div>

        <nav className="flex-1 px-4 space-y-2 mt-4">
          <div className="text-xs font-semibold text-slate-500 uppercase tracking-wider mb-2 px-2">
            Management
          </div>
          <NavItem
            icon={<LayoutDashboard size={20} />}
            label="Dashboard"
            active
          />
          <NavItem icon={<PlusCircle size={20} />} label="New Disbursement" />

          <div className="text-xs font-semibold text-slate-500 uppercase tracking-wider mb-2 mt-8 px-2">
            Administration
          </div>
          <NavItem icon={<Wallet size={20} />} label="Fund Sources" />
          <NavItem icon={<Users size={20} />} label="Payees" />
          <NavItem icon={<Settings size={20} />} label="Settings" />
        </nav>

        <div className="p-4 border-t border-slate-800">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-full bg-slate-700 flex items-center justify-center text-sm font-bold">
              JD
            </div>
            <div>
              <p className="text-sm font-medium">John Doe</p>
              <p className="text-xs text-slate-400">Finance Officer</p>
            </div>
          </div>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 overflow-y-auto">
        {/* Header */}
        <header className="bg-white border-b border-slate-200 px-8 py-4 flex justify-between items-center sticky top-0 z-10">
          <div>
            <h1 className="text-2xl font-bold text-slate-800">Overview</h1>
            <p className="text-sm text-slate-500">
              December 2025 Financial Monitoring
            </p>
          </div>
          <div className="flex items-center gap-4">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 w-4 h-4" />
              <input
                type="text"
                placeholder="Search check number..."
                className="pl-10 pr-4 py-2 border border-slate-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500 w-64"
              />
            </div>
            <button className="p-2 relative rounded-full hover:bg-slate-100">
              <Bell className="w-5 h-5 text-slate-600" />
              <span className="absolute top-1 right-1 w-2 h-2 bg-red-500 rounded-full"></span>
            </button>
            <button className="bg-slate-900 hover:bg-slate-800 text-white px-4 py-2 rounded-lg text-sm font-medium flex items-center gap-2 transition-colors">
              <PlusCircle className="w-4 h-4" /> New Entry
            </button>
          </div>
        </header>

        <div className="p-8 max-w-7xl mx-auto space-y-8">
          {/* Section: Fund Liquidity (The New Feature) */}
          <section>
            <h2 className="text-lg font-semibold mb-4 flex items-center gap-2">
              <Wallet className="w-5 h-5 text-emerald-600" />
              Fund Liquidity{" "}
              <span className="text-sm font-normal text-slate-500">
                (Monthly Availability)
              </span>
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {funds.map((fund, idx) => {
                const percentage = (fund.spent / fund.budget) * 100;
                const remaining = fund.budget - fund.spent;

                return (
                  <div
                    key={idx}
                    className="bg-white p-5 rounded-xl border border-slate-200 shadow-sm hover:shadow-md transition-shadow"
                  >
                    <div className="flex justify-between items-start mb-4">
                      <div>
                        <span
                          className={`text-xs font-bold px-2 py-1 rounded-md text-white ${fund.color}`}
                        >
                          {fund.code}
                        </span>
                        <h3 className="font-bold text-slate-700 mt-2">
                          {fund.name}
                        </h3>
                      </div>
                      <div className="text-right">
                        <p className="text-xs text-slate-500 uppercase">
                          Available
                        </p>
                        <p className="text-lg font-bold text-emerald-600">
                          ₱{remaining.toLocaleString()}
                        </p>
                      </div>
                    </div>

                    <div className="w-full bg-slate-100 rounded-full h-2 mb-2">
                      <div
                        className={`h-2 rounded-full ${
                          percentage > 90 ? "bg-red-500" : "bg-slate-800"
                        }`}
                        style={{ width: `${percentage}%` }}
                      ></div>
                    </div>
                    <div className="flex justify-between text-xs text-slate-500">
                      <span>Used: ₱{fund.spent.toLocaleString()}</span>
                      <span>{Math.round(percentage)}%</span>
                    </div>
                  </div>
                );
              })}
            </div>
          </section>

          {/* Section: KPI Stats */}
          <section className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm flex items-center justify-between">
              <div>
                <p className="text-sm text-slate-500 font-medium mb-1">
                  Pending Approval
                </p>
                <h3 className="text-3xl font-bold text-slate-800">4 Records</h3>
                <p className="text-xs text-orange-500 mt-2 flex items-center gap-1">
                  <Clock className="w-3 h-3" /> Requires immediate action
                </p>
              </div>
              <div className="w-12 h-12 bg-orange-50 rounded-full flex items-center justify-center border border-orange-100">
                <FileText className="w-6 h-6 text-orange-500" />
              </div>
            </div>

            <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm flex items-center justify-between">
              <div>
                <p className="text-sm text-slate-500 font-medium mb-1">
                  Total Approved
                </p>
                <h3 className="text-3xl font-bold text-slate-800">1 Record</h3>
                <p className="text-xs text-emerald-500 mt-2 flex items-center gap-1">
                  <CheckCircle2 className="w-3 h-3" /> Processed this month
                </p>
              </div>
              <div className="w-12 h-12 bg-emerald-50 rounded-full flex items-center justify-center border border-emerald-100">
                <CheckCircle2 className="w-6 h-6 text-emerald-500" />
              </div>
            </div>
          </section>

          {/* Section: Transactions Table */}
          <section className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden">
            <div className="px-6 py-4 border-b border-slate-100 flex justify-between items-center">
              <h3 className="font-semibold text-slate-800">
                Recent Transactions
              </h3>
              <button className="text-sm text-emerald-600 font-medium hover:text-emerald-700">
                View All
              </button>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-sm text-left">
                <thead className="text-xs text-slate-500 uppercase bg-slate-50 border-b border-slate-100">
                  <tr>
                    <th className="px-6 py-3 font-medium">Date</th>
                    <th className="px-6 py-3 font-medium">Reference</th>
                    <th className="px-6 py-3 font-medium">Payee</th>
                    <th className="px-6 py-3 font-medium">Fund</th>
                    <th className="px-6 py-3 font-medium text-right">
                      Net Amount
                    </th>
                    <th className="px-6 py-3 font-medium text-center">
                      Status
                    </th>
                    <th className="px-6 py-3 font-medium text-center">
                      Action
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {transactions.map((tr, i) => (
                    <tr key={i} className="hover:bg-slate-50 transition-colors">
                      <td className="px-6 py-4 text-slate-600">{tr.date}</td>
                      <td className="px-6 py-4 text-slate-400">---</td>
                      <td className="px-6 py-4 font-medium text-slate-800">
                        {tr.payee}
                      </td>
                      <td className="px-6 py-4">
                        <span className="px-2 py-1 bg-slate-100 text-slate-600 rounded text-xs font-semibold border border-slate-200">
                          {tr.fund}
                        </span>
                      </td>
                      <td className="px-6 py-4 text-right font-bold text-slate-800">
                        ₱
                        {tr.amount.toLocaleString(undefined, {
                          minimumFractionDigits: 2,
                        })}
                      </td>
                      <td className="px-6 py-4">
                        <div className="flex justify-center">
                          {tr.status === "Approved" ? (
                            <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-medium bg-emerald-100 text-emerald-800 border border-emerald-200">
                              <CheckCircle2 className="w-3 h-3" /> Approved
                            </span>
                          ) : tr.status === "Overdue" ? (
                            <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-medium bg-red-100 text-red-800 border border-red-200">
                              <AlertCircle className="w-3 h-3" /> {tr.days} Days
                            </span>
                          ) : (
                            <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-medium bg-orange-100 text-orange-800 border border-orange-200">
                              <Clock className="w-3 h-3" /> {tr.days} Days
                            </span>
                          )}
                        </div>
                      </td>
                      <td className="px-6 py-4 text-center">
                        <button className="text-slate-400 hover:text-emerald-600 font-medium text-xs border border-slate-200 hover:border-emerald-500 px-3 py-1 rounded transition-all">
                          View
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </section>
        </div>
      </main>
    </div>
  );
};

// Helper component for Nav Items
const NavItem = ({ icon, label, active }) => (
  <a
    href="#"
    className={`flex items-center gap-3 px-4 py-3 rounded-lg transition-all ${
      active
        ? "bg-emerald-600 text-white shadow-lg shadow-emerald-900/20"
        : "text-slate-400 hover:bg-slate-800 hover:text-white"
    }`}
  >
    {icon}
    <span className="text-sm font-medium">{label}</span>
  </a>
);

export default App;
