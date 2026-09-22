"""
Tests unitaires pour le moteur d'Entity Resolution (matching.py).
Vérifie le rapprochement exact, le rapprochement probabiliste et la règle anti-homonymes.
"""

from typing import List, Optional

from credibilis_collecte.contracts import (
    CanonicalRecord,
    ExternalIdentifierSpec,
    IdentityCandidate,
    IdentityRepository,
)
from credibilis_collecte.enums import EntityType, MatchStatus
from credibilis_collecte.matching import IdentityResolver


class MockIdentityRepository(IdentityRepository):
    """Implémentation en mémoire du port IdentityRepository pour les tests."""

    def __init__(self):
        self.external_index = {
            ("KAFO", "COMPTE_MEMBRE", "00487291"): "ENT-UUID-001",
        }
        self.candidates = [
            IdentityCandidate(
                entity_id="ENT-UUID-002",
                nom="TRAORE",
                prenoms="Fatou",
                telephone="76000000",
                date_naissance="1985-05-12",
            ),
            IdentityCandidate(
                entity_id="ENT-UUID-003",
                nom="COULIBALY",
                prenoms="Moussa",
                telephone="75112233",
                date_naissance="1990-11-20",
            ),
        ]

    def find_by_external_identifier(
        self, institution_id: str, identifier_type: str, value: str
    ) -> Optional[str]:
        return self.external_index.get((institution_id, identifier_type, value))

    def search_candidates(
        self,
        telephone: Optional[str] = None,
        nom: Optional[str] = None,
        date_naissance: Optional[str] = None,
    ) -> List[IdentityCandidate]:
        results = []
        for c in self.candidates:
            if telephone and c.telephone == telephone:
                results.append(c)
            elif nom and c.nom and nom.strip().upper() in c.nom.strip().upper():
                results.append(c)
        return results


def test_exact_match_via_external_id():
    repo = MockIdentityRepository()
    resolver = IdentityResolver(repository=repo)

    record = CanonicalRecord(
        entity_type=EntityType.PERSON,
        values={"person.nom": "Traoré"},
        external_identifiers=[
            ExternalIdentifierSpec(
                institution_id="KAFO",
                entity_type=EntityType.PERSON,
                identifier_type="COMPTE_MEMBRE",
                value="00487291",
            )
        ],
    )

    res = resolver.resolve(record, institution_id="KAFO")
    assert res.status == MatchStatus.EXACT
    assert res.confidence == 1.0
    assert res.matched_entity_id == "ENT-UUID-001"


def test_probabilistic_match_probable():
    repo = MockIdentityRepository()
    resolver = IdentityResolver(repository=repo)

    # Concordance exacte téléphone (50%) + nom identique (30%) + date naissance (20%) = 100% >= 96%
    record = CanonicalRecord(
        entity_type=EntityType.PERSON,
        values={
            "person.nom": "Traoré",
            "person.telephone": "76000000",
            "person.date_naissance": "1985-05-12",
        },
    )

    res = resolver.resolve(record, institution_id="KAFO")
    assert res.status == MatchStatus.PROBABLE
    assert res.confidence >= 0.96
    assert res.matched_entity_id == "ENT-UUID-002"


def test_anti_homonym_rule_name_alone():
    repo = MockIdentityRepository()
    resolver = IdentityResolver(repository=repo)

    # Même nom 'Traoré', mais AUCUN téléphone ni date de naissance concordants
    # Score attendu = 30% < 75% -> Statut AUCUN (Empêche toute fusion risquée)
    record = CanonicalRecord(
        entity_type=EntityType.PERSON,
        values={
            "person.nom": "Traoré",
            "person.telephone": "66998877",  # Différent
            "person.date_naissance": "2000-01-01",  # Différent
        },
    )

    res = resolver.resolve(record, institution_id="KAFO")
    assert res.status == MatchStatus.AUCUN
    assert res.confidence <= 0.30
