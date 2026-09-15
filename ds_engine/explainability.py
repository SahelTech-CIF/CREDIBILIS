def get_shap_explanations(client_data):
    """
    Génère des facteurs explicatifs transparents pour l'agent de crédit.
    """
    explanations = []
    
    if client_data.get('appartenance_tontine') == 1:
        explanations.append({'critere': 'Membre actif d\'une Tontine', 'impact': '+18 pts', 'type': 'positif'})
    else:
        explanations.append({'critere': 'Absence de réseau tontine', 'impact': '-12 pts', 'type': 'negatif'})
        
    fmm = client_data.get('flux_mobile_money', 0)
    if fmm >= 300000:
        explanations.append({'critere': 'Flux Mobile Money réguliers', 'impact': '+12 pts', 'type': 'positif'})
    elif fmm < 100000:
        explanations.append({'critere': 'Volume de transactions restreint', 'impact': '-8 pts', 'type': 'negatif'})

    anciennete = client_data.get('anciennete_activite_mois', 0)
    if anciennete >= 36:
        explanations.append({'critere': f'Commerce établi ({anciennete} mois)', 'impact': '+10 pts', 'type': 'positif'})
    elif anciennete < 12:
        explanations.append({'critere': 'Récence de l\'activité (Cold Start)', 'impact': '-6 pts', 'type': 'negatif'})

    return explanations