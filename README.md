# EpiSight 

It is a system designed to forecast disease outbreak intensity from population mobility patterns and viral growth rates. Given the input features, the system predicts the expected case count and classifies the outbreak risk into **Low**, **Medium**, or **High** categories — helping public health response teams act faster and smarter.

---
## Live Demo

| Service | URL |
|---------|-----|
| Frontend | https://episight-ai-h4z8.onrender.com/ |
| Backend API | https://episight-ai.onrender.com/ |
---

## Features

- **Outbreak Case Prediction** — Predicts disease case count from mobility and growth rate inputs  
- **Multiple ML Models** — Benchmarks Linear Regression, Decision Tree, Random Forest, and Gradient Boosting  
- **Big Data Processing** — Uses Apache PySpark for scalable data preprocessing and model training  
- **REST API** — Flask backend exposes a clean prediction endpoint for frontend consumption  
- **Interactive UI** — Lightweight HTML/CSS/JS frontend for real-time user interaction  
- **Risk Classification** — Automatically labels predicted severity as Low / Medium / High  


---

##  Machine Learning

* Feature Engineering using mobility data
  
| Model | Notes |
|---|---|
| Linear Regression | Baseline |
| Decision Tree | Captures non-linear splits |
| Random Forest | Ensemble, reduces overfitting |
| **Gradient Boosting** | Best performer |

* Evaluation Metrics:
  * RMSE
  * MAE
  * R² Score
   
* Final Model: Gradient Boosting Regressor
---

## Tech Stack

* Python, PySpark (Big Data Processing)
* Scikit-learn (ML Models)
* Flask (Backend API)
* HTML, CSS, JavaScript (Frontend)
* Render (Deployment)

---

## ⚙️ Project Structure

```
Big_Data_Project/
│
├── backend/        # Flask API + trained model
├── frontend/       # UI (HTML, CSS, JS)
├── spark/          # Data preprocessing & model training
├── data/           # Dataset files
```

---

##  How It Works

1. User inputs mobility + growth rate
2. Frontend sends request to Flask API
3. Backend loads trained ML model
4. Model predicts case count
5. Result displayed with risk level

---

## Example Output

* Predicted Cases: 31.2 Million
* Risk Level: HIGH 🔴


---

##  Future Improvements
- Time-series forecasting with LSTM / Transformer models
- Region-wise and country-level predictions
- Interactive map-based visualization dashboards
- Real-time data ingestion from WHO / CDC APIs
- Dockerized deployment for easier self-hosting
- Model explainability with SHAP values
 
