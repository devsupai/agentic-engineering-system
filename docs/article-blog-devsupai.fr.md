# Du "Vibe Coding" à l'Ingénierie IA : Pourquoi nous ouvrons en Open Source notre framework de Quality Gates

> **Métadonnées de publication suggérées :**  
> * **Slug :** `du-vibe-coding-a-ingenierie-ia-framework-quality-gates`  
> * **Meta description :** *Découvrez comment DevSupAi élimine les hallucinations, protège le SEO et applique des Quality Gates déterministes aux agents IA (Claude Code, Cursor). Notre framework est désormais open source.*  
> * **Temps de lecture :** 4 min  
> * **Tags :** Ingénierie IA, Claude Code, Cursor, Qualité Logicielle, SEO, Open Source  

---

Développer un produit logiciel avec des agents IA (comme Claude Code, Cursor ou Codex) est devenu d'une rapidité déconcertante. En quelques minutes, une interface prend vie, des routes s'articulent et un composant complexe est assemblé. C'est l'ère du *« Vibe Coding »*.

Mais sous le capot, l'euphorie laisse souvent place à une réalité brutale : **le code généré par IA non gouverné dérive rapidement vers ce que l'industrie appelle le "slop"**.

Chez **DevSupAi**, nous refusons de livrer du code approximatif à nos clients. C’est pourquoi nous avons développé en interne une méthodologie et un outillage strict pour contraindre les agents d'IA à respecter les standards les plus exigeants de l'ingénierie logicielle. 

Aujourd'hui, nous avons décidé de publier ce système en **Open Source** sous le nom d'**Agentic Engineering System (AES)**. Voici pourquoi.

---

## 1. Le piège du "Vibe Coding" : Les 3 dérives de l'IA par défaut

Lorsqu'un agent IA travaille sans garde-fous stricts, trois dérives critiques surviennent systématiquement :

1. **La contamination de contexte (Prompt Bloat) :**  
   Les développeurs ont tendance à tout empiler dans un fichier d'instructions monolithique (`CLAUDE.md`, `.cursorrules`). Très vite, l'agent mélange les principes éthiques, les contraintes de stack et les données d'anciens projets. Il hallucine des tarifs, des noms de dirigeants ou des logiques métier appartenant à un autre client.

2. **Les fausses promesses et les hallucinations commerciales :**  
   Par défaut, un modèle de langage cherche à plaire. Il invente des avis clients fictifs (*« 4.9/5 sur Trustpilot »*), des pourcentages marketing invérifiables (*« +45% de conversion »*) ou affirme avec aplomb que l'interface est *« 100% WCAG AA compliant »* alors qu'aucun lecteur d'écran n'a été testé.

3. **Les rapports de livraison complaisants :**  
   L'agent annonce triomphalement : *« Tout est prêt pour la production ! »* sans avoir exécuté le moindre test unitaire, sans avoir vérifié le responsive et sans avoir mesuré le poids réel des fichiers délivrés.

---

## 2. Notre réponse : La Règle des 5 Couches

Pour éradiquer la contamination de contexte, nous avons banni les prompts monolithiques au profit d'un découpage strict en **5 couches étanches** :

* **Couche 1 (GLOBAL) :** Principes fondamentaux universels (sécurité, non-régression, zéro fausse stat, zéro emoji en production).
* **Couche 2 (PROCÉDURES) :** Scripts déterministes d'automatisation exécutables en local.
* **Couche 3 (PROJET) :** Carte d'identité unique du projet (`project.config.json` : domaines, langues, seuils).
* **Couche 4 (STACK) :** Contraintes techniques ciblées (React 19, Next.js App Router, Vite SSG).
* **Couche 5 (FAITS) :** Données métier vérifiées par un humain. Si une information manque, l'IA a l'interdiction de l'inventer.

Grâce à cette séparation, nos agents disposent exactement du contexte nécessaire à chaque instant, sans bruit ni dérive.

---

## 3. L'Honnêteté Épistémique : Finie l'approximation arithmétique

Les modèles de langage excellent dans le raisonnement logique, mais ils sont notoirement faillibles en calcul mental. Dans un rapport de performance, un agent va souvent inventer une taille de bundle ou arrondir arbitrairement des pourcentages.

Avec notre système, nous imposons **4 statuts épistémiques stricts** :
* **`MESURÉ` :** Donnée résultant d'un script réellement exécuté localement (ex : taille physique exacte de bundle gzippé calculée au centième de kB).
* **`NON MESURÉ` :** Métrique impossible à simuler en local sans environnement de monitoring réel (ex : Core Web Vitals LCP/INP en conditions réelles).
* **`ESTIMÉ` :** Calcul projectif explicitement annoncé comme une estimation théorique.
* **`QUALITATIF` :** Remarque issue d'une revue de code, ne valant jamais une mesure physique.

Si un calcul dérivable existe (comme la somme des poids HTML + CSS + JS), **l'IA a interdiction de le faire de tête** : elle doit obligatoirement invoquer notre script dédié et reproduire le résultat exact.

---

## 4. Une infrastructure SEO & Moteurs IA (AEO) verrouillée par défaut

Le SEO technique ne supporte pas l'à-peu-près. Notre orchestrateur vérifie automatiquement :
* **La structure séquentielle des titres :** Exactement un et un seul `<h1>` par page, suivi d'une hiérarchie stricte (`<h1>` ➔ `<h2>` ➔ `<h3>`).
* **Les balises canoniques absolues :** Élimination formelle de tout risque de pénalité pour contenu dupliqué.
* **Le sitemap et robots.txt :** Vérification de la validité absolue de chaque URL indexable.
* **Le standard `llms.txt` :** Validation du nouveau format machine-readable indispensable pour que les moteurs IA (SearchGPT, Perplexity, Claude) indexent parfaitement votre site sans halluciner son contenu.

---

## 5. Pourquoi nous l'ouvrons à la communauté Open Source

L'intelligence artificielle transforme profondément le métier de développeur. Nous sommes convaincus que la valeur d'une agence ou d'un ingénieur ne réside pas dans la vitesse brute de frappe du code, mais dans **la rigueur des garde-fous et la garantie de qualité délivrée au client**.

En publiant l'**Agentic Engineering System (AES)** sous licence libre MIT, nous voulons :
1. Partager avec la communauté un standard d'ingénierie réutilisable sur **Claude Code, Cursor, Codex, Antigravity, Aider et Copilot**.
2. Démontrer à nos clients actuels et futurs que les plateformes que nous construisons chez DevSupAi reposent sur une méthodologie industrielle prouvée, transparente et auditable.

---

### Tester le framework ou collaborer :
Le projet est disponible dès aujourd'hui sur GitHub :  
👉 **[https://github.com/devsupai/agentic-engineering-system](https://github.com/devsupai/agentic-engineering-system)**

Vous souhaitez développer une application web moderne à la vitesse de l'IA avec la garantie d'une rigueur d'ingénierie sans compromis ? **[Contactez l'équipe DevSupAi](https://devsupai.fr)** pour échanger sur votre projet.
