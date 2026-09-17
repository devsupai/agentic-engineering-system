# Agentic Engineering System (AES)

> **Système d'ingénierie logicielle modulaire, préventif et standardisé pour agents IA (Claude Code, Cursor, Codex, Antigravity, Aider, Copilot).**

[![License: MIT](https://img.shields.io/badge/License-MIT-blue.svg)](LICENSE)
[![Node.js](https://img.shields.io/badge/Node.js-%3E%3D18.0.0-green.svg)](https://nodejs.org/)
[![Quality Gates](https://img.shields.io/badge/Quality%20Gates-Continuous-blueviolet.svg)](#quality-gates)
[![Rigueur Épistémique](https://img.shields.io/badge/Epistémologie-Stricte-orange.svg)](#métrologie-épistémique)

[**🇬🇧 Read Documentation in English**](README.md)

---

## 1. Pourquoi ce système existe-t-il ?

Sans structure stricte, les directives données aux agents de code deviennent un énorme prompt monolithique accumulant pêle-mêle des principes universels, des contraintes de stack et des données métier.

Cette dérive provoque :
1. **La contamination de contexte :** Un agent invente des données d'un ancien projet sur un nouveau dépôt.
2. **Le « Slop » IA :** L'agent invente des faux avis clients, des faux prix, des pourcentages arbitraires (*« +40% de conversion »*) ou prétend que le code est *« 100% accessible »*.
3. **Les rapports complaisants :** L'agent conclut que *« Tout est parfait »* sans exécuter de véritables tests ni calculer les tailles de bundle.

**AES résout ce problème** grâce à :
* **La Règle des 5 Couches :** Découplage strict entre Global, Compétences, Projet, Stack et Faits Métier.
* **La Rigueur Épistémique :** 4 statuts stricts (`MESURÉ`, `NON MESURÉ`, `ESTIMÉ`, `QUALITATIF`). Zéro calcul mental par l'agent.
* **Des Quality Gates Outillées :** Des scripts Node.js sans aucune dépendance externe pour valider le code de façon déterministe.

---

## 2. La Règle des 5 Couches

```
┌─────────────────────────────────────────────────────────────┐
│ 1. GLOBAL (rules/global-principles.md)                      │
│    Principes universels pour 100% des projets. Agnostique.  │
├─────────────────────────────────────────────────────────────┤
│ 2. PROCÉDURES & SKILLS (skills/* ou fonctions d'agent)      │
│    Procédures opérationnelles spécialisées réutilisables.   │
├─────────────────────────────────────────────────────────────┤
│ 3. PROJECT (project.config.json & directives locales)       │
│    Identité du projet, langues actives, seuils des gates.   │
├─────────────────────────────────────────────────────────────┤
│ 4. STACK (rules/stack-*.md)                                 │
│    Contraintes technologiques (framework, routeur, bundler).│
├─────────────────────────────────────────────────────────────┤
│ 5. FAITS (businessFacts dans project.config.json)           │
│    Données factuelles réelles (prix, mentions, cas réels).  │
└─────────────────────────────────────────────────────────────┘
```

---

## 3. Démarrage Rapide en 60 Secondes

### Étape 1 : Initialiser dans votre projet
```bash
# Dans votre projet existant ou nouveau dossier :
npx aes init
```

### Étape 2 : Exporter les directives pour votre agent IA
Générez les fichiers d'instructions adaptés à votre outil favori depuis la source unique de vérité :

```bash
# Pour Claude Code (génère CLAUDE.md)
npx aes export --target claude

# Pour Cursor (génère .cursor/rules/*.mdc)
npx aes export --target cursor

# Pour Antigravity / Gemini (génère GEMINI.md)
npx aes export --target gemini

# Pour Aider (génère CONVENTIONS.md)
npx aes export --target aider

# Tout exporter d'un coup
npx aes export --target all
```

### Étape 3 : Exécuter les Quality Gates
```bash
npx aes gate
```

---

## 4. Métrologie Épistémique & Les 4 Statuts

Chaque résultat ou métrique doit être classé sans ambiguïté :
* **`MESURÉ`** : Donnée issue d'un script exécuté en local (ex: `Total bundle gzip: 89.17 kB`).
* **`NON MESURÉ`** : Métrique réelle non mesurée en local (ex: Core Web Vitals en conditions réelles sans outil RUM).
* **`ESTIMÉ`** : Calcul projectif explicitement annoncé comme une estimation.
* **`QUALITATIF`** : Remarque issue d'une revue de code, ne constituant pas une mesure physique.

### Tableau de Synthèse Standardisé

L'agent présente ses conclusions dans un tableau standardisé avec preuve tangible :

| Gate | Statut | Preuve |
| :--- | :---: | :--- |
| **`web-seo (headings)`** | **PASS** | 1 H1 unique vérifié, 0 saut de niveau (8 fichiers HTML) |
| **`web-accessibility`** | **PASS** | Contrôles automatisés réussis pour critères testés (12 images avec alt conforme) |
| **`content-quality`** | **PASS** | 0 emoji, 0 allégation fictive (12 fichiers scannés) |
| **`web-seo (infrastructure)`** | **PASS** | Canonical: PASS \| Sitemap: PASS \| Robots: PASS \| llms.txt: PASS |
| **`web-performance (bundle)`** | **PASS** | HTML gzip: 3.8 kB \| CSS gzip: 11.2 kB \| JS gzip: 78.4 kB \| Total: 93.4 kB (MESURÉ) |
| **`web-performance (runtime CWV)`**| **NON MESURÉ**| LCP, INP, CLS non mesurés en local (audit instrumenté requis) |
| **`web-i18n`** | **N/A** | Projet monolingue |
| **`web-security`** | **N/A** | Aucun backend ni base de données |

---

## 5. Scripts de Validation Déterministes

Le dossier `scripts/` contient des utilitaires Node.js ultra-rapides et sans dépendance :

| Script | Fonction |
| :--- | :--- |
| `scripts/run-quality-gate.js` | Orchestrateur complet des Quality Gates. |
| `scripts/check-bundle-metrics.js` | Calcul automatique exact des tailles physiques brutes et gzip. |
| `scripts/check-headings.js` | Vérificateur d'unicité H1 et d'arborescence séquentielle. |
| `scripts/check-a11y-images.js` | Audit des attributs alt, dimensions et formats d'images. |
| `scripts/check-content-integrity.js`| Détecteur d'emojis et motifs statistiques suspects (anti-slop). |
| `scripts/check-seo-canonical-llms.js`| Contrôle canonicals absolues, sitemap, robots et llms.txt. |
| `scripts/self-check-report.js` | Contrôle de cohérence interne des rapports générés par l'IA. |

---

## 6. Intégration CI/CD GitHub Actions

Un workflow prêt à l'emploi est disponible dans `.github/workflows/quality-gates.yml` pour valider chaque PR et commit.

---

## Licence

MIT © 2026 DevSupAi & Contributeurs. Libre d'utilisation personnelle et commerciale.
