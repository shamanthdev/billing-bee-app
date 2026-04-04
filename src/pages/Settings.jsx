import { useState, useEffect } from "react";
import { Save } from "lucide-react";
import { useAuth } from "../context/AuthContext";

export default function Settings() {
  const { userDetails } = useAuth();
  const [loading, setLoading] = useState(false);
  
  // Billing Settings State
  const [billingSettings, setBillingSettings] = useState({
    billingPrefix: "BILL",
    financialYear: "2024-25",
    enableRoundOff: false,
    enableCashDiscount: true,
  });

  // Business Info State
  const [businessInfo, setBusinessInfo] = useState({
    businessName: "",
    phone: "",
    gstNumber: "",
    address: "",
  });

  // Auto-populate business info from user details
  useEffect(() => {
    if (userDetails) {
      setBusinessInfo({
        businessName: userDetails.businessName || "",
        phone: userDetails.phone || "",
        gstNumber: userDetails.gstNumber || "",
        address: userDetails.address || "",
      });
    }
  }, [userDetails]);

  const handleSaveSettings = async () => {
    setLoading(true);
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000));
      console.log("Settings saved:", { billingSettings, businessInfo });
      // TODO: Add success toast notification
    } catch (error) {
      console.error("Failed to save settings:", error);
      // TODO: Add error toast notification
    } finally {
      setLoading(false);
    }
  };

  const handleBillingChange = (field, value) => {
    setBillingSettings(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handleBusinessChange = (field, value) => {
    setBusinessInfo(prev => ({
      ...prev,
      [field]: value
    }));
  };

  return (
    <div className="max-w-7xl mx-auto">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-2xl font-semibold tracking-tight text-gray-900 dark:text-white">
          Settings
        </h1>
        <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
          Manage your application settings and business information
        </p>
      </div>

      {/* Settings Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
        
        {/* Card 1: Billing Settings */}
        <div className="bg-white dark:bg-[#1f1f1f] rounded-xl border border-gray-200 dark:border-gray-800 shadow-sm">
          <div className="p-6">
            <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-6">
              Billing Settings
            </h2>
            
            <div className="space-y-4">
              {/* Billing Prefix */}
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Billing Prefix
                </label>
                <input
                  type="text"
                  value={billingSettings.billingPrefix}
                  onChange={(e) => handleBillingChange('billingPrefix', e.target.value)}
                  className="w-full px-4 py-2.5 text-sm rounded-lg border border-gray-300 dark:border-gray-700 bg-white dark:bg-[#111827] text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-yellow-500 focus:border-transparent transition"
                  placeholder="e.g., BILL"
                />
              </div>

              {/* Financial Year */}
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Financial Year
                </label>
                <input
                  type="text"
                  value={billingSettings.financialYear}
                  onChange={(e) => handleBillingChange('financialYear', e.target.value)}
                  className="w-full px-4 py-2.5 text-sm rounded-lg border border-gray-300 dark:border-gray-700 bg-white dark:bg-[#111827] text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-yellow-500 focus:border-transparent transition"
                  placeholder="e.g., 2024-25"
                />
              </div>

              {/* Enable Round Off */}
              <div className="flex items-center justify-between py-2">
                <label className="text-sm font-medium text-gray-700 dark:text-gray-300">
                  Enable Round Off
                </label>
                <button
                  onClick={() => handleBillingChange('enableRoundOff', !billingSettings.enableRoundOff)}
                  className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                    billingSettings.enableRoundOff ? 'bg-yellow-500' : 'bg-gray-300 dark:bg-gray-600'
                  }`}
                >
                  <span
                    className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                      billingSettings.enableRoundOff ? 'translate-x-6' : 'translate-x-1'
                    }`}
                  />
                </button>
              </div>

              {/* Enable Cash Discount */}
              <div className="flex items-center justify-between py-2">
                <label className="text-sm font-medium text-gray-700 dark:text-gray-300">
                  Enable Cash Discount
                </label>
                <button
                  onClick={() => handleBillingChange('enableCashDiscount', !billingSettings.enableCashDiscount)}
                  className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                    billingSettings.enableCashDiscount ? 'bg-yellow-500' : 'bg-gray-300 dark:bg-gray-600'
                  }`}
                >
                  <span
                    className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                    billingSettings.enableCashDiscount ? 'translate-x-6' : 'translate-x-1'
                    }`}
                  />
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Card 2: Business Info */}
        <div className="bg-white dark:bg-[#1f1f1f] rounded-xl border border-gray-200 dark:border-gray-800 shadow-sm">
          <div className="p-6">
            <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-6">
              Business Info
            </h2>
            
            <div className="space-y-4">
              {/* Business Name */}
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Business Name
                </label>
                <input
                  type="text"
                  value={businessInfo.businessName}
                  onChange={(e) => handleBusinessChange('businessName', e.target.value)}
                  className="w-full px-4 py-2.5 text-sm rounded-lg border border-gray-300 dark:border-gray-700 bg-white dark:bg-[#111827] text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-yellow-500 focus:border-transparent transition"
                  placeholder="Enter business name"
                />
              </div>

              {/* Phone */}
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Phone
                </label>
                <input
                  type="tel"
                  value={businessInfo.phone}
                  onChange={(e) => handleBusinessChange('phone', e.target.value)}
                  className="w-full px-4 py-2.5 text-sm rounded-lg border border-gray-300 dark:border-gray-700 bg-white dark:bg-[#111827] text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-yellow-500 focus:border-transparent transition"
                  placeholder="Enter phone number"
                />
              </div>

              {/* GST Number */}
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  GST Number
                </label>
                <input
                  type="text"
                  value={businessInfo.gstNumber}
                  onChange={(e) => handleBusinessChange('gstNumber', e.target.value)}
                  className="w-full px-4 py-2.5 text-sm rounded-lg border border-gray-300 dark:border-gray-700 bg-white dark:bg-[#111827] text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-yellow-500 focus:border-transparent transition"
                  placeholder="Enter GST number"
                />
              </div>

              {/* Address */}
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Address
                </label>
                <textarea
                  value={businessInfo.address}
                  onChange={(e) => handleBusinessChange('address', e.target.value)}
                  rows={3}
                  className="w-full px-4 py-2.5 text-sm rounded-lg border border-gray-300 dark:border-gray-700 bg-white dark:bg-[#111827] text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-yellow-500 focus:border-transparent transition resize-none"
                  placeholder="Enter business address"
                />
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Save Button */}
      <div className="flex justify-end">
        <button
          onClick={handleSaveSettings}
          disabled={loading}
          className="flex items-center gap-2 px-6 py-2.5 bg-yellow-500 hover:bg-yellow-600 text-black font-medium rounded-lg shadow-sm hover:shadow-md transition disabled:opacity-50 disabled:cursor-not-allowed"
        >
          <Save size={18} />
          {loading ? "Saving..." : "Save Settings"}
        </button>
      </div>
    </div>
  );
}
