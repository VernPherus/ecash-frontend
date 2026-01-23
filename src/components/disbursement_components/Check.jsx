import React from "react";
import { ArrowLeft } from "lucide-react";
import { useNavigate } from "react-router-dom";

const Check = () => {
  const navigate = useNavigate();

  return (
    <main className="flex-1 overflow-y-auto bg-slate-50">
      <header className="bg-white border-b border-slate-200 px-8 py-4 sticky top-0 z-10">
        <div className="flex items-center gap-4">
          <button onClick={() => navigate(-1)} className="btn btn-ghost btn-sm">
            <ArrowLeft className="w-5 h-5" />
          </button>
          <h1 className="text-2xl font-bold">Check</h1>
        </div>
      </header>
      <div className="p-8">
        <p>Check page content here</p>
      </div>
    </main>
  );
};

export default Check;