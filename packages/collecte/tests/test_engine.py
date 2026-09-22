"""
Tests d'intégration de bout en bout pour CollectionEngine (engine.py).
Vérifie le cycle complet d'inspection, mapping, normalisation, validation,
doublons intra-lot et export, sans aucune dépendance à Django.
"""

from credibilis_collecte.contracts import ImportContext
from credibilis_collecte.engine import CollectionEngine
from credibilis_collecte.enums import EntityType, Severity, SourceKind


CSV_SAMPLE = """Nom client;Telephone;Date Naissance;Revenu Mensuel;Compte
Fatou Traoré;+223 76-12-34-56;12/05/1985;650 000 FCFA;CPT-001
Moussa Coulibaly;75 11 22 33;20/11/1990;450 000 FCFA;CPT-002
"""

CSV_WITH_DUPLICATE = """Nom client;Telephone;Compte
Fatou Traoré;76000000;CPT-001
Ousmane Diallo;76111111;CPT-001
"""


def test_engine_inspect():
    engine = CollectionEngine()
    inspection = engine.inspect(CSV_SAMPLE, source_name="clients.csv")

    assert "sheets" in inspection
    sheet = inspection["sheets"][0]
    assert "Nom client" in sheet["columns"]
    assert "Compte" in sheet["columns"]
    assert sheet["rows"] == 2


def test_engine_suggest_mapping():
    engine = CollectionEngine()
    columns = ["Nom client", "Telephone", "Revenu Mensuel", "Compte"]
    suggestions = engine.suggest_mapping(columns)

    assert suggestions["Nom client"]["suggested_target"] == "person.nom"
    assert suggestions["Telephone"]["suggested_target"] == "person.telephone"
    assert suggestions["Revenu Mensuel"]["suggested_target"] == "activity.ca_mensuel"
    assert suggestions["Compte"]["suggested_target"] == "external_id:COMPTE_MEMBRE"


def test_engine_import_source_end_to_end():
    engine = CollectionEngine()
    mapping = {
        "Nom client": "person.nom",
        "Telephone": "person.telephone",
        "Date Naissance": "person.date_naissance",
        "Revenu Mensuel": "activity.ca_mensuel",
        "Compte": "external_id:COMPTE_MEMBRE",
    }
    context = ImportContext(
        institution_id="KAFO",
        source_type=SourceKind.CSV,
        import_id="IMP-2026-001",
    )

    result = engine.import_source(
        source=CSV_SAMPLE,
        mapping=mapping,
        context=context,
        source_name="clients.csv",
        entity_type=EntityType.PERSON,
    )

    assert result.records_total == 2
    assert result.records_valid == 2
    assert result.records_blocked == 0

    # Vérification des normalisations
    rec1 = result.records[0]
    assert rec1.values["person.nom"] == "Fatou Traoré"
    assert rec1.values["person.telephone"] == "76123456"  # Indicatif +223 et tirets retirés
    assert rec1.values["person.date_naissance"] == "1985-05-12"  # Format ISO YYYY-MM-DD
    assert rec1.values["activity.ca_mensuel"] == 650000.0  # Devise FCFA et espaces retirés

    # Vérification de l'identifiant externe
    assert len(rec1.external_identifiers) == 1
    ext = rec1.external_identifiers[0]
    assert ext.identifier_type == "COMPTE_MEMBRE"
    assert ext.value == "CPT-001"

    # Vérification de la provenance par cellule
    assert len(rec1.provenance) == 4
    prov_ca = next(p for p in rec1.provenance if p.canonical_field == "activity.ca_mensuel")
    assert prov_ca.raw_value == "650 000 FCFA"
    assert prov_ca.normalized_value == 650000.0
    assert "currency_and_symbols_stripped" in prov_ca.transformations


def test_engine_duplicate_external_identifier_blocking():
    engine = CollectionEngine()
    mapping = {
        "Nom client": "person.nom",
        "Telephone": "person.telephone",
        "Compte": "external_id:COMPTE_MEMBRE",
    }
    context = ImportContext(institution_id="KAFO", import_id="IMP-DUP")

    result = engine.import_source(
        source=CSV_WITH_DUPLICATE,
        mapping=mapping,
        context=context,
        source_name="duplicate.csv",
    )

    assert result.records_total == 2
    # La collision intra-lot déclenche une anomalie BLOCKING
    assert result.records_blocked == 1
    dup_issues = [i for i in result.issues if i.code == "DUPLICATE_EXTERNAL_IDENTIFIER"]
    assert len(dup_issues) == 1
    assert dup_issues[0].severity == Severity.BLOCKING


def test_engine_export():
    engine = CollectionEngine()
    mapping = {
        "Nom client": "person.nom",
        "Telephone": "person.telephone",
    }
    context = ImportContext(institution_id="KAFO", import_id="IMP-EXP")

    result = engine.import_source(
        source=CSV_SAMPLE,
        mapping=mapping,
        context=context,
        source_name="export_test.csv",
    )

    # Export CSV
    csv_out = engine.export(result.records, format="csv")
    assert "person.nom" in csv_out
    assert "Fatou Traoré" in csv_out

    # Export JSON
    json_out = engine.export(result.records, format="json")
    assert '"person.nom": "Fatou Traoré"' in json_out

    # Export Excel
    excel_bytes = engine.export(result.records, format="xlsx")
    assert len(excel_bytes) > 0
    assert excel_bytes[:2] == b"PK"  # Signature d'un fichier zip/xlsx
