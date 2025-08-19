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
          {/* Total Deposits Card */}
          <div className="bg-white p-4 rounded-lg shadow">
            <h3 className="text-gray-500 text-sm">Total Deposits</h3>
            <p className="text-2xl font-bold text-green-500">
              {isLoading ? "Loading..." : formatCurrency(dashboardData.totalDeposits)}
            </p>
          </div>

          {/* Total Withdrawals Card */}
          <div className="bg-white p-4 rounded-lg shadow">
            <h3 className="text-gray-500 text-sm">Total Withdrawals</h3>
            <p className="text-2xl font-bold text-red-500">
              {isLoading ? "Loading..." : formatCurrency(dashboardData.totalWithdrawals)}
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
              {isLoading ? "Loading..." : formatCurrency(amountLeft)}
            </p>
          </div>

          {/* Wallet Count Card */}
          <div className="bg-white p-4 rounded-lg shadow">
            <h3 className="text-gray-500 text-sm">Wallet Count</h3>
            <p className="text-2xl font-bold text-purple-500">
              {isLoading ? "Loading..." : dashboardData.walletCount}
            </p>
          </div>
        </div>

        {/* Latest Wallets Section */}
        <div className="p-4">
          <h2 className="text-xl font-bold mb-4">Latest Wallets</h2>
          {error ? (
            <div className="text-red-500 p-4">{error}</div>
          ) : isLoading ? (
            <Loader2 className="h-8 w-8 animate-spin text-blue-900" />
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
    </div>
  );
}

export default Resourcewalle;