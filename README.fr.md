# Agentic Engineering System (AES)

> **Système de gouvernance logicielle, Quality Gates déterministes, Anti-Slop et SEO pour agents IA de code.**  
> Support natif pour **Claude Code**, **Cursor**, **Codex**, **Antigravity**, **Aider** et **Copilot**.

[![License: MIT](https://img.shields.io/badge/License-MIT-blue.svg)](LICENSE)
[![Node.js](https://img.shields.io/badge/Node.js-%3E%3D18.0.0-green.svg)](https://nodejs.org/)
[![Zéro Dépendance](https://img.shields.io/badge/D%C3%A9pendances-0-brightgreen.svg)](#faq)
[![SEO & AEO](https://img.shields.io/badge/SEO%20%26%20AEO-Automatis%C3%A9-purple.svg)](#pilier-2-moteur-seo--moteurs-ia-aeo)

[**🇬🇧 Read Documentation in English**](README.md)

---

## ⚡ En Bref : Ce que résout AES

Livrée à elle-même, une IA de code génère du **« slop »** : elle invente de faux avis clients, des pourcentages marketing fantaisistes (*« +45% de conversion ! »*), massacre la structure SEO (trois balises `<h1>` par page, balises canoniques oubliées) et déclare *"Tout est 100% accessible et parfait !"* sans avoir mesuré la moindre ligne.

**AES installe des garde-fous stricts, une infrastructure SEO/AEO automatisée et des Quality Gates déterministes dans vos sessions de développement IA.**

```
┌─────────────────────────────────────────────────────────────────────────┐
│                          IA PAR DÉFAUT vs. IA AVEC AES                  │
├──────────────────────────┬──────────────────────────────────────────────┤
│ ❌ Sans AES              │ ✅ Avec AES                                  │
├──────────────────────────┼──────────────────────────────────────────────┤
│ Prompt monolithique 800l │ Architecture découplée en 5 couches          │
│ Faux prix et fausses stats│ Zéro fake data, faits réels vérifiés        │
│ SEO cassé, multiples H1  │ 1 seul H1, hiérarchie séquentielle, llms.txt│
│ Tailles bundle inventées │ Calcul exact du gzip (zéro calcul mental)    │
│ Fausse promesse WCAG AA  │ Statut épistémique honnête (MESURÉ/NON MESURÉ)│
│ Rapport PASS aveugle     │ PASS WITH WARNINGS obligatoire si alertes    │
└──────────────────────────┴──────────────────────────────────────────────┘
```

---

## 🏛️ Les 4 Piliers Fondamentaux

### Pilier 1 : La Règle des 5 Couches (Zéro Contamination)
Empêche l'agent d'accumuler un prompt géant et d'halluciner des données d'un projet sur un autre :
1. **GLOBAL (`rules/global-principles.md`)** : Éthique universelle d'ingénierie pour 100% des projets.
2. **PROCÉDURES (`scripts/`)** : Scripts de vérification déterministes réutilisables.
3. **PROJET (`project.config.json`)** : Carte d'identité du dépôt (nom, domaine, langues, seuils).
4. **STACK (`rules/stack-*.md`)** : Contraintes de framework et bundler (React, Next.js, Vite...).
5. **FAITS (`businessFacts`)** : Données réelles prouvées (tarifs, mentions légales, cas concrets).

### Pilier 2 : Moteur SEO & Moteurs IA (AEO)
Des scripts intégrés garantissent une indexation optimale par les moteurs classiques et les moteurs IA :
* **Hiérarchie des titres :** Exactement **un `<h1>` unique par page** et arborescence strictement séquentielle (`<h1>` ➔ `<h2>` ➔ `<h3>`). Audité par `check-headings.js`.
* **Canoniques absolues :** Balise `<link rel="canonical">` absolue sur chaque page pour éliminer le duplicate content.
* **Sitemap & Robots :** Contrôle des URLs absolues dans `sitemap.xml` et directive Sitemap dans `robots.txt`.
* **Standard `llms.txt` :** Validation du format Markdown structuré indispensable aux crawlers IA (Perplexity, SearchGPT, Claude).

### Pilier 3 : Rigueur Épistémique & Anti-Slop
* **4 statuts exclusifs :** Chaque constat doit être qualifié (`MESURÉ`, `NON MESURÉ`, `ESTIMÉ`, `QUALITATIF`).
* **Zéro calcul mental :** Les métriques dérivées (sommes, moyennes de bundles) sont calculées par `check-bundle-metrics.js`.
* **Zéro emoji en production :** Emojis bannis dans le code et les interfaces ; icônes vectorielles SVG obligatoires.

### Pilier 4 : Quality Gates Déterministes (Zéro Dépendance)
Des utilitaires en pur Node.js qui s'exécutent en moins de 300ms sans installer le moindre paquet npm :
* `check-bundle-metrics.js` : Calcul physique exact brut et gzip (HTML, CSS, JS).
* `check-headings.js` : Audit séquentiel des balises de titres.
* `check-a11y-images.js` : Attributs alt, dimensions explicites (anti-CLS), formats modernes.
* `check-content-integrity.js` : Détecteur anti-slop (emojis, fausses promesses chiffrées).
* `check-seo-canonical-llms.js` : Contrôle SEO technique, sitemap, robots et `llms.txt`.
* `self-check-report.js` : Auto-contrôle de cohérence interne des rapports générés par l'IA.

---

## 🚀 Démarrage Rapide (60 Secondes)

### 1. Initialiser AES dans votre projet
```bash
npx aes init
```
*Génère `project.config.json` et `rules/global-principles.md`.*

### 2. Exporter les règles pour votre agent IA
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

### 3. Exécuter les Quality Gates
```bash
npx aes gate
```

Génère le tableau de preuves standardisé :
```markdown
| Gate | Statut | Preuve |
| :--- | :---: | :--- |
| web-seo (headings) | **PASS** | 1 H1 unique vérifié, hiérarchie séquentielle (8 fichiers HTML) |
| web-accessibility | **PASS** | Contrôles automatisés réussis pour critères testés (12 images avec alt) |
| content-quality | **PASS** | 0 emoji, 0 allégation fictive (12 fichiers scannés) |
| web-seo (infrastructure) | **PASS** | Canonical: PASS | Sitemap: PASS | Robots: PASS | llms.txt: PASS |
| web-performance (bundle) | **PASS** | HTML gzip: 3.8 kB | CSS gzip: 11.2 kB | JS gzip: 78.4 kB | Total: 93.4 kB (MESURÉ) |
| web-performance (runtime CWV) | **NON MESURÉ** | LCP, INP, CLS non mesurés en local (audit instrumenté requis) |
| web-i18n | **N/A** | Projet monolingue |
| web-security | **N/A** | Aucun backend ni base de données |
```

---

## 🤖 Plateformes d'IA Supportées

| Outil | Commande d'export | Fichier(s) généré(s) |
| :--- | :--- | :--- |
| **Claude Code & Projects** | `npx aes export --target claude` | `CLAUDE.md` |
| **Cursor IDE** | `npx aes export --target cursor` | `.cursor/rules/global-principles.mdc` & `stack-rules.mdc` |
| **Google Antigravity & Gemini** | `npx aes export --target gemini` | `GEMINI.md` |
| **Aider CLI** | `npx aes export --target aider` | `CONVENTIONS.md` |
| **GitHub Copilot** | `npx aes export --target copilot` | `.github/copilot-instructions.md` |
| **OpenAI Codex / Assistants** | *System instructions* | Voir [Guide Codex](docs/adapters/codex.md) |

---

## ❓ FAQ

**Q : Est-ce qu'il faut installer des paquets lourds ?**  
Non. Tous les scripts utilisent **0 dépendance npm** (pur Node.js natif : `fs`, `path`, `zlib`). L'exécution est quasi-instantanée.

**Q : Est-ce compatible avec mon framework ?**  
Oui. Le système fonctionne avec React, Next.js, Vite, Astro, Vue, Svelte ou du simple HTML/JS. Les contraintes spécifiques sont isolées dans `rules/stack-*.md`.

**Q : À quoi sert le fichier `llms.txt` ?**  
C'est le standard émergent qui permet aux moteurs IA (SearchGPT, Perplexity, Claude) d'indexer et comprendre votre site sans halluciner. AES vérifie sa validité automatiquement.

---

## 📚 Documentation Détaillée

* [Architecture : La Règle des 5 Couches](docs/architecture.fr.md)
* [Quality Gates & Métrologie Épistémique](docs/quality-gates.md)
* [Spécification Architecturale (Anglais)](docs/architecture.md)

---

## Licence

MIT © 2026 DevSupAi & Contributeurs. Libre pour usage personnel et commercial.
