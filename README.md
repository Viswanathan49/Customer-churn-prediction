# Customer Churn Prediction Model Demo

A modern, interactive web application for predicting customer churn using AI-powered analytics. Built with React, TypeScript, and Tailwind CSS.

## 🚀 Live Demo

[View Live Application](https://vishwa-customer-churn-prediction.netlify.app)

## ✨ Features

### 🎯 Single Prediction
- **Manual Customer Input**: Comprehensive form with real-time validation
- **Comparison Mode**: Compare up to 3 customers side-by-side
- **Advanced Metrics**: Optional detailed customer analytics
- **Random Data Generation**: Quick test data population
- **Real-time Validation**: Instant feedback on input errors

### 📊 Data Import
- **Multi-format Support**: CSV, JSON, and XML file parsing
- **Drag & Drop Interface**: Intuitive file upload experience
- **Sample Downloads**: Template files for each supported format
- **Data Validation**: Automatic error detection and correction
- **Batch Processing**: Handle multiple customer records

### 🧪 Sample Data
- **Pre-configured Profiles**: Test customers with varying risk levels
- **Risk Indicators**: Visual risk assessment for each sample
- **Quick Analysis**: One-click prediction for sample customers
- **Random Generation**: Create new test customers instantly

### 📈 Advanced Analytics
- **Churn Probability**: Percentage-based risk assessment
- **Confidence Scoring**: Model certainty indicators (70-95%)
- **Feature Importance**: Visual representation of key factors
- **Risk Categorization**: HIGH, MEDIUM, LOW risk levels
- **Actionable Recommendations**: Personalized retention strategies

## 🛠️ Technology Stack

- **Frontend**: React 18 with TypeScript
- **Styling**: Tailwind CSS with custom gradients
- **Icons**: Lucide React
- **Build Tool**: Vite
- **Deployment**: Netlify

## 🏗️ Project Structure

```
src/
├── components/
│   ├── CustomerForm.tsx      # Enhanced customer input form
│   ├── DataImport.tsx        # File import functionality
│   ├── PredictionResults.tsx # Results display and analytics
│   ├── SampleCustomers.tsx   # Pre-configured test data
│   └── ChurnPredictor.tsx    # Core prediction logic
├── python/
│   └── churn_model.py        # Python ML model (demo)
├── App.tsx                   # Main application component
├── main.tsx                  # Application entry point
└── index.css                 # Global styles
```

## 🚀 Getting Started

### Prerequisites
- Node.js 16+ 
- npm or yarn

### Installation

1. **Clone the repository**
   ```bash
   git clone https://github.com/yourusername/customer-churn-prediction.git
   cd customer-churn-prediction
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Start development server**
   ```bash
   npm run dev
   ```

4. **Open your browser**
   Navigate to `http://localhost:5173`

### Build for Production

```bash
npm run build
```

## 📝 Usage

### Single Prediction
1. Navigate to the "Single Prediction" tab
2. Fill in customer information or use "Random Data"
3. Toggle "Comparison Mode" to compare multiple customers
4. Click "Predict Churn Risk" to get analysis

### Data Import
1. Go to "Import Data" tab
2. Select file format (CSV, JSON, XML)
3. Download sample templates if needed
4. Drag & drop or select your data file
5. Review imported data and click "Analyze" for any customer

### Sample Data
1. Visit "Sample Data" tab
2. Browse pre-configured customer profiles
3. Click "Analyze Customer" for instant predictions
4. Use "Random Customer" for new test data

## 🎨 Features in Detail

### Prediction Algorithm
The demo uses a simplified logistic regression model that considers:
- **Tenure**: Customer relationship length
- **Charges**: Monthly and total billing amounts
- **Support**: Number of support tickets
- **Contract**: Contract type and payment method
- **Satisfaction**: Customer satisfaction scores
- **Usage**: Service utilization metrics

### Risk Factors Identified
- New customers (< 6 months tenure)
- High monthly charges (> $80)
- Multiple support issues (> 3 tickets)
- Month-to-month contracts
- Low satisfaction scores (< 6/10)
- Low service engagement (< 20% usage)

### Recommendations Engine
Provides actionable insights such as:
- Onboarding programs for new customers
- Loyalty discounts for high-value customers
- Proactive customer success outreach
- Contract upgrade incentives
- Satisfaction improvement initiatives

## 🔧 Configuration

### Environment Variables
No environment variables required for the demo version.

### Customization
- Modify `src/App.tsx` for main application logic
- Update `src/components/` for UI components
- Adjust `tailwind.config.js` for styling changes
- Edit `src/python/churn_model.py` for ML model logic

## 📊 Data Formats

### CSV Format
```csv
customer_id,tenure_months,monthly_charges,total_charges,contract_type,support_tickets,payment_method,service_usage,satisfaction_score
CUST_001,12,65.50,786.00,yearly,2,credit_card,75.5,8.2
```

### JSON Format
```json
[
  {
    "customer_id": "CUST_001",
    "tenure_months": 12,
    "monthly_charges": 65.50,
    "total_charges": 786.00,
    "contract_type": "yearly",
    "support_tickets": 2,
    "payment_method": "credit_card",
    "service_usage": 75.5,
    "satisfaction_score": 8.2
  }
]
```

### XML Format
```xml
<?xml version="1.0" encoding="UTF-8"?>
<customers>
  <customer>
    <customer_id>CUST_001</customer_id>
    <tenure_months>12</tenure_months>
    <monthly_charges>65.50</monthly_charges>
    <total_charges>786.00</total_charges>
    <contract_type>yearly</contract_type>
    <support_tickets>2</support_tickets>
    <payment_method>credit_card</payment_method>
    <service_usage>75.5</service_usage>
    <satisfaction_score>8.2</satisfaction_score>
  </customer>
</customers>
```

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🙏 Acknowledgments

- Built with [React](https://reactjs.org/)
- Styled with [Tailwind CSS](https://tailwindcss.com/)
- Icons by [Lucide](https://lucide.dev/)
- Deployed on [Netlify](https://netlify.com/)

## 📞 Support

For support, email your-email@example.com or create an issue in this repository.

---

**Note**: This is a demonstration application. In production, you would integrate with real machine learning models and customer databases.