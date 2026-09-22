"""
Moteur de normalisation de credibilis_collecte.
Transforme les représentations textuelles ou sales en types Python stricts
tout en enregistrant l'historique complet des transformations (provenance).
"""

from __future__ import annotations

import re
from datetime import date, datetime
from typing import Any, List, Optional, Tuple

from .enums import FieldType


class Normalizer:
    """Nettoie et normalise les valeurs brutes selon leur FieldType."""

    @classmethod
    def normalize(cls, raw_value: Any, field_type: FieldType) -> Tuple[Any, List[str]]:
        transformations: List[str] = []
        if raw_value is None:
            return None, transformations

        if field_type == FieldType.STRING:
            return cls.normalize_string(raw_value, transformations)
        elif field_type in (FieldType.MONEY, FieldType.DECIMAL):
            return cls.normalize_money(raw_value, transformations)
        elif field_type == FieldType.INTEGER:
            return cls.normalize_integer(raw_value, transformations)
        elif field_type == FieldType.PHONE:
            return cls.normalize_phone(raw_value, transformations)
        elif field_type == FieldType.DATE:
            return cls.normalize_date(raw_value, transformations)
        elif field_type == FieldType.BOOLEAN:
            return cls.normalize_boolean(raw_value, transformations)
        elif field_type == FieldType.IDENTIFIER:
            return cls.normalize_identifier(raw_value, transformations)

        return raw_value, transformations

    @classmethod
    def normalize_string(cls, value: Any, transformations: List[str]) -> Tuple[Optional[str], List[str]]:
        txt = str(value).strip()
        if txt == "" or txt.lower() in ("null", "none", "nan", "n/a", "-"):
            transformations.append("empty_to_none")
            return None, transformations
        if len(txt) != len(str(value)):
            transformations.append("whitespace_trimmed")
        return txt, transformations

    @classmethod
    def normalize_money(cls, value: Any, transformations: List[str]) -> Tuple[Optional[float], List[str]]:
        if isinstance(value, (int, float)):
            return float(value), transformations
        txt = str(value).strip()
        if not txt or txt.lower() in ("null", "none", "nan", "n/a", "-"):
            return None, transformations

        # Suppression des devises et espaces
        orig = txt
        txt = re.sub(r"[^\d.,\-+]", "", txt)
        if "," in txt and "." not in txt:
            txt = txt.replace(",", ".")
            transformations.append("comma_to_dot")
        elif "," in txt and "." in txt:
            txt = txt.replace(",", "")  # séparateur de milliers
            transformations.append("thousands_separator_removed")

        if orig != txt:
            transformations.append("currency_and_symbols_stripped")

        try:
            val = float(txt)
            return val, transformations
        except (ValueError, TypeError):
            transformations.append("conversion_failed")
            return None, transformations

    @classmethod
    def normalize_integer(cls, value: Any, transformations: List[str]) -> Tuple[Optional[int], List[str]]:
        float_val, trans = cls.normalize_money(value, transformations)
        if float_val is None:
            return None, trans
        int_val = int(round(float_val))
        if int_val != float_val:
            trans.append("rounded_to_int")
        return int_val, trans

    @classmethod
    def normalize_phone(cls, value: Any, transformations: List[str]) -> Tuple[Optional[str], List[str]]:
        if value is None:
            return None, transformations
        txt = str(value).strip()
        if not txt or txt.lower() in ("null", "none", "nan", "n/a", "-"):
            return None, transformations

        # Nettoyage des caractères non numériques
        digits = re.sub(r"\D", "", txt)
        # Gestion indicatif international Mali (+223)
        if digits.startswith("223") and len(digits) == 11:
            digits = digits[3:]
            transformations.append("removed_country_code_223")

        if digits != txt:
            transformations.append("phone_digits_extracted")

        return digits if digits else None, transformations

    @classmethod
    def normalize_date(cls, value: Any, transformations: List[str]) -> Tuple[Optional[str], List[str]]:
        if value is None:
            return None, transformations
        if isinstance(value, datetime):
            transformations.append("datetime_to_iso_date")
            return value.strftime("%Y-%m-%d"), transformations
        if isinstance(value, date):
            return value.strftime("%Y-%m-%d"), transformations

        txt = str(value).strip()
        if not txt or txt.lower() in ("null", "none", "nan", "n/a", "-"):
            return None, transformations

        # Formats courants
        formats = [
            ("%Y-%m-%d", "iso_format"),
            ("%d/%m/%Y", "fr_slash_format"),
            ("%d-%m-%Y", "fr_dash_format"),
            ("%Y/%m/%d", "slash_iso_format"),
            ("%d.%m.%Y", "dot_format"),
        ]
        for fmt, desc in formats:
            try:
                dt = datetime.strptime(txt[:10], fmt)
                transformations.append(f"parsed_{desc}")
                return dt.strftime("%Y-%m-%d"), transformations
            except ValueError:
                continue

        transformations.append("date_parse_failed")
        return None, transformations

    @classmethod
    def normalize_boolean(cls, value: Any, transformations: List[str]) -> Tuple[Optional[bool], List[str]]:
        if isinstance(value, bool):
            return value, transformations
        txt = str(value).strip().lower()
        if txt in ("true", "1", "oui", "vrai", "y", "yes"):
            transformations.append("string_to_bool_true")
            return True, transformations
        if txt in ("false", "0", "non", "faux", "n", "no"):
            transformations.append("string_to_bool_false")
            return False, transformations
        return None, transformations

    @classmethod
    def normalize_identifier(cls, value: Any, transformations: List[str]) -> Tuple[Optional[str], List[str]]:
        if value is None:
            return None, transformations
        txt = str(value).strip().upper()
        if not txt or txt.lower() in ("null", "none", "nan", "n/a", "-"):
            return None, transformations
        if txt != str(value):
            transformations.append("identifier_trimmed_and_uppercased")
        return txt, transformations
