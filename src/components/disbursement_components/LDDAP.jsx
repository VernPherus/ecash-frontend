import React from "react";
import { ArrowLeft, PlusCircle, Edit } from "lucide-react";
import { useNavigate, NavLink } from "react-router-dom";

const Lddap = () => {
  const navigate = useNavigate();

  return (
    <main className="flex-1 overflow-y-auto">
      <header className="bg-white border-b border-slate-200 px-8 py-4 flex justify-between items-center sticky top-0 z-10">
        <div className="flex items-center gap-4">
          <button onClick={() => navigate(-1)} className="p-2 hover:bg-slate-100 rounded">
            <ArrowLeft className="w-5 h-5" />
          </button>
          <h1 className="text-2xl font-bold">Disbursement Documents</h1>
        </div>
      </header>

      {/* Navigation Tabs */}
      <div className="bg-white border-b border-slate-200 px-8 py-3">
        <div className="max-w-7xl mx-auto flex gap-2">
          <NavLink 
            to="/check" 
            className={({ isActive }) =>
              `px-4 py-2 rounded-lg text-sm font-medium flex items-center gap-2 transition-colors ${
                isActive 
                  ? 'bg-slate-900 text-white' 
                  : 'bg-slate-100 hover:bg-slate-200 text-slate-700'
              }`
            }
          >
            <PlusCircle className="w-4 h-4" /> Check
          </NavLink>

          <NavLink 
            to="/lddap" 
            className={({ isActive }) =>
              `px-4 py-2 rounded-lg text-sm font-medium flex items-center gap-2 transition-colors ${
                isActive 
                  ? 'bg-slate-900 text-white' 
                  : 'bg-slate-100 hover:bg-slate-200 text-slate-700'
              }`
            }
          >
            <Edit className="w-4 h-4" /> LDDAP
          </NavLink>

          <NavLink 
            to="/disbursement/new" 
            className={({ isActive }) =>
              `px-4 py-2 rounded-lg text-sm font-medium flex items-center gap-2 transition-colors ${
                isActive 
                  ? 'bg-slate-900 text-white' 
                  : 'bg-slate-100 hover:bg-slate-200 text-slate-700'
              }`
            }
          >
            Form
          </NavLink>
        </div>
      </div>

      <div className="p-8 max-w-7xl mx-auto">
        <h2 className="text-xl font-bold mb-4">LDDAP Document</h2>
        <p>LDDAP page content here</p>
        {/* Add your LDDAP content */}
      </div>
    </main>
  );
};

export default Lddap;