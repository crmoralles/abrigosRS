from dataclasses import dataclass, field, asdict
from typing import List, Optional
from datetime import datetime, timezone


@dataclass
class DocumentoLegacyEntity:
    rg: Optional[str] = None
    cpf: Optional[str] = None
    nis: Optional[str] = None
    titulo_eleitor: Optional[str] = None
    outros_documentos: Optional[str] = None

    def to_dict(self):
        return asdict(self)


@dataclass
class MembroFamiliarLegacyEntity:
    nome: Optional[str] = None
    grau_parentesco: Optional[str] = None
    data_nascimento: Optional[str] = None
    idade: Optional[int] = None
    documentos: List[str] = field(default_factory=list)
    additional_info: List[str] = field(default_factory=list)

    def to_dict(self):
        return asdict(self)


@dataclass
class ResponsavelLegacyEntity:
    nome: Optional[str] = None
    nome_mae: Optional[str] = None
    data_nascimento: Optional[str] = None
    idade: Optional[int] = None
    documentos: Optional[DocumentoLegacyEntity] = None
    additional_info: List[str] = field(default_factory=list)

    def to_dict(self):
        return asdict(self)


@dataclass
class AbrigadoLegacyEntity:
    abrigoId: str
    abrigoNome: str
    nome: str
    search_field_name: str
    created_in: datetime = field(default_factory=lambda: datetime.now(timezone.utc))
    update_in: datetime = field(default_factory=lambda: datetime.now(timezone.utc))
    grupoFamiliar: List[MembroFamiliarLegacyEntity] = field(default_factory=list)
    endereco: Optional[str] = None
    temHabitacao: Optional[bool] = None
    temRenda: Optional[bool] = None
    renda: Optional[float] = None
    situacaoMoradia: Optional[str] = None
    temDocumento: Optional[bool] = None
    necessidadesImediatas: Optional[str] = None
    cadastradoCadUnico: Optional[bool] = None
    dataNascimento: Optional[str] = None
    acompanhadoMenor: Optional[bool] = None
    id: Optional[str] = None
    documentos: List[str] = field(default_factory=list)
    additional_info: List[str] = field(default_factory=list)
    responsavel: Optional[ResponsavelLegacyEntity] = None

    def set_id(self, new_id: str):
        self.id = new_id

    def to_dict(self):
        return asdict(self)
