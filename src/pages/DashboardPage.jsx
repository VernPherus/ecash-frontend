import { useEffect } from "react";
//* Component imports
import Header from "../components/Header";
import FundLiquidityCards from "../components/FundLiquidityCards";
import { TrendingUp, Wallet, ArrowRight } from "lucide-react";
import DisbursementTable from "../components/DisbursementTable";
import DashboardTimeStats from "../components/DashboardTimeStats";
//* Store Imports
import useSystemStore from "../store/useSystemStore";
import useFundStore from "../store/useFundStore";
//* Function imports
import { formatCurrency } from "../lib/formatters";

const DashboardPage = () => {
  const { time, getTime } = useSystemStore();
  const { isLoading, getFundColor, displayFundStats, fundStats } =
    useFundStore();

  useEffect(() => {
    const initializeDashboard = async () => {
      try {
        await getTime();

        const { time: updatedTime } = useSystemStore.getState();

        console.log("Time after getTime:", updatedTime); // Debug log

        if (updatedTime?.month) {
          await displayFundStats({
            month: Number(updatedTime.month),
          });
        } else {
          console.error("Month is still not available after getTime");
        }
      } catch (error) {
        console.error("Failed to initialize dashboard:", error);
      }
    };

    initializeDashboard();
  }, [getTime, displayFundStats]);

  return (
    <div className="min-h-screen bg-base-200">
      <Header />

      {/* Main Content */}
      <div className="p-8 max-w-7xl mx-auto space-y-8">
        {/* Fund Liquidity Section */}
        <DashboardTimeStats
          currentDate={time.currentDate}
          quarter={time.quarter}
        />

        <section className="bg-white dark:bg-base-100 border border-base-300 rounded-xl shadow-md overflow-visible animate-fade-in-up">
          <div className="px-6 py-5 flex flex-col sm:flex-row sm:items-center justiy-between gap-4 border-b border-base-200">
            <div>
              <h3 className="font-bold text-lg text-base-content flex items-center gap-2">
                <TrendingUp className="w-5 h-5 text-primary" />
                Transactions
              </h3>
              <p className="text-xs text-base-content/50 mt-1">
                Recent disbursement activity
              </p>
              <div className="flex items-center justify-between px-1">
                <h2 className="text-base font-semibold text-base-content flex items-center gap-2">
                  <Wallet className="w-4 h-4 text-primary" />
                  Fund Overview
                </h2>
                <button className="text-xs font-medium text-primary hover:underline flex items-center gap-1">
                  View All <ArrowRight className="w-3 h-3" />
                </button>
              </div>
            </div>
            {fundStats.map((fundStat) => {
              return (
                <FundLiquidityCards
                  fundId={fundStat.fundId}
                  totalEntries={fundStat.totalEntries}
                  totalMonthly={fundStat.totalMonthly}
                  totalDisbursements={fundStat.totalDisbursement}
                  totalCashUtil={fundStat.totalCashUtil}
                />
              );
            })}
          </div>
        </section>

        {/* Transactions Table Section */}
        <DisbursementTable />
      </div>
    </div>
  );
};

export default DashboardPage;
