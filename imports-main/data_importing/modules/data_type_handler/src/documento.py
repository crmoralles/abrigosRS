import pandas as pd


def has_documento(documento):
    """Verifica se o documento tem um valor."""
    if documento is None or pd.isna(documento) or documento == "":
        return False
    return True


def format_documento(documento):
    """Mantem apenas os digitos do documento."""
    if not has_documento(documento):
        return None
    documento = str(documento)
    documento = "".join(filter(str.isdigit, documento))
    return documento


def is_cpf(documento):
    """Verifica se o documento é um CPF."""
    if not has_documento(documento):
        return False
    documento = format_documento(documento)
    if len(documento) != 11:
        return False
    return True
