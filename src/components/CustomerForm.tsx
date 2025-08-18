import React, { useState } from 'react';
import { Customer } from '../App';
import { User, DollarSign, Calendar, Phone, CreditCard, Activity, Star, Send, Shuffle } from 'lucide-react';

interface CustomerFormProps {
  onPredict: (customer: Customer) => void;
  isLoading: boolean;
  comparisonMode?: boolean;
  comparisonCount?: number;
}

export function CustomerForm({ onPredict, isLoading, comparisonMode = false, comparisonCount = 0 }: CustomerFormProps) {
  const [formData, setFormData] = useState<Customer>({
    customer_id: '',
    tenure_months: 12,
    monthly_charges: 50,
    total_charges: 600,
    contract_type: 'monthly',
    support_tickets: 0,
    payment_method: 'credit_card',
    service_usage: 50,
    satisfaction_score: 7
  });
  const [validationErrors, setValidationErrors] = useState<{ [key: string]: string }>({});
  const [showAdvanced, setShowAdvanced] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    // Validate form
    const errors: { [key: string]: string } = {};
    if (formData.tenure_months < 0) errors.tenure_months = 'Tenure cannot be negative';
    if (formData.monthly_charges <= 0) errors.monthly_charges = 'Monthly charges must be positive';
    if (formData.satisfaction_score < 1 || formData.satisfaction_score > 10) {
      errors.satisfaction_score = 'Satisfaction score must be between 1 and 10';
    }
    
    setValidationErrors(errors);
    if (Object.keys(errors).length > 0) return;
    
    if (!formData.customer_id.trim()) {
      setFormData(prev => ({ ...prev, customer_id: `CUST_${Date.now()}` }));
    }
    onPredict(formData);
  };

  const handleChange = (field: keyof Customer, value: string | number) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    // Clear validation error when user starts typing
    if (validationErrors[field]) {
      setValidationErrors(prev => ({ ...prev, [field]: '' }));
    }
  };

  const generateRandomData = () => {
    const randomData: Customer = {
      customer_id: `CUST_${Math.floor(Math.random() * 1000).toString().padStart(3, '0')}`,
      tenure_months: Math.floor(Math.random() * 60) + 1,
      monthly_charges: Math.round((Math.random() * 100 + 20) * 100) / 100,
      total_charges: Math.round((Math.random() * 5000 + 100) * 100) / 100,
      contract_type: ['monthly', 'yearly', 'two_year'][Math.floor(Math.random() * 3)],
      support_tickets: Math.floor(Math.random() * 10),
      payment_method: ['credit_card', 'debit_card', 'bank_transfer', 'cash'][Math.floor(Math.random() * 4)],
      service_usage: Math.round(Math.random() * 100 * 10) / 10,
      satisfaction_score: Math.round((Math.random() * 9 + 1) * 10) / 10
    };
    setFormData(randomData);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {/* Quick Actions */}
      <div className="flex items-center justify-between">
        <button
          type="button"
          onClick={generateRandomData}
          className="flex items-center space-x-2 px-4 py-2 bg-gradient-to-r from-purple-500 to-pink-600 text-white rounded-lg text-sm font-medium hover:from-purple-600 hover:to-pink-700 transition-colors"
        >
          <Shuffle className="w-4 h-4" />
          <span>Random Data</span>
        </button>
        <button
          type="button"
          onClick={() => setShowAdvanced(!showAdvanced)}
          className="flex items-center space-x-2 px-4 py-2 bg-slate-100 text-slate-700 rounded-lg text-sm font-medium hover:bg-slate-200 transition-colors"
        >
          <span>{showAdvanced ? 'Hide' : 'Show'} Advanced</span>
        </button>
      </div>
      
      {comparisonMode && (
        <div className="p-4 bg-blue-50 border border-blue-200 rounded-lg">
          <div className="flex items-center space-x-2 text-blue-800">
            <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
            <span className="text-sm font-medium">
              Comparison Mode Active ({comparisonCount}/3 customers added)
            </span>
          </div>
        </div>
      )}

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        {/* Customer ID */}
        <div className="sm:col-span-2">
          <label className="flex items-center space-x-2 text-sm font-medium text-slate-700 mb-2">
            <User className="w-4 h-4" />
            <span>Customer ID</span>
          </label>
          <input
            type="text"
            value={formData.customer_id}
            onChange={(e) => handleChange('customer_id', e.target.value)}
            placeholder="Auto-generated if empty"
            className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 bg-white/80"
          />
        </div>

        {/* Tenure */}
        <div>
          <label className="flex items-center space-x-2 text-sm font-medium text-slate-700 mb-2">
            <Calendar className="w-4 h-4" />
            <span>Tenure (months)</span>
          </label>
          <input
            type="number"
            value={formData.tenure_months}
            onChange={(e) => handleChange('tenure_months', parseInt(e.target.value) || 0)}
            min="0"
            max="120"
            className={`w-full px-4 py-3 rounded-xl border focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 bg-white/80 ${
              validationErrors.tenure_months ? 'border-red-300' : 'border-slate-200'
            }`}
          />
          {validationErrors.tenure_months && (
            <p className="text-red-500 text-xs mt-1">{validationErrors.tenure_months}</p>
          )}
        </div>

        {/* Monthly Charges */}
        <div>
          <label className="flex items-center space-x-2 text-sm font-medium text-slate-700 mb-2">
            <DollarSign className="w-4 h-4" />
            <span>Monthly Charges</span>
          </label>
          <input
            type="number"
            value={formData.monthly_charges}
            onChange={(e) => handleChange('monthly_charges', parseFloat(e.target.value) || 0)}
            min="0"
            step="0.01"
            className={`w-full px-4 py-3 rounded-xl border focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 bg-white/80 ${
              validationErrors.monthly_charges ? 'border-red-300' : 'border-slate-200'
            }`}
          />
          {validationErrors.monthly_charges && (
            <p className="text-red-500 text-xs mt-1">{validationErrors.monthly_charges}</p>
          )}
        </div>

        {/* Total Charges */}
        <div>
          <label className="flex items-center space-x-2 text-sm font-medium text-slate-700 mb-2">
            <DollarSign className="w-4 h-4" />
            <span>Total Charges</span>
          </label>
          <input
            type="number"
            value={formData.total_charges}
            onChange={(e) => handleChange('total_charges', parseFloat(e.target.value) || 0)}
            min="0"
            step="0.01"
            className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 bg-white/80"
          />
        </div>

        {/* Support Tickets */}
        <div>
          <label className="flex items-center space-x-2 text-sm font-medium text-slate-700 mb-2">
            <Phone className="w-4 h-4" />
            <span>Support Tickets</span>
          </label>
          <input
            type="number"
            value={formData.support_tickets}
            onChange={(e) => handleChange('support_tickets', parseInt(e.target.value) || 0)}
            min="0"
            className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 bg-white/80"
          />
        </div>

        {/* Contract Type */}
        <div className="sm:col-span-2">
          <label className="flex items-center space-x-2 text-sm font-medium text-slate-700 mb-2">
            <User className="w-4 h-4" />
            <span>Contract Type</span>
          </label>
          <select
            value={formData.contract_type}
            onChange={(e) => handleChange('contract_type', e.target.value)}
            className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 bg-white/80"
          >
            <option value="monthly">Month-to-Month</option>
            <option value="yearly">One Year</option>
            <option value="two_year">Two Year</option>
          </select>
        </div>

        {/* Payment Method */}
        <div className="sm:col-span-2">
          <label className="flex items-center space-x-2 text-sm font-medium text-slate-700 mb-2">
            <CreditCard className="w-4 h-4" />
            <span>Payment Method</span>
          </label>
          <select
            value={formData.payment_method}
            onChange={(e) => handleChange('payment_method', e.target.value)}
            className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 bg-white/80"
          >
            <option value="credit_card">Credit Card</option>
            <option value="debit_card">Debit Card</option>
            <option value="bank_transfer">Bank Transfer</option>
            <option value="cash">Cash</option>
          </select>
        </div>

        {/* Advanced Fields */}
        {showAdvanced && (
          <>
            <div className="sm:col-span-2">
              <div className="p-4 bg-slate-50 rounded-lg border border-slate-200">
                <h4 className="text-sm font-semibold text-slate-700 mb-3">Advanced Customer Metrics</h4>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="text-xs font-medium text-slate-600 mb-1 block">
                      Average Monthly Usage (GB)
                    </label>
                    <input
                      type="number"
                      placeholder="e.g., 25.5"
                      className="w-full px-3 py-2 rounded-lg border border-slate-200 text-sm"
                    />
                  </div>
                  <div>
                    <label className="text-xs font-medium text-slate-600 mb-1 block">
                      Last Contact Date
                    </label>
                    <input
                      type="date"
                      className="w-full px-3 py-2 rounded-lg border border-slate-200 text-sm"
                    />
                  </div>
                  <div>
                    <label className="text-xs font-medium text-slate-600 mb-1 block">
                      Referral Count
                    </label>
                    <input
                      type="number"
                      placeholder="0"
                      min="0"
                      className="w-full px-3 py-2 rounded-lg border border-slate-200 text-sm"
                    />
                  </div>
                  <div>
                    <label className="text-xs font-medium text-slate-600 mb-1 block">
                      Account Age (days)
                    </label>
                    <input
                      type="number"
                      placeholder="365"
                      min="0"
                      className="w-full px-3 py-2 rounded-lg border border-slate-200 text-sm"
                    />
                  </div>
                </div>
              </div>
            </div>
          </>
        )}

        {/* Service Usage */}
        <div>
          <label className="flex items-center space-x-2 text-sm font-medium text-slate-700 mb-2">
            <Activity className="w-4 h-4" />
            <span>Service Usage (%)</span>
          </label>
          <div className="relative">
            <input
              type="range"
              value={formData.service_usage}
              onChange={(e) => handleChange('service_usage', parseFloat(e.target.value))}
              min="0"
              max="100"
              step="1"
              className="w-full h-2 bg-slate-200 rounded-lg appearance-none cursor-pointer slider"
            />
            <div className="flex justify-between text-xs text-slate-500 mt-1">
              <span>0%</span>
              <span className="font-medium text-blue-600">{formData.service_usage}%</span>
              <span>100%</span>
            </div>
          </div>
        </div>

        {/* Satisfaction Score */}
        <div>
          <label className="flex items-center space-x-2 text-sm font-medium text-slate-700 mb-2">
            <Star className="w-4 h-4" />
            <span>Satisfaction Score</span>
          </label>
          <div className="relative">
            <input
              type="range"
              value={formData.satisfaction_score}
              onChange={(e) => handleChange('satisfaction_score', parseFloat(e.target.value))}
              min="1"
              max="10"
              step="0.1"
              className={`w-full h-2 bg-slate-200 rounded-lg appearance-none cursor-pointer slider ${
                validationErrors.satisfaction_score ? 'border-red-300' : ''
              }`}
            />
            <div className="flex justify-between text-xs text-slate-500 mt-1">
              <span>1</span>
              <span className="font-medium text-blue-600">{formData.satisfaction_score}/10</span>
              <span>10</span>
            </div>
            {validationErrors.satisfaction_score && (
              <p className="text-red-500 text-xs mt-1">{validationErrors.satisfaction_score}</p>
            )}
          </div>
        </div>
      </div>

      <button
        type="submit"
        disabled={isLoading || (comparisonMode && comparisonCount >= 3)}
        className="w-full flex items-center justify-center space-x-2 px-6 py-4 bg-gradient-to-r from-blue-500 to-indigo-600 text-white rounded-xl font-medium hover:from-blue-600 hover:to-indigo-700 focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200 shadow-lg hover:shadow-xl"
      >
        {isLoading ? (
          <>
            <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
            <span>Analyzing...</span>
          </>
        ) : comparisonMode && comparisonCount >= 3 ? (
          <span>Maximum 3 customers for comparison</span>
        ) : (
          <>
            <Send className="w-5 h-5" />
            <span>{comparisonMode ? 'Add to Comparison' : 'Predict Churn Risk'}</span>
          </>
        )}
      </button>
    </form>
  );
}