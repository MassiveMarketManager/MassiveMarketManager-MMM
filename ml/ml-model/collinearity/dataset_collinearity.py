from __future__ import annotations

import numpy as np
import pandas as pd
from typing import Optional, List, Literal
import matplotlib.pyplot as plt

# Common column names that are often used as labels (to be excluded automatically if needed)
COMMON_LABEL_NAMES = ["label", "labels", "target", "class", "y"]


def _select_numeric(df: pd.DataFrame) -> pd.DataFrame:
    """Helper: select only numeric columns from DataFrame."""
    return df.select_dtypes(include=[np.number])


def compute_collinearity_matrix(
    df: pd.DataFrame,
    method: Literal['pearson', 'spearman', 'kendall', 'pairwise_vif'] = 'pearson',
    absolute: bool = True,
    standardize: bool = False,
    label: Optional[str] = None,
    exclude_columns: Optional[List[str]] = None,
    auto_drop_label_names: bool = True,
) -> pd.DataFrame:
    """
    Compute collinearity matrix for numeric features.

    Parameters:
    - method: correlation type ('pearson', 'spearman', 'kendall', or 'pairwise_vif')
    - absolute: take absolute values of correlations (ignore sign)
    - standardize: standardize features before correlation
    - label: column name for label/target to exclude
    - exclude_columns: additional list of columns to exclude
    - auto_drop_label_names: automatically drop common label names (from COMMON_LABEL_NAMES)

    Returns:
    - DataFrame containing collinearity/correlation values.
    """
    X = _select_numeric(df).copy()

    # Collect list of columns to drop
    to_drop = set()
    if exclude_columns:
        to_drop.update([c for c in exclude_columns if c in X.columns])
    if label and label in X.columns:
        to_drop.add(label)
    if auto_drop_label_names:
        for c in COMMON_LABEL_NAMES:
            if c in X.columns:
                to_drop.add(c)

    # Drop excluded columns
    if to_drop:
        X = X.drop(columns=list(to_drop), errors='ignore')

    # Safety check: ensure there are columns left
    if X.shape[1] == 0:
        raise ValueError("No numeric columns left after exclusions for analysis.")

    # Optionally standardize (z-score normalization)
    if standardize:
        X = (X - X.mean()) / X.std(ddof=0)
        X = X.replace([np.inf, -np.inf], np.nan)

    # Standard correlation methods
    if method in ('pearson', 'spearman', 'kendall'):
        M = X.corr(method=method)
        if absolute:
            M = M.abs()
        return M

    # Variance Inflation Factor (VIF)-like pairwise approximation
    if method == 'pairwise_vif':
        R = X.corr(method='pearson').fillna(0.0)    # correlation matrix
        R2 = (R ** 2).clip(upper=0.999999)          # squared correlations
        V = 1.0 / (1.0 - R2)                        # inflate variance
        np.fill_diagonal(V.values, 1.0)             # diagonal = 1
        if absolute:
            V = V.abs()
        V.columns = R.columns
        V.index = R.index
        return V

    raise ValueError(f"Unknown method: {method}")


def save_collinearity_heatmap(
    M: pd.DataFrame,
    out_path: str,
    title: Optional[str] = None,
    annotate: bool = True,
) -> str:
    """
    Save heatmap visualization of collinearity matrix `M` as an image.

    Parameters:
    - M: DataFrame (collinearity matrix)
    - out_path: file path for saving image
    - title: optional plot title
    - annotate: whether to add numeric values inside cells
    """
    # Scale limits: correlations are in [0..1], VIF may be >= 1
    vmin = float(np.nanmin(M.values))
    vmax = float(np.nanmax(M.values))
    if vmax - vmin < 1e-9:
        vmax = vmin + 1e-9  # avoid division by zero

    # Create heatmap with matplotlib
    fig, ax = plt.subplots(figsize=(8, 6))
    im = ax.imshow(M.values, aspect='auto', vmin=vmin, vmax=vmax)

    # Set axis ticks and labels
    ax.set_xticks(range(M.shape[1]))
    ax.set_yticks(range(M.shape[0]))
    ax.set_xticklabels(M.columns, rotation=45, ha='right')
    ax.set_yticklabels(M.index)
    ax.set_xlabel("Features")
    ax.set_ylabel("Features")
    if title:
        ax.set_title(title)

    # Add colorbar
    cbar = fig.colorbar(im, ax=ax)
    cbar.ax.set_ylabel("Score")

    # Annotate values inside cells (only if not too large matrix)
    if annotate and M.shape[0] <= 50 and M.shape[1] <= 50:
        for (i, j), v in np.ndenumerate(M.values):
            if np.isfinite(v):
                ax.text(j, i, f"{v:.2f}", ha="center", va="center")

    # Save figure
    plt.tight_layout()
    fig.savefig(out_path, dpi=150, bbox_inches="tight")
    plt.close(fig)
    return out_path


if __name__ == "__main__":
    # Example usage
    df = pd.read_csv("./eth_hour_dataset_rsi-ema-atr-obv-fng_arbitrum.csv") 

    # Compute collinearity matrix with Pearson correlation
    M = compute_collinearity_matrix(
        df,
        method='pearson',
        absolute=True,
        standardize=False,
        label='label',                       
        exclude_columns=['ts','datetime_utc'],  # manually excluded columns
        auto_drop_label_names=True           
    )

    # Save heatmap visualization
    save_collinearity_heatmap(
        M, 
        "collinearity(all).png", 
        title="Collinearity (|Pearson|)", 
        annotate=True
    )
