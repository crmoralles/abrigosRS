import pandas as pd


def format_additional_info(label, value):
    """Checa se o valor é NaN, vazio, ou 'nan', e retorna uma string formatada ou None"""
    if pd.notna(value) and value not in ["", "nan"]:
        return f"{label}: {value}"
    return None


def sanitize_additional_info(items):
    """Remove todos os elementos None de uma lista."""
    return [item for item in items if item is not None]
