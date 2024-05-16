from dataclasses import asdict, dataclass, field
from datetime import datetime, timezone
from typing import List, Optional, Dict


@dataclass
class AbrigoEntity:
    id: str = ""
    create_in: datetime = field(default_factory=lambda: datetime.now(timezone.utc))
    update_in: datetime = field(default_factory=lambda: datetime.now(timezone.utc))
    itensUteis: List[str] = field(default_factory=list)
    address: Optional[str] = None
    insumos_refeicao: Optional[str] = None
    estrutura_pessoas: Optional[str] = None
    nome_contato: Optional[str] = None
    city: Optional[str] = None
    pmpa: Optional[str] = None
    marmita: Optional[str] = None
    banheiros: Optional[int] = None
    tipo: Optional[str] = None
    nome: Optional[str] = None
    telefone: Optional[str] = None
    colchoes: Optional[int] = None
    vagas: Optional[int] = None
    vagas_ocupadas: Optional[int] = None
    cozinha: Optional[str] = None
    additional_info: List[str] = field(default_factory=list)

    def set_id(self, new_id: str):
        self.id = new_id

    def to_dict(self):
        return asdict(self)
