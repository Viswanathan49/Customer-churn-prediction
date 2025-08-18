import React, { useState } from 'react';
import { Customer } from '../App';
import { Users, Play, Shuffle, TrendingUp } from 'lucide-react';

interface SampleCustomersProps {
  onSelectCustomer: (customer: Customer) => void;
}

const sampleCustomers: Customer[] = [
  {
    customer_id: 'CUST_001',
    tenure_months: 3,
    monthly_charges: 85.50,
    total_charges: 256.50,
    contract_type: 'monthly',
    support_tickets: 5,
    payment_method: 'credit_card',
    service_usage: 15.2,
    satisfaction_score: 4.2
  },
  {
    customer_id: 'CUST_002',
    tenure_months: 24,
    monthly_charges: 45.20,
    total_charges: 1084.80,
    contract_type: 'yearly',
    support_tickets: 1,
    payment_method: 'bank_transfer',
    service_usage: 78.5,
    satisfaction_score: 8.7
  },
  {
    customer_id: 'CUST_003',
    tenure_months: 12,
    monthly_charges: 65.30,
    total_charges: 783.60,
    contract_type: 'monthly',
    support_tickets: 2,
    payment_method: 'debit_card',
    service_usage: 42.1,
    satisfaction_score: 6.8
  },
  {
    customer_id: 'CUST_004',
    tenure_months: 48,
    monthly_charges: 35.00,
    total_charges: 1680.00,
    contract_type: 'two_year',
    support_tickets: 0,
    payment_method: 'bank_transfer',
    service_usage: 89.3,
    satisfaction_score: 9.1
  },
  {
    customer_id: 'CUST_005',
    tenure_months: 6,
    monthly_charges: 95.80,
    total_charges: 574.80,
    contract_type: 'monthly',
    support_tickets: 8,
    payment_method: 'cash',
    service_usage: 25.7,
    satisfaction_score: 3.4
  }
];

export function SampleCustomers({ onSelectCustomer }: SampleCustomersProps) {
  const [selectedCustomer, setSelectedCustomer] = useState<string | null>(null);

  const handleSelectCustomer = (customer: Customer) => {
    setSelectedCustomer(customer.customer_id);
    onSelectCustomer(customer);
  };

  const generateRandomCustomer = () => {
    const randomCustomer: Customer = {
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
    
    handleSelectCustomer(randomCustomer);
  };

  const getRiskIndicator = (customer: Customer) => {
    let riskScore = 0;
    if (customer.tenure_months < 6) riskScore += 3;
    if (customer.monthly_charges > 80) riskScore += 2;
    if (customer.support_tickets > 3) riskScore += 2;
    if (customer.contract_type === 'monthly') riskScore += 2;
    if (customer.satisfaction_score < 6) riskScore += 3;
    
    if (riskScore >= 6) return { level: 'HIGH', color: 'bg-red-500', textColor: 'text-red-600' };
    if (riskScore >= 3) return { level: 'MEDIUM', color: 'bg-yellow-500', textColor: 'text-yellow-600' };
    return { level: 'LOW', color: 'bg-green-500', textColor: 'text-green-600' };
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-white/80 backdrop-blur-sm rounded-2xl shadow-xl border border-white/20 p-6">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <div className="p-2 bg-gradient-to-r from-purple-500 to-pink-600 rounded-lg">
              <Users className="w-6 h-6 text-white" />
            </div>
            <div>
              <h2 className="text-2xl font-semibold text-slate-800">Sample Customers</h2>
              <p className="text-slate-600">Test the model with pre-configured customer profiles</p>
            </div>
          </div>
          <button
            onClick={generateRandomCustomer}
            className="flex items-center space-x-2 px-6 py-3 bg-gradient-to-r from-indigo-500 to-purple-600 text-white rounded-xl font-medium hover:from-indigo-600 hover:to-purple-700 transition-all duration-200 shadow-lg hover:shadow-xl"
          >
            <Shuffle className="w-5 h-5" />
            <span>Random Customer</span>
          </button>
        </div>
      </div>

      {/* Customer Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {sampleCustomers.map((customer) => {
          const risk = getRiskIndicator(customer);
          const isSelected = selectedCustomer === customer.customer_id;
          
          return (
            <div
              key={customer.customer_id}
              className={`bg-white/80 backdrop-blur-sm rounded-2xl shadow-lg border transition-all duration-200 cursor-pointer hover:shadow-xl hover:scale-105 ${
                isSelected ? 'border-blue-500 shadow-blue-200' : 'border-white/20'
              }`}
              onClick={() => handleSelectCustomer(customer)}
            >
              <div className="p-6">
                {/* Header */}
                <div className="flex items-center justify-between mb-4">
                  <div>
                    <h3 className="text-lg font-semibold text-slate-800">{customer.customer_id}</h3>
                    <p className="text-sm text-slate-500">{customer.tenure_months} months tenure</p>
                  </div>
                  <div className="flex items-center space-x-2">
                    <div className={`w-3 h-3 ${risk.color} rounded-full`}></div>
                    <span className={`text-xs font-medium ${risk.textColor}`}>{risk.level}</span>
                  </div>
                </div>

                {/* Stats */}
                <div className="space-y-3">
                  <div className="flex justify-between text-sm">
                    <span className="text-slate-500">Monthly Charges:</span>
                    <span className="font-medium">${customer.monthly_charges}</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-slate-500">Total Charges:</span>
                    <span className="font-medium">${customer.total_charges}</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-slate-500">Support Tickets:</span>
                    <span className="font-medium">{customer.support_tickets}</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-slate-500">Satisfaction:</span>
                    <span className="font-medium">{customer.satisfaction_score}/10</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-slate-500">Usage:</span>
                    <span className="font-medium">{customer.service_usage}%</span>
                  </div>
                </div>

                {/* Contract Badge */}
                <div className="mt-4 pt-4 border-t border-slate-200">
                  <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-slate-100 text-slate-700">
                    {customer.contract_type.replace('_', ' ')} contract
                  </span>
                </div>

                {/* Action Button */}
                <button className="w-full mt-4 flex items-center justify-center space-x-2 px-4 py-2 bg-gradient-to-r from-blue-500 to-indigo-600 text-white rounded-lg font-medium hover:from-blue-600 hover:to-indigo-700 transition-colors">
                  <Play className="w-4 h-4" />
                  <span>Analyze Customer</span>
                </button>
              </div>
            </div>
          );
        })}
      </div>

      {/* Stats Footer */}
      <div className="bg-white/80 backdrop-blur-sm rounded-2xl shadow-xl border border-white/20 p-6">
        <div className="flex items-center space-x-3 mb-4">
          <div className="p-2 bg-gradient-to-r from-blue-500 to-indigo-600 rounded-lg">
            <TrendingUp className="w-5 h-5 text-white" />
          </div>
          <h3 className="text-lg font-semibold text-slate-800">Sample Data Insights</h3>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-center">
          <div>
            <div className="text-2xl font-bold text-green-600">
              {sampleCustomers.filter(c => getRiskIndicator(c).level === 'LOW').length}
            </div>
            <div className="text-sm text-slate-600">Low Risk Customers</div>
          </div>
          <div>
            <div className="text-2xl font-bold text-yellow-600">
              {sampleCustomers.filter(c => getRiskIndicator(c).level === 'MEDIUM').length}
            </div>
            <div className="text-sm text-slate-600">Medium Risk Customers</div>
          </div>
          <div>
            <div className="text-2xl font-bold text-red-600">
              {sampleCustomers.filter(c => getRiskIndicator(c).level === 'HIGH').length}
            </div>
            <div className="text-sm text-slate-600">High Risk Customers</div>
          </div>
        </div>
      </div>
    </div>
  );
}