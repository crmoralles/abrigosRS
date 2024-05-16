"""
File: abrigo_dict.py

Description:
Este arquivo contém a definição de um dicionário de dados que é utilizado nos notebooks para tratarem somente abrigos conhecidos.
O principal objetivo é combater a complexidade de fazer a busca pelo nome do abrigo na collection de abrigo, devido a falta de padronização dos nomes.
"""

from nome import normalize_nome

__abrigo_dict = {
    "amurtpoprua": ("Osc Amurt Amurtel", "W49ozBm6s1K20YifHjh7"),
    "amurtamurtel": ("Osc Amurt Amurtel", "W49ozBm6s1K20YifHjh7"),
    "apamecor": ("APAMECOR", "h2bl5lSEku6CdOY5az48"),
    "centrovida": ("Vida Centro Humanístico", "xRPpUF0hFBQvEFG8nbqD"),
    "abrigocentrovida": ("Vida Centro Humanístico", "xRPpUF0hFBQvEFG8nbqD"),
    "cesmartimbaúva": ("CESMAR MARIO QUINTANA", "Grklp82ewpCj7nsSnVBV"),
    "ctgrodadochimarrao": ("CTG Roda Chimarrão", "ibkaoQnJExiWJ6CQ8qdc"),
    "emefgrandeoriente": ("Escola Municipal Grande Oriente", "hplLxA4rEVu4sClUfjgb"),
    "grandeoriente": ("Escola Municipal Grande Oriente", "hplLxA4rEVu4sClUfjgb"),
    "escolamunicipalgrandeoriente": ("Escola Municipal Grande Oriente", "hplLxA4rEVu4sClUfjgb"),
    "escolaestadualcustodiomelo": ("Escola Custódio Serraria", "CHIAoCIiqDKHgv9pdLC6"),
    "escolaportonovo": ("Escola Mun. Porto Novo", "zvxpyKtTK28bfq4Iy8lO"),
    "escolarosario": ("Colégio Marista Rosário", "GQNDOGzS8GsQ1RBMRpIC"),
    "ginasiopuc": ("PARQUE ESPORTIVO DA PUCRS", "bZtWf9K62NMTJyzSang4"),
    "pucrs": ("PARQUE ESPORTIVO DA PUCRS", "bZtWf9K62NMTJyzSang4"),
    "ginasioredescalabria": ("CALÁBRIA só moradores de rua", "J8G2GiZuO4mNz4TaekMY"),
    "gnu": ("Grêmio Náutico União Moinhos", "kcJJpudotfBYBp9TArOj"),
    "gremionauticouniaoquintinobocaiuva": ("Grêmio Náutico União Moinhos", "kcJJpudotfBYBp9TArOj"),
    "ipa": ("IPA", "HNc2fsYlULXvGZgf8cCw"),
    "sesc": ("SESC Petropolis", "fFItip1jxroDScyBZxbc"),
    "sogipa": ("SOGIPA", "M3g49YojQrDXnIe25Fk2"),
    "escolaelyseupaglioli": ("Escola Elyseu Paglioli", "ynOyomAF3fwlDlm6PxMx"),
    "elyseu": ("Escola Elyseu Paglioli", "ynOyomAF3fwlDlm6PxMx"),
    "adra": ("ADRA", "253mAOjvltOjTmzASspU"),
    "abrigocetezonasul": ("CETE - Centro Estadual de Treinamento Esportivo", "5pGVgLv79gMi1BKtrNKR"),
    "abrigocetedazonanorte": ("Abrigo Academia da Brigada Militar - Zona Norte", "2mSHHjo54GqZhootMS0N"),
    "academiadabrigadamilitar": ("Abrigo Academia da Brigada Militar - Zona Norte", "2mSHHjo54GqZhootMS0N"),
    "abrigoserraria": ("Abrigo Serraria", "ENkfltEDMtSedBqgg4TB"),
    "abrigojulinho": ("Abrigo Julinho", "XRBPJ6wXAijnBxQI97HJ"),
    "colegiojulinho": ("Abrigo Julinho", "XRBPJ6wXAijnBxQI97HJ"),
    "julinhonova": ("Abrigo Julinho", "XRBPJ6wXAijnBxQI97HJ"),
    "escolaaramysilva": ("Escola Aramy Silva", "e96ijipYxwaOPmcRhQMK"),
    "abrigoctgrecantoviamão": ("Abrigo CTG Recanto - Viamão", "Kj1MquCqVwdYUbRWdJSZ"),
    "abrigo-grupodeescoteiros": ("Abrigo - Grupo de Escoteiros", "jJtkXwRDHyrNJkHHODru"),
    "abrigojoaosalomone1088": ("Abrigo - João Salomone 1088", "tfbHz6TPjWUeamzPMDwf"),
    "abrigoassociacaobairroassuncao": ("Abrigo Associação bairro Assunção", "V9OPFFC8wXRR108wgvmo"),
    "abrigoigrejabatistaebenezi": ("Igreja Batista Ebenézer", "SCSQnP0caMysnbq4HlI5"),
    "abrigoigrejaruaprofguerreirolima476": ("Abrigo Igreja rua Prof guerreiro Lima 476", "toYWpIhxhja50cv6BF4d"),
    "abrigojoaosalomoni": ("Abrigo João Salomoni", "ragL8dyh9EaPsgHsIA96"),
    "abrigomaededeus": ("Abrigo Mãe de Deus", "Gx6TNVZMrWP7T7H2g2PO"),
    "maededeus": ("Abrigo Mãe de Deus", "Gx6TNVZMrWP7T7H2g2PO"),
    "abrigosantosdumont": ("EEEM Santos Dumont", "y3qt1jATZaoNOZeZdpc1"),
    "abrigoViamão": ("Abrigo Viamão", "LUEkY3cCMTJkBPeMAUA4"),
    "prqnossasenhorauxiliadoradebelem": ("Paróquia Nossa Senhora Auxiliadora de Belém", "KEZEt6roGXTgt9y06dl4"),
    "paroquiasaojosevilanova": ("Paroquia São José - Vila Nova", "px6CdAKKR1xW2720V8pv"),
    "semabrigo": ("Sem abrigo", "midyfAnTqVcVuHTZNt2L"),
    "abrigopaglioli": ("Escola Elyseu Paglioli", "ynOyomAF3fwlDlm6PxMx"),
    "abba": ("ABBA", "Ip9PTgXwokPem0gPlhnL"),
    "acolhidosasttibecosouzacosta750": (
        "ASTTI - Associação dos Profissionais em Telecomunicações e Tecnologia da Informação",
        "HC11u23iwTHSdIId6JZp",
    ),
    "caixeirosviajante": ("Caixeiros viajantes", "Rvu67UANpYJnbS7JTvVd"),
    "cete": ("CETE - Centro Estadual de Treinamento Esportivo", "5pGVgLv79gMi1BKtrNKR"),
    "colegiobomconselho": ("Colégio Bom Conselho", "e4bQr2X2GicJrcB3ZV0t"),
    "colegiosantadoroteia": ("Colégio Santa Doroteia", "VBAxH7e9y2k4ZHa6ZXV6"),
    "donaalzira": ("Igreja Brasa Dona Alzira", "72vGVCe9Cc2TYT12uSYc"),
    "igrejabrasaruaalzira": ("Igreja Brasa Dona Alzira", "72vGVCe9Cc2TYT12uSYc"),
    "escolajeronimodealbuquerque": ("EEEF - Escola Estadual de Ensino Fundamental (Escola Pública Estadual)", "NAJ2QkRlGa8pAkviQT7P"),
    "fapa": ("FAPA - UniRitter", "27nXyvWYP3bRaAdXkLWb"),
    "fapauniritter": ("FAPA - UniRitter", "27nXyvWYP3bRaAdXkLWb"),
    "lindoia": ("Lindóia Tênis Clube", "OE6fj7KhqgNFAV8gvxVt"),
    "lindoiatenisclube": ("Lindóia Tênis Clube", "OE6fj7KhqgNFAV8gvxVt"),
    "paroquianossasenhoradefatima": ("Santuário Nossa Senhora do Rosário de Fátima", "p0OutCFR7kqleazFIjxJ"),
    "sescprotasioalves": ("SESC Protásio Alves", "fFItip1jxroDScyBZxbc"),
    "ufrgs": ("UFRGS - Universidade Federal do Rio Grande do Sul", "tF78MLCYpOVmAmlYwknY"),
    "leonardoerick": ("Leonardo Erick", "2QfSOC2LSNlDL02yoqSg"),
    "aabb": ("AABB - Porto Alegre", "csz0QUveh0wzSKLYrK0X"),
    "caju": ("CAJU - Casa Marista Juventude", "7VdcY3UpXmaHhZYmjX30"),
    "casadefamiliaresamigosouhotel": ("Casa de familiares, amigos ou hotel", "AqxHb6qadlGx3T8zuYYM"),
    "situacaoderua": ("Situação de Rua", "YVDx4nCgdj2bB8qTyfa8"),
    "colegioassuncaomarista": ("Colégio Assunção Marista", "bG5q1VI81cN3MIAnSnYI"),
    "centroaltaircantin": ("Centro Altair Cantin", "eJSTHpFvvgOELDIkv4uM"),
    "abrigobomjesusrua1780": ("Abrigo Bom Jesus (rua 17, 80)", "3V6WYJvtSbgh6DbR2jAZ"),
    "abrigomarlene": ("Abrigo Marlene", "Srd4qz3NPnJnzRO2MDoG"),
    "abrigosagradafamilia": ("Abrigo Sagrada Família", "NiVZ046NEVkpg5mmwTkp"),
    "afisvec": ("AFISVEC", "koll2d8gpGSguuIHxzNT"),
    "sesirubenberta": ("SESI - Ruben Berta", "EmLQdd9d22c3dlqCucoL"),
    "igrejacristaemportoalegre": ("Igreja Cristã em Porto Alegre", "QTPc7ZUv2oN0spMyDlzu"),
    "colegiorainhadobrasil": ("Colégio Rainha do Brasil", "KGLDxRZ1WEXiPiRNwYel"),
    "ginasioaliancaesportivabotafogo": ("Ginásio Aliança Esportiva Botafogo", "v7fVOSA72Q4kL0PnIhu4"),
    "deuseamor": ("Deus é Amor", "CLossW7yKFd9zZTP0X9I"),
    "igrejadeuseamorrpadrecornelio33": ("Deus é Amor", "XgXtHZOYBRkTfDozFRP1"),
    "igrejadeuseamorrmanuellobato275": ("Deus é Amor", "jCtcrXUHs5Q2ciU1cexA"),
    "igrejanossasramedianeirarcoronelneves114": ("Igreja Nossa Sra. Medianeira (R Coronel Neves, 114)", "1Z6IstrPmhuWU153p7zg5l9"),
    "igrejaquadrangularrorfanatrofio358": ("Igreja Quadrangular - (R. Orfanatrófio, 358)", "TwP0EAqyvqiRnCb3rnWD"),
    "igrejabetania": ("Igreja Betânia", "oTC3uM8SS7jlur53ShPp"),
    "ctginhandui": ("CTG Inhanduí", "hK0tJKHgEHzs9KIxvraN"),
    "abrigoctginhandui": ("CTG Inhanduí", "hK0tJKHgEHzs9KIxvraN"),
    "ctgfarrapos": ("CTG Farrapos", "n7YcdakDvewWd9KKAiE1"),
    "ginasiodosindicatodosgraficos": ("Ginásio do Sindicato dos Gráficos", "ud4qipmKwf4QJMB29eAL"),
    "alojamentoprefeitura": ("Alojamento Prefeitura", "zVWiXYPowNGg8qVzns2V"),
    "abrigopadreseronrestinga": ("Abrigo Padre Seron - Restinga", "svo58To9HtMkhwswpW1Y"),
    "associacaomissionariasosresgatandovidas": ("Associação Missionária SOS Resgatando Vidas", "htMALAeQnXU5ZjIHCEue"),
    "abrigoprovrainha": ("Abrigo Prov. Rainha", "V6oCwcdyO107bDY4pdbq"),
    "abrigononaoinformadonaimportacao": ("Abrigo não informado na importação", "dX3GP6yWm8efn9QNzJIL"),
    "eeemalcidescunha": ("EEEM Alcides Cunha", "c68NHy5nBhUypq5NrU39"),
    "abrigoenjoy": ("Enjoy Sushi", "3wLvpExZBSxKllCZA4mW"),
    "igrejabatistanacionaldeportoalegrenexus": ("Igreja Batista Nacional de Porto Alegre Nexus", "DxMbPWZOcwXxH24Ql4yB"),
    "emeftancredoneves": ("EMEF Tancredo Neves", "SybemiplgMQxEe0pYT70"),
}


def get_abrigo_info(abrigo_name):
    """
    Retorna o nome e o id do abrigo, dado o nome do abrigo.

    Args:
        abrigo_name (str): Nome do abrigo.

    Returns:
        tuple: Tupla contendo o nome e o id do abrigo.

    Examples:
        >>> get_abrigo_info("amurtamurtel")
        ("Osc Amurt Amurtel", "W49ozBm6s1K20YifHjh7")
    """

    normalized_name = normalize_nome(abrigo_name)

    return __abrigo_dict.get(normalized_name, (None, None))
