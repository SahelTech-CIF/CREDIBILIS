"""
Exceptions du moteur d'intelligence CREDIBILIS.
"""

class ErreurIntelligence(Exception):
    """Exception racine de la couche intelligence CREDIBILIS."""
    pass


class FournisseurIndisponibleError(ErreurIntelligence):
    """Levée quand le fournisseur LLM requis ne répond pas ou est injoignable."""
    pass


class ValidationSortieError(ErreurIntelligence):
    """Levée lorsque la réponse du LLM ne respecte pas le schéma Pydantic attendu."""
    pass


class PolitiqueConfidentialiteError(ErreurIntelligence):
    """Levée lorsqu'une requête tente d'envoyer des données sensibles vers un fournisseur cloud non autorisé."""
    pass


class TacheInconnueError(ErreurIntelligence):
    """Levée lorsqu'une tâche d'intelligence non enregistrée est demandée."""
    pass
