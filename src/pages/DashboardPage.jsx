import { useEffect } from "react";
//* Component imports
import Header from "../components/Header";
import { TrendingUp, Wallet, ArrowRight, LayoutGrid } from "lucide-react";
import DisbursementTable from "../components/DisbursementTable";
import DashboardTimeStats from "../components/DashboardTimeStats";
import FundStatCard from "../components/FundStatCard";

//* Store Imports
import useSystemStore from "../store/useSystemStore";
import useFundStore from "../store/useFundStore";

const DashboardPage = () => {
  const { time, getTime } = useSystemStore();
  const { displayFundStats, fundStats, fetchFunds } = useFundStore();

  useEffect(() => {
    const initializeDashboard = async () => {
      try {
        // Fetch global time
        await getTime();

        // Fetch funds list to ensure we have names for the cards
        fetchFunds();

        const { time: updatedTime } = useSystemStore.getState();

        if (updatedTime?.month) {
          await displayFundStats({
            month: Number(updatedTime.month),
          });
        }
      } catch (error) {
        console.error("Failed to initialize dashboard:", error);
      }
    };

    initializeDashboard();
  }, [getTime, displayFundStats, fetchFunds]);

  return (
    <div className="min-h-screen bg-base-200/50 pb-20">
      <Header />

      {/* Main Content */}
      <div className="px-6 lg:px-8 py-8 max-w-7xl mx-auto space-y-8">
        {/* Time Stats Section */}
        <DashboardTimeStats
          currentDate={time.currentDate}
          quarter={time.quarter}
        />

        {/* Fund Liquidity Section */}
        <section>
          <div className="flex items-center justify-between mb-4">
            <h3 className="font-bold text-lg text-base-content flex items-center gap-2">
              <Wallet className="w-5 h-5 text-primary" />
              Fund Liquidity Overview
            </h3>
          </div>

          {fundStats.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {fundStats.map((fundStat) => (
                <FundStatCard
                  key={fundStat.fundId} // Added key
                  fundId={fundStat.fundId}
                  totalEntries={fundStat.totalEntries}
                  totalMonthly={fundStat.totalMonthly}
                  totalDisbursements={fundStat.totalDisbursement}
                  totalCashUtil={fundStat.totalCashUtil}
                />
              ))}
            </div>
          ) : (
            <div className="text-center py-12 bg-base-100 rounded-xl border border-base-300 border-dashed">
              <LayoutGrid className="w-12 h-12 mx-auto text-base-content/20 mb-3" />
              <p className="text-base-content/50">
                No fund statistics available for this period.
              </p>
            </div>
          )}
        </section>

        {/* Transactions Table Section */}
        <section className="space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="font-bold text-lg text-base-content flex items-center gap-2">
                <TrendingUp className="w-5 h-5 text-primary" />
                Recent Transactions
              </h3>
              <p className="text-xs text-base-content/50 mt-1">
                Latest disbursement activity across all funds
              </p>
            </div>
          </div>
          <DisbursementTable />
        </section>
      </div>
    </div>
  );
};

export default DashboardPage;
