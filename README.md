🚨🚨🚨 ceci est juste un README temporaire…

FEUILLE DE ROUTE D'INTÉGRATION — PROJET CREDIBILIS
Hackathon CIF 2026 | Document de Synchronisation Équipe
🎯 Vision Globale
Le moteur de décision IA est finalisé, hébergé sur GitHub, et 100% fonctionnel. L'objectif actuel est de construire l'écosystème autour de ce moteur (API, Interface, Analyse, Pitch) sans jamais modifier le code du modèle.
👤 1. Chef d'Équipe (Team Leader / Pitcher)
Mission : Coordonner l'intégration et construire le discours métier pour le jury.
 Orchestration : S'assurer que le Frontend et le Backend communiquent avec le même format JSON.
 Storytelling : Axer le pitch sur 3 mots clés : Inclusion (grâce au cold-start par cohorte), Responsabilité (grâce au simulateur d'offres alternatives), et Transparence (grâce aux 3 niveaux de crédibilité).
 Préparation de la Démo : Sélectionner 3 profils clients types dans la base de données pour la démo en direct :
1 Un client parfait (Accord immédiat).
2 Un nouveau client sans historique (Accordé grâce à la cohorte).
3 Un client surendetté (L'IA propose un rallongement de durée au lieu d'un refus).
📊 2. Pôle Analyse des Données (Data Analyst)
Mission : Valoriser les données et créer des visuels percutants pour le Pitch.
 Validation du Dataset : Analyser le fichier ⁠donnees_fictives_credibilis.csv⁠ (généré par le script) pour s'assurer que les profils semblent réalistes (Revenus vs Charges cohérents).
 Dataviz pour les Slides : Créer 2 ou 3 graphiques montrant :
 La distribution des accords vs refus dans le jeu de données.
 L'impact du réseau/cohorte pour les clients sans historique.
 Appui au Pitch : Fournir au Chef d'Équipe les chiffres clés ("Notre modèle a été entraîné sur 500 profils, et intègre X variables socio-économiques...").
⚙️ 3. Développeur Backend (API & Serveur)
Mission : Connecter le moteur IA au reste du monde via une API REST.
 Clonage du repo : Faire un ⁠git clone [https://github.com/SahelTech-CIF/CREDIBILIS.git](https://github.com/SahelTech-CIF/CREDIBILIS.git)⁠.
 Création de l'API : Utiliser FastAPI ou Flask pour créer une route ⁠POST /api/v1/score⁠.
 Intégration stricte :
1 Importer la fonction : ⁠from ds_engine.predictor import predict_credibilis_score⁠
2 Passer le JSON reçu (payload) directement à cette fonction.
3 Retourner le résultat brut de la fonction au Frontend.
 Règle d'or : Ne JAMAIS recoder de logique métier dans le Backend. Le Backend n'est qu'un "facteur" qui transporte les données entre le Front et l'IA. Gérer impérativement les autorisations CORS pour le Frontend.
💻 4. Développeur Frontend (Interface UI/UX)
Mission : Créer l'interface Agent/Client qui consommera l'API.
 Écran de Saisie : Créer un formulaire épuré demandant : Identifiant, Revenus, Charges, Montant du prêt, Durée souhaitée.
 Dashboard de Décision (Le plus important) : Une fois la réponse de l'API reçue, l'interface doit afficher 3 blocs visuels :
1 Badge de Décision : Vert (Accordé), Orange (Soumis à conditions), Gris/Rouge (Abstention).
2 Jauge d'Explicabilité : Un graphique (camembert ou barres) affichant les 3 poids de l'IA (Poids individuel, Poids Cohorte, Poids Réseau).
3 Carte d'Offre Alternative : Uniquement si l'IA renvoie une ⁠offre_alternative⁠, afficher un bloc mettant en évidence le nouveau montant et la nouvelle durée suggérés pour éviter le surendettement.
🔗 Contrat d'Interface (À respecter par le Front et le Back)
Exemple de JSON envoyé par le Front :

{
  "id_client": "CLI-2026-0001",
  "revenu_mensuel": 350000,
  "charges_mensuelles": 80000,
  "montant_demande": 500000,
  "duree_mois": 6
}

Note pour le Front : Vous pouvez envoyer les clés en anglais comme ⁠income⁠ ou ⁠loan_amount⁠, l'IA les comprendra automatiquement).
Exemple de JSON renvoyé par le Back (Moteur IA) :


{
  "id_client": "CLI-2026-0001",
  "decision": "SOUMIS À CONDITIONS",
  "score_credibilis": 72.4,
  "poids_decision": {
    "score_sur_100": 72.4,
    "w_ind_pct": 33.3,
    "w_local_pct": 53.3,
    "w_reseau_pct": 13.3
  },
  "offre_alternative": {
    "montant_recommande": 450000,
    "duree_recommandee_mois": 9,
    "motif": "Rallongement recommandé (endettement tendu)."
  }
}
