# Spécification Architecturale : Le Système des 5 Couches

L'**Agentic Engineering System (AES)** prévient la dérive des prompts, les hallucinations d'agents et la saturation de contexte en imposant un découpage rigoureux en 5 couches.

---

## Le Problème : Prompts Monolithiques et Dérive de Contexte

Lorsqu'on développe avec des agents IA (Claude Code, Cursor, Codex, Copilot), on commence généralement par un fichier d'instructions unique (`CLAUDE.md`, `.cursorrules`, `SYSTEM_PROMPT.md`).

Avec le temps, ce fichier devient un monolithe ingérable accumulant :
1. **Des principes éthiques et universels d'ingénierie** (sécurité, accessibilité, non-régression).
2. **Des spécificités de frameworks et bundlers** (Next.js, Vite, React 19).
3. **Des données commerciales temporaires** (grilles tarifaires, SIRET, noms de dirigeants).
4. **Des procédures de test et checklists opérationnelles**.

Cette dérive engendre 3 problèmes majeurs :
* **La contamination de contexte :** Un agent travaillant sur le Projet B invente des données du Projet A car elles étaient hardcodées dans un prompt global.
* **La dilution des consignes :** Plus le prompt s'allonge, plus le modèle oublie ou ignore les règles fondamentales.
* **Le gaspillage de tokens :** Un coût de tokens massif avant même que l'agent ne commence à lire les fichiers sources.

---

## La Solution : La Règle des 5 Couches

AES découple les instructions en 5 couches autonomes :

```
┌─────────────────────────────────────────────────────────────┐
│ 1. GLOBAL (rules/global-principles.md)                      │
│    Principes universels agnostiques pour 100% des projets.  │
├─────────────────────────────────────────────────────────────┤
│ 2. SKILLS / PROCÉDURES (skills/* ou fonctions d'agent)      │
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

### Couche 1 : Principes Globaux
* **Portée :** 100% des projets, de manière intemporelle.
* **Contient :** Non-régression, intégrité épistémique, règle des 4 statuts, zéro fausse stat, zéro emoji, accessibilité AA prouvée sans sur-promesse.
* **Interdit :** Tout nom de framework (React, Vue), nom d'entreprise ou donnée tarifaire.

### Couche 2 : Compétences & Procédures Opérationnelles
* **Portée :** Réutilisables entre plusieurs projets, chargées à la demande.
* **Contient :** Procédures spécialisées (calcul de bundle, audit SEO, génération Schema.org).

### Couche 3 : Configuration Projet
* **Portée :** Propre au dépôt actif (`project.config.json`).
* **Contient :** Nom du projet, domaines, langues actives, seuils de quality gates.

### Couche 4 : Contraintes de Stack
* **Portée :** Propre aux technologies employées (`rules/stack-*.md`).
* **Contient :** Règles Server vs Client Components, conventions de routage, gestion d'assets.

### Couche 5 : Faits Métier
* **Portée :** Données réelles validées par l'humain.
* **Contient :** Vrais prix, vraies mentions légales, vraies études de cas.
* **Règle absolue :** Si une donnée est manquante, l'agent doit signaler son absence au lieu d'inventer une valeur factice.
