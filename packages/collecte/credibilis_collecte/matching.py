"""
Moteur d'Entity Resolution (Rapprochement d'entités) de credibilis_collecte.
Découplé de la persistance via le port `IdentityRepository`.
"""

from __future__ import annotations

import difflib
import unicodedata
from typing import List, Optional, Tuple

from .contracts import (
    CanonicalRecord,
    ExternalIdentifierSpec,
    IdentityCandidate,
    IdentityRepository,
    MatchResult,
)
from .enums import MatchStatus


class IdentityResolver:
    """Résout l'identité d'un enregistrement face au référentiel existant."""

    def __init__(self, repository: Optional[IdentityRepository] = None):
        self.repository = repository

    def resolve(self, record: CanonicalRecord, institution_id: str) -> MatchResult:
        if self.repository is None:
            return MatchResult(status=MatchStatus.AUCUN, confidence=0.0, reasons=["no_repository_configured"])

        # 1. Rapprochement Exact via Identifiants Externes
        for ext_id in record.external_identifiers:
            matched_id = self.repository.find_by_external_identifier(
                institution_id=ext_id.institution_id,
                identifier_type=ext_id.identifier_type,
                value=ext_id.value,
            )
            if matched_id:
                return MatchResult(
                    status=MatchStatus.EXACT,
                    confidence=1.0,
                    matched_entity_id=matched_id,
                    reasons=[f"exact_external_identifier_match:{ext_id.identifier_type}"],
                )

        # 2. Rapprochement Probabiliste Multicritère
        nom = record.values.get("person.nom")
        telephone = record.values.get("person.telephone")
        date_naiss = record.values.get("person.date_naissance")

        if not nom and not telephone:
            return MatchResult(status=MatchStatus.AUCUN, confidence=0.0, reasons=["insufficient_matching_attributes"])

        candidates = self.repository.search_candidates(
            telephone=telephone,
            nom=nom,
            date_naissance=date_naiss,
        )

        if not candidates:
            return MatchResult(status=MatchStatus.AUCUN, confidence=0.0, reasons=["no_candidate_found"])

        # Calcul du score de concordance pour chaque candidat
        scored_candidates: List[Tuple[IdentityCandidate, float, List[str]]] = []
        for cand in candidates:
            score, reasons = self._calculate_similarity(
                incoming_nom=nom,
                incoming_tel=telephone,
                incoming_dob=date_naiss,
                candidate=cand,
            )
            scored_candidates.append((cand, score, reasons))

        # Tri par score décroissant
        scored_candidates.sort(key=lambda x: x[1], reverse=True)
        best_cand, best_score, best_reasons = scored_candidates[0]

        # Règle anti-homonymes stricte : nom seul sans téléphone ni date de naissance ne peut dépasser 0.30
        if best_score >= 0.96:
            # Vérification de l'écart avec le 2e candidat s'il existe
            if len(scored_candidates) > 1 and (best_score - scored_candidates[1][1]) < 0.10:
                return MatchResult(
                    status=MatchStatus.AMBIGU,
                    confidence=best_score,
                    matched_entity_id=best_cand.entity_id,
                    reasons=best_reasons + ["close_competing_candidates"],
                    candidates=[c[0] for c in scored_candidates[:3]],
                )
            return MatchResult(
                status=MatchStatus.PROBABLE,
                confidence=best_score,
                matched_entity_id=best_cand.entity_id,
                reasons=best_reasons,
                candidates=[c[0] for c in scored_candidates[:3]],
            )
        elif best_score >= 0.75:
            return MatchResult(
                status=MatchStatus.AMBIGU,
                confidence=best_score,
                matched_entity_id=best_cand.entity_id,
                reasons=best_reasons,
                candidates=[c[0] for c in scored_candidates[:3]],
            )

        return MatchResult(
            status=MatchStatus.AUCUN,
            confidence=best_score,
            reasons=["low_confidence_score"],
            candidates=[c[0] for c in scored_candidates[:2]],
        )

    def _calculate_similarity(
        self,
        incoming_nom: Optional[str],
        incoming_tel: Optional[str],
        incoming_dob: Optional[str],
        candidate: IdentityCandidate,
    ) -> Tuple[float, List[str]]:
        reasons: List[str] = []
        score = 0.0

        # 1. Téléphone (Poids: 50%)
        if incoming_tel and candidate.telephone:
            if incoming_tel == candidate.telephone:
                score += 0.50
                reasons.append("exact_phone_match")
            elif incoming_tel[-8:] == candidate.telephone[-8:]:
                score += 0.45
                reasons.append("last_8_digits_phone_match")

        # 2. Nom de famille (Poids: 30%)
        if incoming_nom and candidate.nom:
            norm_inc = self._strip_accents(incoming_nom.strip().upper())
            norm_cand = self._strip_accents(candidate.nom.strip().upper())
            nom_sim = difflib.SequenceMatcher(None, norm_inc, norm_cand).ratio()
            score += 0.30 * nom_sim
            if nom_sim > 0.90:
                reasons.append("high_name_similarity")
            elif nom_sim > 0.75:
                reasons.append("partial_name_similarity")

        # 3. Date de naissance (Poids: 20%)
        if incoming_dob and candidate.date_naissance:
            if incoming_dob == candidate.date_naissance:
                score += 0.20
                reasons.append("exact_dob_match")

        return round(score, 4), reasons

    @staticmethod
    def _strip_accents(s: str) -> str:
        return "".join(c for c in unicodedata.normalize("NFKD", s) if not unicodedata.combining(c))
