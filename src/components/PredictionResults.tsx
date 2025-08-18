import React from 'react';
import { Customer, PredictionResult } from '../App';
import { AlertTriangle, CheckCircle, AlertCircle, TrendingUp, Lightbulb, User } from 'lucide-react';

interface PredictionResultsProps {
  prediction: PredictionResult;
  customer: Customer;
  predictionHistory?: PredictionResult[];
}

export function PredictionResults({ prediction, customer, predictionHistory = [] }: PredictionResultsProps) {
  const getRiskColor = (level: string) => {
    switch (level) {
      case 'HIGH': return 'from-red-500 to-rose-600';
      case 'MEDIUM': return 'from-yellow-500 to-orange-600';
      case 'LOW': return 'from-green-500 to-emerald-600';
      default: return 'from-slate-500 to-slate-600';
    }
  };

  const getRiskIcon = (level: string) => {
    switch (level) {
      case 'HIGH': return <AlertTriangle className="w-6 h-6" />;
      case 'MEDIUM': return <AlertCircle className="w-6 h-6" />;
      case 'LOW': return <CheckCircle className="w-6 h-6" />;
      default: return <AlertTriangle className="w-6 h-6" />;
    }
  };

  const probability = Math.round(prediction.churn_probability * 100);
  const confidence = Math.round(prediction.confidence_score * 100);

  return (
    <div className="space-y-6">
      {/* Main Prediction Card */}
      <div className="bg-white/80 backdrop-blur-sm rounded-2xl shadow-xl border border-white/20 p-6">
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center space-x-3">
            <div className={`p-2 bg-gradient-to-r ${getRiskColor(prediction.risk_level)} rounded-lg text-white`}>
              {getRiskIcon(prediction.risk_level)}
            </div>
            <div>
              <h3 className="text-xl font-semibold text-slate-800">Churn Prediction</h3>
              <p className="text-slate-600">{customer.customer_id}</p>
            </div>
          </div>
          <div className="text-right">
            <div className="text-3xl font-bold text-slate-800">{probability}%</div>
            <div className={`text-sm font-medium ${
              prediction.risk_level === 'HIGH' ? 'text-red-600' :
              prediction.risk_level === 'MEDIUM' ? 'text-yellow-600' :
              'text-green-600'
            }`}>
              {prediction.risk_level} RISK
            </div>
            <div className="text-xs text-slate-500 mt-1">
              {confidence}% confidence
            </div>
          </div>
        </div>

        {/* Probability Bar */}
        <div className="relative">
          <div className="w-full bg-slate-200 rounded-full h-3">
            <div 
              className={`h-3 rounded-full bg-gradient-to-r ${getRiskColor(prediction.risk_level)} transition-all duration-1000 ease-out`}
              style={{ width: `${probability}%` }}
            ></div>
          </div>
          <div className="flex justify-between text-xs text-slate-500 mt-1">
            <span>0%</span>
            <span>Low Risk</span>
            <span>Medium Risk</span>
            <span>High Risk</span>
            <span>100%</span>
          </div>
        </div>
      </div>

      {/* Model Insights */}
      <div className="bg-white/80 backdrop-blur-sm rounded-2xl shadow-xl border border-white/20 p-6">
        <div className="flex items-center space-x-3 mb-4">
          <div className="p-2 bg-gradient-to-r from-indigo-500 to-purple-600 rounded-lg">
            <TrendingUp className="w-5 h-5 text-white" />
          </div>
          <h4 className="text-lg font-semibold text-slate-800">Model Insights</h4>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Feature Importance */}
          <div>
            <h5 className="text-sm font-semibold text-slate-700 mb-3">Feature Importance</h5>
            <div className="space-y-2">
              {Object.entries(prediction.feature_importance)
                .sort(([,a], [,b]) => b - a)
                .map(([feature, importance]) => (
                <div key={feature} className="flex items-center justify-between">
                  <span className="text-sm text-slate-600 capitalize">
                    {feature.replace('_', ' ')}
                  </span>
                  <div className="flex items-center space-x-2">
                    <div className="w-16 h-2 bg-slate-200 rounded-full overflow-hidden">
                      <div 
                        className="h-full bg-gradient-to-r from-blue-500 to-indigo-600 rounded-full"
                        style={{ width: `${importance * 100}%` }}
                      ></div>
                    </div>
                    <span className="text-xs text-slate-500 w-8">
                      {Math.round(importance * 100)}%
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>
          
          {/* Model Info */}
          <div>
            <h5 className="text-sm font-semibold text-slate-700 mb-3">Model Information</h5>
            <div className="space-y-2 text-sm">
              <div className="flex justify-between">
                <span className="text-slate-500">Model Version:</span>
                <span className="font-medium">{prediction.model_version}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-500">Confidence Score:</span>
                <span className="font-medium">{confidence}%</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-500">Prediction Time:</span>
                <span className="font-medium">
                  {new Date(prediction.prediction_timestamp).toLocaleTimeString()}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-500">Processing Time:</span>
                <span className="font-medium">1.2s</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Customer Summary */}
      <div className="bg-white/80 backdrop-blur-sm rounded-2xl shadow-xl border border-white/20 p-6">
        <div className="flex items-center space-x-3 mb-4">
          <div className="p-2 bg-gradient-to-r from-blue-500 to-indigo-600 rounded-lg">
            <User className="w-5 h-5 text-white" />
          </div>
          <h4 className="text-lg font-semibold text-slate-800">Customer Profile</h4>
        </div>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
          <div>
            <span className="text-slate-500">Tenure:</span>
            <span className="ml-2 font-medium">{customer.tenure_months} months</span>
          </div>
          <div>
            <span className="text-slate-500">Monthly:</span>
            <span className="ml-2 font-medium">${customer.monthly_charges}</span>
          </div>
          <div>
            <span className="text-slate-500">Total:</span>
            <span className="ml-2 font-medium">${customer.total_charges}</span>
          </div>
          <div>
            <span className="text-slate-500">Satisfaction:</span>
            <span className="ml-2 font-medium">{customer.satisfaction_score}/10</span>
          </div>
          <div>
            <span className="text-slate-500">Contract:</span>
            <span className="ml-2 font-medium capitalize">{customer.contract_type.replace('_', ' ')}</span>
          </div>
          <div>
            <span className="text-slate-500">Payment:</span>
            <span className="ml-2 font-medium capitalize">{customer.payment_method.replace('_', ' ')}</span>
          </div>
          <div>
            <span className="text-slate-500">Support Tickets:</span>
            <span className="ml-2 font-medium">{customer.support_tickets}</span>
          </div>
          <div>
            <span className="text-slate-500">Usage:</span>
            <span className="ml-2 font-medium">{customer.service_usage}%</span>
          </div>
        </div>
      </div>

      {/* Risk Factors */}
      {prediction.risk_factors.length > 0 && (
        <div className="bg-white/80 backdrop-blur-sm rounded-2xl shadow-xl border border-white/20 p-6">
          <div className="flex items-center space-x-3 mb-4">
            <div className="p-2 bg-gradient-to-r from-red-500 to-rose-600 rounded-lg">
              <AlertTriangle className="w-5 h-5 text-white" />
            </div>
            <h4 className="text-lg font-semibold text-slate-800">Risk Factors</h4>
          </div>
          <div className="space-y-2">
            {prediction.risk_factors.map((factor, index) => (
              <div key={index} className="flex items-center space-x-3 p-3 bg-red-50 rounded-lg border border-red-100">
                <div className="w-2 h-2 bg-red-500 rounded-full flex-shrink-0"></div>
                <span className="text-red-800 text-sm">{factor}</span>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Recommendations */}
      <div className="bg-white/80 backdrop-blur-sm rounded-2xl shadow-xl border border-white/20 p-6">
        <div className="flex items-center space-x-3 mb-4">
          <div className="p-2 bg-gradient-to-r from-green-500 to-emerald-600 rounded-lg">
            <Lightbulb className="w-5 h-5 text-white" />
          </div>
          <h4 className="text-lg font-semibold text-slate-800">Recommendations</h4>
        </div>
        <div className="space-y-3">
          {prediction.recommendations.map((recommendation, index) => (
            <div key={index} className="flex items-start space-x-3 p-4 bg-green-50 rounded-lg border border-green-100">
              <div className="w-6 h-6 bg-green-500 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                <span className="text-white text-xs font-bold">{index + 1}</span>
              </div>
              <span className="text-green-800 text-sm leading-relaxed">{recommendation}</span>
            </div>
          ))}
        </div>
      </div>

      {/* Action Buttons */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <button className="flex-1 px-6 py-3 bg-gradient-to-r from-blue-500 to-indigo-600 text-white rounded-xl font-medium hover:from-blue-600 hover:to-indigo-700 transition-all duration-200 shadow-lg hover:shadow-xl">
          Save Report
        </button>
        <button className="flex-1 px-6 py-3 bg-white/80 text-slate-700 rounded-xl font-medium border border-slate-200 hover:bg-white hover:shadow-lg transition-all duration-200">
          Export Data
        </button>
        <button className="flex-1 px-6 py-3 bg-gradient-to-r from-green-500 to-emerald-600 text-white rounded-xl font-medium hover:from-green-600 hover:to-emerald-700 transition-all duration-200 shadow-lg hover:shadow-xl">
          Schedule Follow-up
        </button>
        <button className="flex-1 px-6 py-3 bg-gradient-to-r from-purple-500 to-pink-600 text-white rounded-xl font-medium hover:from-purple-600 hover:to-pink-700 transition-all duration-200 shadow-lg hover:shadow-xl">
          Share Results
        </button>
      </div>
    </div>
  );
}