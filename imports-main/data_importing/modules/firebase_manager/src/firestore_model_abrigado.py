from dataclasses import dataclass, field, asdict
from typing import List, Optional
from datetime import datetime, timezone
from dataclasses import dataclass, field
from typing import Optional, List
import pandas as pd


@dataclass
class DocumentosEntity:
    rg: Optional[str] = None
    cpf: Optional[str] = None
    nis: Optional[str] = None
    titulo_eleitor: Optional[str] = None
    outros_documentos: Optional[str] = None


@dataclass
class MembroFamiliarEntity:
    nome: Optional[str] = None
    data_nascimento: Optional[datetime] = None
    idade: Optional[int] = None
    parentesco: Optional[str] = None
    documentos: Optional[DocumentosEntity] = None


@dataclass
class InformacaoAdicionalEntity:
    chave: Optional[str] = None
    valor: Optional[str] = None


@dataclass
class AbrigadoEntity:
    abrigo_id: str
    abrigo_nome: str
    abrigado_nome: str
    search_field_name: str
    created_in: datetime = field(default_factory=lambda: datetime.now(timezone.utc))
    update_in: datetime = field(default_factory=lambda: datetime.now(timezone.utc))
    abrigo_data_entrada: Optional[datetime] = None
    abrigo_data_saida: Optional[datetime] = None
    abrigado_nome_mae: Optional[str] = None
    abrigado_data_nascimento: Optional[datetime] = None
    abrigado_idade: Optional[int] = None
    abrigado_telefone: Optional[str] = None
    abrigado_endereco: Optional[str] = None
    abrigado_bairro: Optional[str] = None
    abrigado_cidade: Optional[str] = None
    abrigado_beneficio_possui: Optional[bool] = None
    abrigado_beneficio_nome: Optional[str] = None
    abrigado_beneficio_valor: Optional[float] = None
    abrigado_saude_condicao: Optional[str] = None
    abrigado_saude_medicamentos: Optional[str] = None
    documentos: Optional[DocumentosEntity] = None
    familiares: Optional[List[MembroFamiliarEntity]] = None
    adicional_redes_de_apoio_informacoes: Optional[str] = None
    adicional_pet_quantidade: Optional[int] = None
    adicional_pet_descricao: Optional[str] = None
    adicional_informacoes: Optional[List[InformacaoAdicionalEntity]] = None
    id: Optional[str] = None

    def set_id(self, id):
        self.id = id

    def to_dict(self):
        return asdict(self)
