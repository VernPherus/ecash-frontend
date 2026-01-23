import Header from "../components/Header";
import FundLiquidityCards from "../components/FundLiquidityCards";
import DisbursementTable from "../components/DisbursementTable";

const DashboardPage = () => {
  return (
    <div className="min-h-screen bg-base-200">
      <Header />

      {/* Main Content */}
      <div className="p-8 max-w-7xl mx-auto space-y-8">
        {/* Fund Liquidity Section */}
        <FundLiquidityCards />

        {/* Transactions Table Section */}
        <DisbursementTable />
      </div>
    </div>
  );
};

export default DashboardPage;
