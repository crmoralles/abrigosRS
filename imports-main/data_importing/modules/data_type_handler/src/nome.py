import re
import pandas as pd


def format_nome_completo(nome, sobrenome):
    """Checa se o primeiro nome e o último nome são NaN, vazios, ou 'nan', e retorna somente a propriedade que tiver valor."""
    # Remove espaços extras e verifica se 'nome' é válido
    if pd.notna(nome):
        nome = nome.strip()
        if nome not in ["", "nan"]:
            # Remove espaços extras e verifica se 'sobrenome' é válido
            if pd.notna(sobrenome):
                sobrenome = sobrenome.strip()
                if sobrenome not in ["", "nan"]:
                    return f"{nome} {sobrenome}"
            return nome

    # Remove espaços extras e verifica se 'sobrenome' é válido
    if pd.notna(sobrenome):
        sobrenome = sobrenome.strip()
        if sobrenome not in ["", "nan"]:
            return sobrenome

    return None


def normalize_nome(nome: str) -> str:
    if nome is None:
        return None

    nome = re.split(r"\s+\d+|\s+CPF| - ", nome, 1)[0]
    nome = re.sub(r"[áàãâä]", "a", nome, flags=re.I)
    nome = re.sub(r"[éèêë]", "e", nome, flags=re.I)
    nome = re.sub(r"[íìîï]", "i", nome, flags=re.I)
    nome = re.sub(r"[óòõôö]", "o", nome, flags=re.I)
    nome = re.sub(r"[úùûü]", "u", nome, flags=re.I)
    nome = re.sub(r"[ç]", "c", nome, flags=re.I)
    nome = re.sub(r"[ñ]", "n", nome, flags=re.I)
    nome = re.sub(r"[^\w\s]", "", nome, flags=re.I)
    nome = nome.lower()
    nome = re.sub(r"\s+", "", nome)

    return nome
