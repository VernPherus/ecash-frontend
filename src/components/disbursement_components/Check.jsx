import React from 'react';

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
  CircleMinus
} from "lucide-react";

const Check =()=> {
return(

  <main className="flex-1 overflow-y-auto">
   <header className="bg-white border-b border-slate-200 px-8 py-4 flex justify-between items-center sticky top-0 z-10">
 <div>
            <h1 className="text-2xl font-bold text-slate-800">Overview</h1>
            <p className="text-sm text-slate-500">
              December 2025 Financial Monitoring
            </p>
          </div>
         <h1 className="text-2xl font-bold text-slate-800"></h1>
          <div className="flex items-center gap-4">



            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 w-4 h-4" />
             <input type="text" placeholder="Search..." className="pl-10 pr-4 py-2 border rounded-lg" />
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

<div>

<form>
  <div>
  <input type= "number" placeholder="Number" />
  </div>
   <div>
  <input type= "text" placeholder="" />
  </div>
   <div>
  <input type= "text" placeholder="Number" />
  </div>

</form>

</div>

        </main>

);


};
export default Check;