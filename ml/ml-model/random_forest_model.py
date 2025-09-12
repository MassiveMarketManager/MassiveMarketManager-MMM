import pandas as pd
import numpy as np
import matplotlib.pyplot as plt
import json
from pathlib import Path

from sklearn.model_selection import train_test_split
from sklearn.preprocessing import StandardScaler
from sklearn.ensemble import RandomForestRegressor
from sklearn.metrics import mean_absolute_error, mean_squared_error, mean_absolute_percentage_error, r2_score

from hummingbird.ml import convert as hb_convert

import torch
import torch.nn as nn

# === 1. Load dataset ===
df = pd.read_csv('/eth_data_new_test.csv').dropna().reset_index(drop=True)

# Define features and target variable
features = ['rsi','ema','atr','obv']
X = df[features].values.astype(np.float32)   # feature matrix
y = df['label'].values.astype(np.float32)    # target labels

# === 2. Split and scale ===
# Split into training and test sets (80% train, 20% test)
X_train, X_test, y_train, y_test = train_test_split(X, y, test_size=0.2, random_state=42)

# Apply StandardScaler to normalize features
scaler = StandardScaler()
scaler.fit(X_train)
X_train_scaled = scaler.transform(X_train).astype(np.float32)
X_test_scaled = scaler.transform(X_test).astype(np.float32)

# Save scaler parameters for later use (mean, scale, features)
scaler_params = {
    "mean": scaler.mean_.tolist(),
    "scale": scaler.scale_.tolist(),
    "features": features
}
with open("scaler_params.json", "w") as f:
    json.dump(scaler_params, f, indent=4)
print("✅ StandardScaler parameters saved to scaler_params.json")

# === 3. Define models ===
models = {
    'Random Forest': RandomForestRegressor(n_estimators=150, random_state=42),
}

results = {}
onnx_dir = Path("./onnx_exports")
onnx_dir.mkdir(exist_ok=True)

# === 4. Training + Export ===
for name, model in models.items():
    print(f"🔹 Training {name}...")
    model.fit(X_train_scaled, y_train)      # train model
    y_pred = model.predict(X_test_scaled)   # predict on test set

    # Evaluate metrics
    results[name] = {
        'MAE': mean_absolute_error(y_test, y_pred),                     # Mean Absolute Error
        'RMSE': np.sqrt(mean_squared_error(y_test, y_pred)),            # Root Mean Squared Error
        'MAPE': mean_absolute_percentage_error(y_test, y_pred) * 100,   # Mean Absolute Percentage Error (%)
        'R2': r2_score(y_test, y_pred)                                  # R² score
    }

    # Convert model to ONNX using Hummingbird + torch.onnx.export
    example_np = X_train_scaled[:1]                # example input for conversion
    hb_model = hb_convert(model, backend="pytorch", test_input=example_np)
    torch_model: nn.Module = hb_model.model
    torch_model.eval()

    # Save as ONNX file
    onnx_file = onnx_dir / f"{name.replace(' ', '_')}.onnx"
    dummy_input = torch.from_numpy(example_np)

    torch.onnx.export(
        torch_model,
        dummy_input,
        onnx_file.as_posix(),
        input_names=["input"],
        output_names=["output"],
        dynamic_axes={"input": {0: "batch"}, "output": {0: "batch"}},
        opset_version=17
    )
    print(f"✅ {name} exported to {onnx_file}")

# === Print results ===
print("\n=== Results ===")
for name, metrics in results.items():
    print(f"{name}: {metrics}")

# === 5. Visualization ===
# Compare models across metrics
metrics = ['MAE', 'RMSE', 'MAPE', 'R2']
fig, axes = plt.subplots(1, len(metrics), figsize=(18, 4))
for i, metric in enumerate(metrics):
    scores = [results[m][metric] for m in models.keys()]
    axes[i].bar(models.keys(), scores, color='skyblue')
    axes[i].set_title(metric)
    axes[i].set_xticklabels(models.keys(), rotation=45)
    axes[i].grid(True, linestyle='--', alpha=0.5)
plt.suptitle("Model comparison across metrics", fontsize=14)
plt.tight_layout()
plt.show()

# Scatter plot: real vs predicted values
for name, model in models.items():
    y_pred = model.predict(X_test_scaled)
    plt.figure(figsize=(6, 6))
    plt.scatter(y_test, y_pred, alpha=0.6, edgecolor='k')
    plt.plot([y.min(), y.max()], [y.min(), y.max()], 'r--')  # ideal line
    plt.title(f"{name}: Real vs Predicted (R²={results[name]['R2']:.3f})")
    plt.xlabel("Real price")
    plt.ylabel("Predicted price")
    plt.grid(True, linestyle="--", alpha=0.6)
    plt.tight_layout()
    plt.show()
