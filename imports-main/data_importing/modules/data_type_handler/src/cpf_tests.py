import unittest

from cpf import Cpf


class CpfTests(unittest.TestCase):
    """Testes para a função extract_cpf"""

    # Define casos de teste para a função extract_cpf
    test_cases_regex = [
        "191.000.000-00",
        "1910000000 0",
        "191-000-000-00",
        "191 000 000 00",
        "191,000,000-00",
        "JOAO DA SILVA - 191.000.000-00 nasceu em...",
        "Identidade: 19100000000, emitida em...",
        "CPF191.000.000-00próximo",
        "identidade191.000.000-00",
        "CPF: 191.000.000-00,",
        "CPF-191.000.000-00",
        "CPF : 191.000.000-00",
        "CPF (191.000.000-00)",
        "CPF [191.000.000-00]",
        "CPF 191,000,000-00",
        "CPF 191.000000-00",
    ]

    # Define casos de teste inválidos
    test_cases_invalid = [
        "05771777078",
        "92723223097",
        "95689289049",
        "22389466032",
        "21506824098",
    ]

    # Define casos de teste válidos
    test_cases_valid = [
        "99816967065",
        "75318551009",
        "42883489009",
        "09035148002",
        "27998333065",
        "16685822015",
        "73371404013",
    ]

    def test_cpf_extractor(self):
        """Test if the function can extract the CPF from the string"""
        print("Test: function should extract the CPF from the string")
        for test_case in self.test_cases_regex:
            with self.subTest(test_case=test_case):
                result = Cpf(test_case)
                self.assertIsNotNone(result, f"CPF '{test_case}' should not be None")
                self.assertIsNotNone(result.value, f"CPF value '{test_case}' should not be None")
                self.assertNotEqual(result.value, test_case, f"CPF value '{test_case}' should not be equal to '{result.value}'")

    def test_invalid_cpfs(self):
        """Test if the function can match the invalid CPFs"""
        print("Test: Function should match invalid CPFs and return received value")
        for test_case in self.test_cases_invalid:
            with self.subTest(test_case=test_case):
                result = Cpf(test_case)
                self.assertFalse(result.is_valid, f"CPF '{test_case}' should be invalid")
                self.assertIsNotNone(result.value, f"CPF '{test_case}' should not be None")

    def test_valid_cpfs(self):
        """Test if the function can match the valid CPFs"""
        print("Test: function should match the valid CPFs")
        for test_case in self.test_cases_valid:
            with self.subTest(test_case=test_case):
                result = Cpf(test_case)
                self.assertTrue(result.is_valid, f"CPF '{test_case}' should be valid")
                self.assertEqual(result.value, test_case, f"CPF '{test_case}' should be equal to '{result.value}'")
                self.assertIsNotNone(result.value, f"CPF '{test_case}' should not be None")


if __name__ == "__main__":
    unittest.main()
