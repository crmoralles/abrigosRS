import re
from dataclasses import dataclass, field
from typing import Optional


@dataclass
class Cpf:
    value: Optional[str] = field(default=None)
    is_valid: Optional[bool] = field(default=None, init=False)

    def __post_init__(self):
        original_value = self.value
        self.value = self.__extract_cpf(original_value)
        self.is_valid = self.__validate_cpf(self.value) if self.value else False

    def __extract_cpf(self, value: Optional[str]) -> Optional[str]:
        """Tenta extrai o CPF de uma string e retorna como string de 11 dígitos."""
        if self.value is None:
            return None

        # Define a constant for the regular expression pattern
        CLEAN_PATTERN = r"[^\d]"

        # Tentativa com a regex restritiva
        match = re.search(r"(?:CPF)?\s?(\d{3}\.\d{3}\.\d{3}-\d{2}|\d{11})", self.value)
        if match:
            return re.sub(CLEAN_PATTERN, "", match.group(1))

        # Tentativa com a regex flexível se a restritiva falhar
        match = re.search(r"(?:CPF)?[^\d]?([\(\[\{]?(\d{3}[\.\-\s,]?){3}\d{2}[\)\]\}]?)", self.value)
        if match:
            return re.sub(CLEAN_PATTERN, "", match.group(1))

        # Tentativa de tratar uma sequencia de números
        match = re.search(r"(?:CPF)?\s*([\d\s]{11,14})", self.value)
        if match:
            return re.sub(CLEAN_PATTERN, "", match.group(1))

        # Retorna o valor original recebido
        return self.value

    def __validate_cpf(self, value: Optional[str]) -> bool:
        """Valida um CPF e retorna True se for válido."""
        if not value or len(value) != 11 or value == value[0] * 11:
            return False

        # Validação de dígitos verificadores
        def calc_digit(digits: str, factors: range) -> int:
            total = sum(int(digit) * factor for digit, factor in zip(digits, factors))
            digit = 11 - total % 11
            return digit if digit < 10 else 0

        if int(value[9]) != calc_digit(value[:9], range(10, 1, -1)):
            return False
        return int(value[10]) == calc_digit(value[:10], range(11, 1, -1))

    def __str__(self) -> str:
        return self.value
