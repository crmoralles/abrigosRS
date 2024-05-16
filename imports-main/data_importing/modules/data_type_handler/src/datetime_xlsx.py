import pandas as pd


# Sanitiza os dados de colunas de datas, principalmente nulas ou NaN
def format_xlsx_datetime(df, column_names):
    min_valid_date = pd.Timestamp("1900-01-01")
    for column in column_names:
        df[column] = pd.to_datetime(df[column], errors="coerce")
        df[column] = df[column].where(df[column] > min_valid_date, pd.NaT)

        if df[column].dtype == "datetime64[ns]":
            df[column] = df[column].dt.strftime("%Y-%m-%d %H:%M:%S")
