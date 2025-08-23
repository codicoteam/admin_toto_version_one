import Sidebar from "@/components/Sidebar";
import { Loader2, Menu, X } from "lucide-react";
import { useEffect, useRef, useState } from "react";
import WalleService from "../services/Walle_service";

function Resourcewalle() {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [isLargeScreen, setIsLargeScreen] = useState(false);
  
  // State for wallet dashboard data
  const [dashboardData, setDashboardData] = useState({
    totalDeposits: 0,
    totalWithdrawals: 0,
    walletCount: 0,
    latestWallets: []
  });
  
  // State for loading
  const [isLoading, setIsLoading] = useState(true);
  
  // State for error messages
  const [error, setError] = useState(null);

  // Calculate amount left (deposits - withdrawals)
  const amountLeft = dashboardData.totalDeposits - dashboardData.totalWithdrawals;

  // Toggle sidebar function
  const toggleSidebar = () => {
    setSidebarOpen(!sidebarOpen);
  };

  // Update screen size state and handle sidebar visibility
  useEffect(() => {
    const checkScreenSize = () => {
      const isLarge = window.innerWidth >= 768;
      setIsLargeScreen(isLarge);
      setSidebarOpen(isLarge);
    };
    
    checkScreenSize();
    window.addEventListener("resize", checkScreenSize);

    return () => window.removeEventListener("resize", checkScreenSize);
  }, []);

  // Fetch wallet dashboard data when component mounts
  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        setIsLoading(true);
        const response = await WalleService.getDashboardData();
        setDashboardData(response.data);
        setError(null);
      } catch (err) {
        console.error("Error fetching wallet data:", err);
        setError("Failed to load wallet data");
      } finally {
        setIsLoading(false);
      }
    };

    fetchDashboardData();
  }, []);

  // Format currency for display
  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 2
    }).format(amount);
  };

  // Shimmer loading component for stats cards
  const StatCardShimmer = () => (
    <div className="bg-white p-4 rounded-lg shadow">
      <div className="h-4 bg-gray-200 rounded w-1/3 mb-3 shimmer"></div>
      <div className="h-8 bg-gray-200 rounded w-2/3 shimmer"></div>
    </div>
  );

  // Shimmer loading component for table rows
  const TableRowShimmer = () => (
    <tr>
      <td className="px-6 py-4 whitespace-nowrap">
        <div className="flex items-center">
          <div className="ml-4">
            <div className="h-4 bg-gray-200 rounded w-24 mb-2 shimmer"></div>
            <div className="h-3 bg-gray-200 rounded w-32 shimmer"></div>
          </div>
        </div>
      </td>
      <td className="px-6 py-4 whitespace-nowrap">
        <div className="h-4 bg-gray-200 rounded w-16 shimmer"></div>
      </td>
      <td className="px-6 py-4 whitespace-nowrap">
        <div className="h-4 bg-gray-200 rounded w-12 shimmer"></div>
      </td>
      <td className="px-6 py-4 whitespace-nowrap">
        <div className="h-4 bg-gray-200 rounded w-20 shimmer"></div>
      </td>
    </tr>
  );

  return (
    <div className="flex flex-col md:flex-row min-h-screen bg-gray-100">
      {/* Mobile Menu Toggle */}
      <button
        className="md:hidden fixed top-4 left-4 z-50 bg-blue-900 text-white p-2 rounded-md"
        onClick={toggleSidebar}
      >
        {sidebarOpen && !isLargeScreen ? <X size={20} /> : <Menu size={20} />}
      </button>

      {/* Sidebar */}
      <div
        className={`${
          sidebarOpen ? "translate-x-0 opacity-100" : "-translate-x-full opacity-0"
        } transition-all duration-300 ease-in-out fixed md:relative z-40 md:z-auto w-64`}
      >
        <Sidebar />
      </div>

      {/* Backdrop Overlay for Mobile */}
      {sidebarOpen && !isLargeScreen && (
        <div
          className="md:hidden fixed inset-0 bg-black bg-opacity-50 z-30"
          onClick={toggleSidebar}
        />
      )}

      <div className="bg-white w-full font-sans">
        {/* Header */}
        <div className="py-2 px-4 flex justify-between items-center">
          <h1 className="text-2xl font-bold text-slate-900">WALLET DASHBOARD</h1>
        </div>

        {/* Dashboard Stats */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 p-4">
          {isLoading ? (
            <>
              <StatCardShimmer />
              <StatCardShimmer />
              <StatCardShimmer />
              <StatCardShimmer />
            </>
          ) : (
            <>
              {/* Total Deposits Card */}
              <div className="bg-white p-4 rounded-lg shadow">
                <h3 className="text-gray-500 text-sm">Total Deposits</h3>
                <p className="text-2xl font-bold text-green-500">
                  {formatCurrency(dashboardData.totalDeposits)}
                </p>
              </div>

              {/* Total Withdrawals Card */}
              <div className="bg-white p-4 rounded-lg shadow">
                <h3 className="text-gray-500 text-sm">Total Withdrawals</h3>
                <p className="text-2xl font-bold text-red-500">
                  {formatCurrency(dashboardData.totalWithdrawals)}
                </p>
              </div>

              {/* Amount Left Card (New Card) */}
              <div className="bg-white p-4 rounded-lg shadow">
                <h3 className="text-gray-500 text-sm">Amount Left</h3>
                <p 
                  className={`text-2xl font-bold ${
                    amountLeft >= 0 ? 'text-blue-500' : 'text-orange-500'
                  }`}
                >
                  {formatCurrency(amountLeft)}
                </p>
              </div>

              {/* Wallet Count Card */}
              <div className="bg-white p-4 rounded-lg shadow">
                <h3 className="text-gray-500 text-sm">Wallet Count</h3>
                <p className="text-2xl font-bold text-purple-500">
                  {dashboardData.walletCount}
                </p>
              </div>
            </>
          )}
        </div>

        {/* Latest Wallets Section */}
        <div className="p-4">
          <h2 className="text-xl font-bold mb-4">Latest Wallets</h2>
          {error ? (
            <div className="text-red-500 p-4">{error}</div>
          ) : isLoading ? (
            <div className="bg-white rounded-lg shadow overflow-hidden">
              <table className="min-w-full">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Student</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Balance</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Currency</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Last Updated</th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {[...Array(5)].map((_, index) => (
                    <TableRowShimmer key={index} />
                  ))}
                </tbody>
              </table>
            </div>
          ) : dashboardData.latestWallets.length === 0 ? (
            <div className="text-center p-4 text-gray-500">No wallets found</div>
          ) : (
            <div className="bg-white rounded-lg shadow overflow-hidden">
              <table className="min-w-full">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Student</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Balance</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Currency</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Last Updated</th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {dashboardData.latestWallets.map((wallet) => (
                    <tr key={wallet._id}>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex items-center">
                          <div className="ml-4">
                            <div className="text-sm font-medium text-gray-900">
                              {wallet.student.firstName} {wallet.student.lastName}
                            </div>
                            <div className="text-sm text-gray-500">{wallet.student.email}</div>
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm text-gray-900">{formatCurrency(wallet.balance)}</div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm text-gray-900">{wallet.currency}</div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        {new Date(wallet.lastUpdated).toLocaleDateString()}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>

      {/* Add CSS for shimmer effect */}
      <style jsx>{`
        @keyframes shimmer {
          0% {
            background-position: -468px 0;
          }
          100% {
            background-position: 468px 0;
          }
        }
        
        .shimmer {
          animation-duration: 1.5s;
          animation-fill-mode: forwards;
          animation-iteration-count: infinite;
          animation-name: shimmer;
          animation-timing-function: linear;
          background: #f6f7f8;
          background: linear-gradient(to right, #eeeeee 8%, #dddddd 18%, #eeeeee 33%);
          background-size: 800px 104px;
          position: relative;
        }
      `}</style>
    </div>
  );
}

export default Resourcewalle;