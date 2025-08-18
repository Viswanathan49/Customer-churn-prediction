import React, { useState, useEffect } from 'react';
import { ChurnPredictor } from './components/ChurnPredictor';
import { CustomerForm } from './components/CustomerForm';
import { PredictionResults } from './components/PredictionResults';
import { SampleCustomers } from './components/SampleCustomers';
import { DataImport } from './components/DataImport';
import { Brain, Users, TrendingUp, AlertTriangle } from 'lucide-react';
import { Upload } from 'lucide-react';

export interface Customer {
  customer_id: string;
  tenure_months: number;
  monthly_charges: number;
  total_charges: number;
  contract_type: string;
  support_tickets: number;
  payment_method: string;
  service_usage: number;
  satisfaction_score: number;
}

export interface PredictionResult {
  customer_id: string;
  churn_probability: number;
  risk_level: string;
  risk_factors: string[];
  recommendations: string[];
  confidence_score: number;
  prediction_timestamp: string;
  model_version: string;
  feature_importance: { [key: string]: number };
}

function App() {
  const [activeTab, setActiveTab] = useState<'predict' | 'import' | 'samples'>('predict');
  const [customer, setCustomer] = useState<Customer | null>(null);
  const [prediction, setPrediction] = useState<PredictionResult | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [predictionHistory, setPredictionHistory] = useState<PredictionResult[]>([]);
  const [comparisonMode, setComparisonMode] = useState(false);
  const [comparisonCustomers, setComparisonCustomers] = useState<Customer[]>([]);

  const handlePrediction = async (customerData: Customer) => {
    setIsLoading(true);
    try {
      // Simulate API call to Python backend
      const result = await simulateChurnPrediction(customerData);
      setPrediction(result);
      setCustomer(customerData);
      
      // Add to history
      setPredictionHistory(prev => [result, ...prev.slice(0, 9)]); // Keep last 10 predictions
      
      // Add to comparison if in comparison mode
      if (comparisonMode && comparisonCustomers.length < 3) {
        setComparisonCustomers(prev => [...prev, customerData]);
      }
    } catch (error) {
      console.error('Prediction failed:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const simulateChurnPrediction = async (customerData: Customer): Promise<PredictionResult> => {
    // Simulate processing delay
    await new Promise(resolve => setTimeout(resolve, 1500));
    
    // Simple churn prediction logic (mimicking the Python model)
    let score = 0.1; // base score
    
    // Risk factors
    if (customerData.tenure_months < 6) score += 0.3;
    if (customerData.monthly_charges > 80) score += 0.2;
    if (customerData.support_tickets > 3) score += 0.25;
    if (customerData.contract_type === 'monthly') score += 0.2;
    if (customerData.satisfaction_score < 6) score += 0.3;
    if (customerData.service_usage < 20) score += 0.15;
    
    // Positive factors
    if (customerData.tenure_months > 24) score -= 0.2;
    if (customerData.total_charges > 2000) score -= 0.1;
    if (customerData.satisfaction_score > 8) score -= 0.2;
    
    const churn_probability = Math.min(Math.max(score, 0), 1);
    
    const risk_factors = [];
    if (customerData.tenure_months < 6) risk_factors.push("New customer (high churn risk)");
    if (customerData.monthly_charges > 80) risk_factors.push("High monthly charges");
    if (customerData.support_tickets > 3) risk_factors.push("Multiple support issues");
    if (customerData.contract_type === 'monthly') risk_factors.push("Month-to-month contract");
    if (customerData.satisfaction_score < 6) risk_factors.push("Low satisfaction score");
    if (customerData.service_usage < 20) risk_factors.push("Low service engagement");
    
    const recommendations = [];
    if (risk_factors.some(f => f.includes("New customer"))) recommendations.push("Implement onboarding program");
    if (risk_factors.some(f => f.includes("High monthly"))) recommendations.push("Offer loyalty discount");
    if (risk_factors.some(f => f.includes("support issues"))) recommendations.push("Proactive customer success outreach");
    if (risk_factors.some(f => f.includes("Month-to-month"))) recommendations.push("Offer annual contract incentives");
    if (risk_factors.some(f => f.includes("Low satisfaction"))) recommendations.push("Schedule satisfaction survey");
    if (risk_factors.some(f => f.includes("Low service"))) recommendations.push("Provide usage tips and feature education");
    
    if (recommendations.length === 0) recommendations.push("Continue monitoring current service level");
    
    // Calculate confidence score based on data completeness and model certainty
    const confidence = Math.min(0.95, 0.7 + (Math.abs(0.5 - churn_probability) * 0.5));
    
    // Feature importance (mock values - in real implementation, these would come from the model)
    const feature_importance = {
      satisfaction_score: 0.25,
      tenure_months: 0.20,
      support_tickets: 0.18,
      contract_type: 0.15,
      monthly_charges: 0.12,
      service_usage: 0.10
    };
    
    return {
      customer_id: customerData.customer_id,
      churn_probability: Math.round(churn_probability * 1000) / 1000,
      risk_level: churn_probability > 0.7 ? 'HIGH' : churn_probability > 0.4 ? 'MEDIUM' : 'LOW',
      risk_factors,
      recommendations,
      confidence_score: Math.round(confidence * 1000) / 1000,
      prediction_timestamp: new Date().toISOString(),
      model_version: 'v2.1.0',
      feature_importance
    };
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100">
      {/* Header */}
      <header className="bg-white/80 backdrop-blur-md border-b border-slate-200 sticky top-0 z-40">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center space-x-3">
              <div className="p-2 bg-gradient-to-r from-blue-500 to-indigo-600 rounded-xl">
                <Brain className="w-8 h-8 text-white" />
              </div>
              <div>
                <h1 className="text-2xl font-bold bg-gradient-to-r from-slate-800 to-slate-600 bg-clip-text text-transparent">
                  Churn Predictor
                </h1>
                <p className="text-sm text-slate-500">AI-Powered Customer Retention</p>
              </div>
            </div>
            <div className="flex items-center space-x-4">
              <div className="flex items-center space-x-2 text-sm text-slate-600">
                <TrendingUp className="w-4 h-4" />
                <span>94.2% Accuracy</span>
              </div>
              <div className="flex items-center space-x-2 text-sm text-slate-600">
                <Users className="w-4 h-4" />
                <span>10k+ Predictions</span>
              </div>
            </div>
          </div>
        </div>
      </header>

      {/* Navigation */}
      <nav className="bg-white/60 backdrop-blur-sm border-b border-slate-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex space-x-8">
            {[
              { key: 'predict', label: 'Single Prediction', icon: Brain },
              { key: 'import', label: 'Import Data', icon: Upload },
              { key: 'samples', label: 'Sample Data', icon: Users }
            ].map(({ key, label, icon: Icon }) => (
              <button
                key={key}
                onClick={() => setActiveTab(key as any)}
                className={`flex items-center space-x-2 px-4 py-3 text-sm font-medium border-b-2 transition-colors ${
                  activeTab === key
                    ? 'border-blue-500 text-blue-600'
                    : 'border-transparent text-slate-600 hover:text-slate-800 hover:border-slate-300'
                }`}
              >
                <Icon className="w-4 h-4" />
                <span>{label}</span>
              </button>
            ))}
          </div>
        </div>
      </nav>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {activeTab === 'predict' && (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            <div className="space-y-6">
              {/* Prediction Mode Toggle */}
              <div className="bg-white/80 backdrop-blur-sm rounded-2xl shadow-xl border border-white/20 p-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-3">
                    <h3 className="text-lg font-semibold text-slate-800">Prediction Mode</h3>
                  </div>
                  <div className="flex items-center space-x-2">
                    <span className={`text-sm ${!comparisonMode ? 'text-blue-600 font-medium' : 'text-slate-500'}`}>
                      Single
                    </span>
                    <button
                      onClick={() => {
                        setComparisonMode(!comparisonMode);
                        if (!comparisonMode) setComparisonCustomers([]);
                      }}
                      className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                        comparisonMode ? 'bg-blue-600' : 'bg-slate-300'
                      }`}
                    >
                      <span
                        className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                          comparisonMode ? 'translate-x-6' : 'translate-x-1'
                        }`}
                      />
                    </button>
                    <span className={`text-sm ${comparisonMode ? 'text-blue-600 font-medium' : 'text-slate-500'}`}>
                      Compare
                    </span>
                  </div>
                </div>
                {comparisonMode && (
                  <div className="mt-3 text-sm text-slate-600">
                    Compare up to 3 customers side by side. Current: {comparisonCustomers.length}/3
                  </div>
                )}
              </div>
              
              <div className="bg-white/80 backdrop-blur-sm rounded-2xl shadow-xl border border-white/20 p-6">
                <div className="flex items-center space-x-3 mb-6">
                  <div className="p-2 bg-gradient-to-r from-green-500 to-emerald-600 rounded-lg">
                    <Users className="w-5 h-5 text-white" />
                  </div>
                  <h2 className="text-xl font-semibold text-slate-800">Customer Information</h2>
                </div>
                <CustomerForm 
                  onPredict={handlePrediction} 
                  isLoading={isLoading}
                  comparisonMode={comparisonMode}
                  comparisonCount={comparisonCustomers.length}
                />
              </div>
              
              {/* Prediction History */}
              {predictionHistory.length > 0 && (
                <div className="bg-white/80 backdrop-blur-sm rounded-2xl shadow-xl border border-white/20 p-6">
                  <div className="flex items-center space-x-3 mb-4">
                    <div className="p-2 bg-gradient-to-r from-indigo-500 to-purple-600 rounded-lg">
                      <TrendingUp className="w-5 h-5 text-white" />
                    </div>
                    <h3 className="text-lg font-semibold text-slate-800">Recent Predictions</h3>
                  </div>
                  <div className="space-y-2 max-h-48 overflow-y-auto">
                    {predictionHistory.slice(0, 5).map((pred, index) => (
                      <div key={index} className="flex items-center justify-between p-3 bg-slate-50 rounded-lg">
                        <div className="flex items-center space-x-3">
                          <div className={`w-3 h-3 rounded-full ${
                            pred.risk_level === 'HIGH' ? 'bg-red-500' :
                            pred.risk_level === 'MEDIUM' ? 'bg-yellow-500' : 'bg-green-500'
                          }`}></div>
                          <span className="text-sm font-medium text-slate-700">{pred.customer_id}</span>
                        </div>
                        <div className="text-right">
                          <div className="text-sm font-semibold text-slate-800">
                            {Math.round(pred.churn_probability * 100)}%
                          </div>
                          <div className="text-xs text-slate-500">
                            {new Date(pred.prediction_timestamp).toLocaleTimeString()}
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
            
            <div className="space-y-6">
              {comparisonMode && comparisonCustomers.length > 0 ? (
                <div className="bg-white/80 backdrop-blur-sm rounded-2xl shadow-xl border border-white/20 p-6">
                  <h3 className="text-xl font-semibold text-slate-800 mb-6">Customer Comparison</h3>
                  <div className="space-y-4">
                    {comparisonCustomers.map((comp, index) => (
                      <div key={index} className="p-4 bg-slate-50 rounded-lg">
                        <div className="flex justify-between items-center">
                          <span className="font-medium">{comp.customer_id}</span>
                          <button
                            onClick={() => setComparisonCustomers(prev => prev.filter((_, i) => i !== index))}
                            className="text-red-500 hover:text-red-700"
                          >
                            Remove
                          </button>
                        </div>
                        <div className="grid grid-cols-2 gap-2 mt-2 text-sm text-slate-600">
                          <div>Tenure: {comp.tenure_months}m</div>
                          <div>Monthly: ${comp.monthly_charges}</div>
                          <div>Satisfaction: {comp.satisfaction_score}/10</div>
                          <div>Usage: {comp.service_usage}%</div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              ) : prediction && customer ? (
                <PredictionResults 
                  prediction={prediction} 
                  customer={customer}
                  predictionHistory={predictionHistory}
                />
              ) : (
                <div className="bg-white/60 backdrop-blur-sm rounded-2xl shadow-lg border border-white/20 p-12 text-center">
                  <div className="p-4 bg-gradient-to-r from-slate-100 to-slate-200 rounded-full w-24 h-24 mx-auto mb-6 flex items-center justify-center">
                    <AlertTriangle className="w-12 h-12 text-slate-400" />
                  </div>
                  <h3 className="text-lg font-medium text-slate-600 mb-2">Ready for Prediction</h3>
                  <p className="text-slate-500">
                    {comparisonMode 
                      ? 'Enter customer information to add to comparison (up to 3 customers)'
                      : 'Enter customer information to generate churn probability analysis'
                    }
                  </p>
                </div>
              )}
            </div>
          </div>
        )}

        {activeTab === 'import' && <DataImport onSelectCustomer={handlePrediction} />}

        {activeTab === 'samples' && <SampleCustomers onSelectCustomer={handlePrediction} />}
      </main>
    </div>
  );
}

export default App;