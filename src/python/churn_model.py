#!/usr/bin/env python3
"""
Customer Churn Prediction Model (Demo Version)
Note: This is a simplified demonstration using only Python standard library.
In production, you would use libraries like scikit-learn, pandas, numpy, etc.
"""

import json
import random
import math
from typing import Dict, List, Tuple, Any

class CustomerChurnPredictor:
    def __init__(self):
        # Mock model weights (in real implementation, these would be learned from data)
        self.feature_weights = {
            'tenure_months': -0.02,          # Longer tenure = lower churn risk
            'monthly_charges': 0.01,         # Higher charges = higher churn risk
            'total_charges': -0.001,         # Higher total = lower churn risk (loyalty)
            'contract_length': -0.3,         # Longer contract = lower churn risk
            'support_tickets': 0.15,         # More tickets = higher churn risk
            'payment_method_score': -0.1,    # Better payment method = lower churn
            'service_usage': -0.05,          # Higher usage = lower churn risk
            'satisfaction_score': -0.4       # Higher satisfaction = lower churn
        }
        self.bias = 0.1
        
    def preprocess_customer_data(self, customer_data: Dict[str, Any]) -> Dict[str, float]:
        """Convert raw customer data to numerical features"""
        features = {}
        
        # Direct numerical features
        features['tenure_months'] = float(customer_data.get('tenure_months', 12))
        features['monthly_charges'] = float(customer_data.get('monthly_charges', 50))
        features['total_charges'] = float(customer_data.get('total_charges', 600))
        features['support_tickets'] = float(customer_data.get('support_tickets', 0))
        features['service_usage'] = float(customer_data.get('service_usage', 50))
        features['satisfaction_score'] = float(customer_data.get('satisfaction_score', 7))
        
        # Contract length encoding
        contract = customer_data.get('contract_type', 'monthly').lower()
        if 'yearly' in contract or '12' in contract:
            features['contract_length'] = 12
        elif 'two' in contract or '24' in contract:
            features['contract_length'] = 24
        else:
            features['contract_length'] = 1
            
        # Payment method scoring
        payment_method = customer_data.get('payment_method', 'credit_card').lower()
        payment_scores = {
            'bank_transfer': 3,
            'credit_card': 2,
            'debit_card': 1,
            'cash': 0
        }
        features['payment_method_score'] = payment_scores.get(payment_method, 1)
        
        return features
    
    def sigmoid(self, x: float) -> float:
        """Sigmoid activation function"""
        try:
            return 1 / (1 + math.exp(-x))
        except OverflowError:
            return 0 if x < 0 else 1
    
    def predict_churn_probability(self, customer_data: Dict[str, Any]) -> Tuple[float, Dict[str, Any]]:
        """Predict churn probability for a customer"""
        features = self.preprocess_customer_data(customer_data)
        
        # Calculate linear combination
        linear_combination = self.bias
        for feature, value in features.items():
            if feature in self.feature_weights:
                linear_combination += self.feature_weights[feature] * value
        
        # Apply sigmoid to get probability
        churn_probability = self.sigmoid(linear_combination)
        
        # Generate risk factors and recommendations
        risk_factors = self._identify_risk_factors(features)
        recommendations = self._generate_recommendations(features, risk_factors)
        
        return churn_probability, {
            'features': features,
            'risk_factors': risk_factors,
            'recommendations': recommendations,
            'risk_level': self._get_risk_level(churn_probability)
        }
    
    def _identify_risk_factors(self, features: Dict[str, float]) -> List[str]:
        """Identify key risk factors for this customer"""
        risk_factors = []
        
        if features['tenure_months'] < 6:
            risk_factors.append("New customer (high churn risk)")
        if features['monthly_charges'] > 80:
            risk_factors.append("High monthly charges")
        if features['support_tickets'] > 3:
            risk_factors.append("Multiple support issues")
        if features['contract_length'] == 1:
            risk_factors.append("Month-to-month contract")
        if features['satisfaction_score'] < 6:
            risk_factors.append("Low satisfaction score")
        if features['service_usage'] < 20:
            risk_factors.append("Low service engagement")
            
        return risk_factors
    
    def _generate_recommendations(self, features: Dict[str, float], risk_factors: List[str]) -> List[str]:
        """Generate recommendations to reduce churn risk"""
        recommendations = []
        
        if "New customer" in str(risk_factors):
            recommendations.append("Implement onboarding program and early engagement")
        if "High monthly charges" in str(risk_factors):
            recommendations.append("Offer loyalty discount or plan optimization")
        if "Multiple support issues" in str(risk_factors):
            recommendations.append("Proactive customer success outreach")
        if "Month-to-month contract" in str(risk_factors):
            recommendations.append("Offer annual contract incentives")
        if "Low satisfaction" in str(risk_factors):
            recommendations.append("Schedule satisfaction survey and follow-up")
        if "Low service engagement" in str(risk_factors):
            recommendations.append("Provide usage tips and feature education")
            
        if not recommendations:
            recommendations.append("Continue monitoring and maintain current service level")
            
        return recommendations
    
    def _get_risk_level(self, probability: float) -> str:
        """Convert probability to risk level"""
        if probability > 0.7:
            return "HIGH"
        elif probability > 0.4:
            return "MEDIUM"
        else:
            return "LOW"

def generate_sample_customers(n: int = 5) -> List[Dict[str, Any]]:
    """Generate sample customer data for testing"""
    customers = []
    
    for i in range(n):
        customer = {
            'customer_id': f'CUST_{i+1:03d}',
            'tenure_months': random.randint(1, 60),
            'monthly_charges': round(random.uniform(20, 120), 2),
            'total_charges': round(random.uniform(100, 5000), 2),
            'contract_type': random.choice(['monthly', 'yearly', 'two_year']),
            'support_tickets': random.randint(0, 8),
            'payment_method': random.choice(['credit_card', 'debit_card', 'bank_transfer', 'cash']),
            'service_usage': round(random.uniform(0, 100), 1),
            'satisfaction_score': round(random.uniform(1, 10), 1)
        }
        customers.append(customer)
    
    return customers

def main():
    """Main function to demonstrate the churn prediction model"""
    print("Customer Churn Prediction Model Demo")
    print("=" * 50)
    
    # Initialize the model
    predictor = CustomerChurnPredictor()
    
    # Generate sample customers
    sample_customers = generate_sample_customers(5)
    
    # Predict churn for each customer
    results = []
    for customer in sample_customers:
        probability, analysis = predictor.predict_churn_probability(customer)
        
        result = {
            'customer_id': customer['customer_id'],
            'churn_probability': round(probability, 3),
            'risk_level': analysis['risk_level'],
            'risk_factors': analysis['risk_factors'],
            'recommendations': analysis['recommendations']
        }
        results.append(result)
        
        print(f"\nCustomer: {customer['customer_id']}")
        print(f"Churn Probability: {probability:.1%}")
        print(f"Risk Level: {analysis['risk_level']}")
        print(f"Key Risk Factors: {', '.join(analysis['risk_factors']) if analysis['risk_factors'] else 'None identified'}")
        print(f"Recommendations: {analysis['recommendations'][0] if analysis['recommendations'] else 'None'}")
    
    # Save results to JSON for the web interface
    with open('churn_predictions.json', 'w') as f:
        json.dump({
            'customers': sample_customers,
            'predictions': results,
            'model_info': {
                'features_used': list(predictor.feature_weights.keys()),
                'model_type': 'Logistic Regression (Simplified)',
                'note': 'This is a demonstration model. Production models would use real ML libraries.'
            }
        }, f, indent=2)
    
    print(f"\nResults saved to churn_predictions.json")
    print("Model demonstration complete!")

if __name__ == "__main__":
    main()