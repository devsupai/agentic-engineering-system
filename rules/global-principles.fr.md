# Directives Fondamentales d'Ingénierie pour Agents IA

Ces principes universels s'appliquent à l'ensemble des projets logiciels régis par ce système. Ils définissent les exigences d'excellence technique, d'intégrité factuelle, d'accessibilité, de sécurité, de performance et de vérification continue.

---

## 1. Analyse Préalable & Non-Régression

* **Compréhension avant action :** Inspecter et comprendre l'architecture, les dépendances et le code existant avant toute modification.
* **Non-régression & chirurgie :** Préserver scrupuleusement les fonctionnalités en place. Ne modifier que les fichiers strictement concernés par la tâche sans introduire d'effets secondaires.
* **Gestion des risques :** Identifier les impacts collatéraux potentiels avant tout refactoring ou mise à jour de dépendance.

---

## 2. Règle des 5 Couches (Séparation des Responsabilités)

Pour éviter la saturation de contexte, les hallucinations et l'accumulation de prompts géants monolithiques, les règles sont découplées en 5 couches :

```
┌─────────────────────────────────────────────────────────────┐
│ 1. GLOBAL (rules/global-principles.md)                      │
│    Principes universels agnostiques pour 100% des projets.  │
├─────────────────────────────────────────────────────────────┤
│ 2. SKILLS / PROCÉDURES (skills/* ou capacités de l'agent)   │
│    Procédures opérationnelles spécialisées réutilisables.   │
├─────────────────────────────────────────────────────────────┤
│ 3. PROJECT (project.config.json & directives locales)       │
│    Identité, domaines, langues et périmètre du projet.      │
├─────────────────────────────────────────────────────────────┤
│ 4. STACK (rules/stack-*.md)                                 │
│    Contraintes technologiques (framework, routeur, bundler).│
├─────────────────────────────────────────────────────────────┤
│ 5. FAITS (données factuelles vérifiées)                     │
│    Données réelles prouvées (prix, mentions, cas concrets). │
└─────────────────────────────────────────────────────────────┘
```

Ne jamais mélanger de données commerciales ou de contraintes de stack dans la couche globale.

---

## 3. Intégrité Factuelle, Métrologie & Anti-Slop

* **Zéro donnée fictive :** Interdiction absolue d'inventer des prix, des forfaits, des conditions commerciales, des partenaires, des certifications ou de faux avis clients.
* **Zéro statistique inventée :** Ne jamais insérer de pourcentages arbitraires ou de promesses chiffrées non prouvées (ex: *« +40% de conversion »*).
* **Catégories épistémiques strictes :** Classer tout résultat selon 4 statuts exclusifs :
  * `MESURÉ` : Résultat provenant d'une mesure ou d'un test réellement exécuté (ex: `JS = 89.17 kB gzip`).
  * `NON MESURÉ` : Mesure impossible localement ou non effectuée (ex: Core Web Vitals en conditions réelles, LCP, INP, CLS sans mesure instrumentée).
  * `ESTIMÉ` : Calcul projectif ou estimation théorique explicitement annoncée comme telle.
  * `QUALITATIF` : Appréciation technique issue d'une revue de code, ne constituant jamais une mesure.
* **Calcul automatique des métriques dérivables :** Lorsqu'un rapport présente un total, une moyenne, un pourcentage ou toute valeur dérivable de données mesurées :
  1. Calculer automatiquement la valeur via un outil ou script ;
  2. Utiliser la valeur calculée exacte dans le rapport ;
  3. Ne jamais laisser l'agent effectuer le calcul mentalement ou approximativement ;
  4. Si les données nécessaires sont absentes ➔ `NON MESURÉ`.
* **Pas d'automatisation des jugements de valeur :** Les scripts détectent des faits objectifs (motifs interdits, données manquantes, incohérences, structures invalides). Ils ne doivent jamais décider arbitrairement qu'un contenu est « mauvais » ou « trop marketing » sans critère objectivable.

---

## 4. Standards Visuels & Accessibilité (A11y)

* **Accessibilité & Périmètre de conformité :**
  * Un contrôle automatisé ou partiel ne permet **JAMAIS** d'affirmer « WCAG 2.2 AA compliant » ou « 100% accessible ».
  * Formulation obligatoire : *« Contrôles automatisés d'accessibilité réussis pour les critères testés »* (en précisant le périmètre exact).
  * Distinguer explicitement : critères effectivement testés, critères non testés et audit manuel nécessaire.
* **Critères techniques :** Garantir des contrastes conformes (ratio >= 4.5:1), une navigation clavier intégrale, un indicateur de focus visible et des formulaires pourvus de labels explicites.
* **Composants masqués & interactifs :** Neutraliser les éléments interactifs masqués (`aria-hidden="true"`) avec l'attribut HTML `inert`.
* **Arborescence d'accessibilité & ARIA :** Ne jamais appliquer `aria-pressed` sur des liens (`<a>`, `<Link>`) ; utiliser exclusivement `aria-current="page"` pour désigner l'élément ou la langue active.
* **Zéro emoji :** Bannir les symboles emoji Unicode dans les interfaces et le code de production. Utiliser exclusivement des icônes vectorielles SVG calibrées ou le système d'icônes officiel du projet.

---

## 5. SEO & Moteurs IA (AEO)

* **Structure des titres (Headings) :** Exactement **un et un seul `<h1>`** par page, suivi d'une arborescence strictement séquentielle (`<h1>` ➔ `<h2>` ➔ `<h3>`) sans saut de niveau.
* **Indexabilité & Canoniques :** Titre unique, meta description soignée, balise canonical absolue et fichiers `sitemap.xml` et `robots.txt` synchronisés.
* **Optimisation pour moteurs IA :** Maintenir un fichier `llms.txt` structuré et factuel pour les crawlers d'agents IA.
* **Séparation des intentions :** Distinguer nettement les pages de conversion/offres des pages informationnelles/pédagogiques.

---

## 6. Performance Web & Sobriété

* **Découplage métriques physiques vs performance réelle :**
  * Le système mesure localement : taille des bundles, nombre de fichiers, taille gzip, dépendances, ressources bloquantes.
  * La présence d'un petit bundle ne permet pas à elle seule de conclure « performance excellente ». LCP, INP, CLS restent obligatoirement `NON MESURÉ` tant qu'un véritable environnement de mesure instrumenté n'a pas été utilisé.
* **Optimisation des assets :** Formats modernes (WebP, AVIF, SVG), compression adaptée, dimensions et ratios d'aspect explicites (pour éliminer le CLS).
* **Sobriété de code :** Code-splitting, lazy-loading stratégique, maîtrise de la taille des bundles et chargement différé des scripts non critiques.

---

## 7. Sécurité & Protection des Données

* **Gestion stricte des secrets :** Aucun token d'administration, clé privée d'API ou secret ne doit figurer dans le code client ou être commité dans le dépôt.
* **Authentification vs Autorisation :** L'authentification ne confère aucun droit par elle-même. Valider rigoureusement les permissions côté serveur ou règles de sécurité backend (RLS, Firestore Rules).
* **Validation des entrées :** Valider et assainir systématiquement toute donnée externe ou utilisateur.

---

## 8. Internationalisation (i18n)

* **Projet multilingue :** Parité stricte des routes, métadonnées traduites, canonicals localisées et balises `hreflang` réciproques.
* **Projet monolingue :** Conserver une architecture simple sans surcharger le projet de tuyauteries multilingues inutiles ; marquer les contrôles i18n comme `N/A`.

---

## 9. Développement Continu, Quality Gates & Definition of Done

* **Prévention continue :** Appliquer les contrôles qualité au fil de l'eau (*Créer ➔ Contrôler ➔ Corriger ➔ Valider*).
* **Preuve obligatoire par Quality Gate :** Chaque porte de qualité doit produire une preuve factuelle et exploitable dans un tableau structuré :
  `| Gate | Statut | Preuve |`
  Bannir les adjectifs vagues (*« conforme »*, *« optimisé »*, *« sécurisé »*) sans preuve factuelle associée.
* **Cohérence stricte du verdict global :**
  * `PASS` : Si aucun problème significatif n'est détecté.
  * `PASS WITH WARNINGS` : Si des avertissements justifiés (`WARN`) subsistent sans bloquer la livraison (le rapport doit obligatoirement expliciter les `WARN` responsables).
  * `FAIL` : Si au moins une exigence critique échoue.
  * Interdiction absolue d'afficher un verdict `PASS` si des `WARN` significatifs sont signalés sans être assumés.
* **Self-check du rapport :** Tout rapport doit faire l'objet d'un contrôle de cohérence interne avant livraison.
* **Definition of Done :** Une tâche n'est achevée qu'après vérification du build, validation des tests ciblés, contrôle d'absence de régression, self-check du rapport et compte-rendu factuel.
