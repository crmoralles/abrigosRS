import pandas as pd


def guard_pd_notnull(dict):
    """Guarda um DataFrame Pandas de valores NaN."""
    result = dict if pd.notna(dict) else None
    
    return result
