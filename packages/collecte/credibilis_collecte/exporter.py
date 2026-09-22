"""
Moteur d'exportation de credibilis_collecte.
Exporte les données canoniques au format CSV, Excel ou JSON.
Ne dépend pas de Django.
"""

from __future__ import annotations

import csv
import io
import json
from typing import List, Optional

from .contracts import CanonicalRecord


class Exporter:
    """Exporte des listes de CanonicalRecord vers divers formats standards."""

    @classmethod
    def to_csv(cls, records: List[CanonicalRecord], delimiter: str = ";") -> str:
        if not records:
            return ""

        # Récupération de l'ensemble des colonnes présentes
        columns = cls._collect_columns(records)
        fieldnames = columns + ["_match_status", "_matched_entity_id"]
        output = io.StringIO()
        writer = csv.DictWriter(output, fieldnames=fieldnames, delimiter=delimiter)
        writer.writeheader()

        for r in records:
            row = {col: r.values.get(col, "") for col in columns}
            # Ajout des métadonnées de matching
            if r.match:
                row["_match_status"] = r.match.status.value
                row["_matched_entity_id"] = r.match.matched_entity_id or ""
            writer.writerow(row)

        return output.getvalue()

    @classmethod
    def to_json(cls, records: List[CanonicalRecord], indent: int = 2) -> str:
        serialized = []
        for r in records:
            item = {
                "entity_type": r.entity_type.value,
                "values": r.values,
                "external_identifiers": [
                    {
                        "institution_id": ext.institution_id,
                        "identifier_type": ext.identifier_type,
                        "value": ext.value,
                    }
                    for ext in r.external_identifiers
                ],
                "issues_count": len(r.issues),
                "is_valid": r.is_valid,
                "is_blocked": r.is_blocked,
            }
            if r.match:
                item["match"] = {
                    "status": r.match.status.value,
                    "confidence": r.match.confidence,
                    "matched_entity_id": r.match.matched_entity_id,
                    "reasons": r.match.reasons,
                }
            serialized.append(item)

        return json.dumps(serialized, ensure_ascii=False, indent=indent)

    @classmethod
    def to_excel(cls, records: List[CanonicalRecord]) -> bytes:
        import openpyxl

        wb = openpyxl.Workbook()
        ws = wb.active
        ws.title = "Export_Canonique"

        if not records:
            buffer = io.BytesIO()
            wb.save(buffer)
            return buffer.getvalue()

        columns = cls._collect_columns(records)
        full_headers = columns + ["_match_status", "_matched_entity_id"]
        ws.append(full_headers)

        for r in records:
            row_data = [r.values.get(col, "") for col in columns]
            row_data.append(r.match.status.value if r.match else "")
            row_data.append(r.match.matched_entity_id if r.match and r.match.matched_entity_id else "")
            ws.append(row_data)

        buffer = io.BytesIO()
        wb.save(buffer)
        return buffer.getvalue()

    @classmethod
    def _collect_columns(cls, records: List[CanonicalRecord]) -> List[str]:
        cols = set()
        for r in records:
            cols.update(r.values.keys())
        return sorted(list(cols))
