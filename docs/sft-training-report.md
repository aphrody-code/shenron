# Rapport d'Entraînement SFT & Optimisations RAG

Ce rapport synthétise les interventions techniques majeures effectuées sur le monorepo DBFR (Shenron) pour stabiliser le crawl, optimiser l'indexation RAG et assurer la convergence du modèle de langage local de 29M de paramètres.

---

## 1. Stabilisation du Pipeline de Crawl et Ingestion

*   **Gestion des Blocages réseau (Timeouts bxc) :**
    *   Lors du crawl massif des documents de lore (Wayback Machine, Kanzentai, Neoseeker), certains sous-processus `bxc scrape` restaient bloqués indéfiniment en cas de perturbation réseau.
    *   **Résolution :** Introduction d'un mécanisme de timeout robuste de 30 secondes appliquant un `proc.kill()` pour débloquer immédiatement le pipeline de crawl parallèle.
*   **Résolution du verrouillage de base de données (SQLITE_BUSY) :**
    *   La copie directe du fichier SQLite actif `bot.db` via `copyFileSync` provoquait des verrous WAL et des erreurs `SQLITE_BUSY` lors de la reconstruction de l'index RAG.
    *   **Résolution :** Remplacement des copies de fichiers par un `VACUUM INTO` SQLite propre, permettant de dupliquer la base de production à chaud sans aucun verrou.
*   **Accélération de la DB d'ingestion :**
    *   L'écriture individuelle de milliers de chunks sans transaction était trop lente. Enveloppée dans une transaction unique (`BEGIN` / `COMMIT`), la base est désormais reconstruite de manière quasi instantanée.

---

## 2. Parallélisation et Optimisation des Services d'Embeddings

*   **Inférence Parallèle des Embeddings :**
    *   L'ingestion initiale interrogeait le sidecar d'embeddings de façon séquentielle, projetant plus de 3 heures de traitement CPU pour 27 653 chunks.
    *   **Résolution :** Parallélisation avec un pool de 6 promesses concurrentes et traitement par lots (batch size de 64), réduisant le temps d'inférence CPU global à environ 40 minutes.
*   **Mise à l'échelle de la RAM (Systemd) :**
    *   Le service sidecar `shenron-embed.service` subissait des blocages sévères (état de processus `D` / I/O wait et swap saturé) à cause d'une limite de mémoire trop restreinte (`MemoryHigh=2.5G` / `MemoryMax=3G`).
    *   **Résolution :** Passage des limites à `MemoryHigh=5G` et `MemoryMax=6G` dans `/etc/systemd/system/shenron-embed.service`, résolvant définitivement les goulots d'étranglement mémoire et permettant au service d'utiliser pleinement la RAM physique disponible de la VM (12 cœurs).

---

## 3. Harmonisation des Contextes & Entraînement SFT

*   **Résolution du Bug de Génération (Réponses Vides) :**
    *   *Symptôme :* Lors des évaluations objectives, le modèle local de 29M de paramètres renvoyait des chaînes vides `""` ou des fragments incohérents mélangeant les voix des personas (Whis, Beerus, etc.).
    *   *Cause :* Un décalage de distribution de données majeur (data distribution shift). Le dataset SFT n'avait été entraîné que sur des contextes limités à 300 caractères, tandis que la production et l'évaluation lui fournissaient des contextes de 1400 à 2200 caractères, provoquant l'effondrement de son attention.
    *   **Résolution :** Harmonisation stricte de la longueur du contexte à **800 caractères** sur l'ensemble de la chaîne :
        1.  Dans `corpus_export.ts` : génération du jeu SFT avec contextes de 800 caractères.
        2.  Dans `dbz_llm.py` (fonction `build_prompt`) : troncature du contexte à 800 caractères max.
        3.  Dans `llm.ts` (fonction `buildContext`) : limitation du contexte RAG fusionné à 800 caractères max (et 300 caractères max par chunk).
*   **Nouvel Entraînement Profond :**
    *   Lancement d'un entraînement SFT de **8 époques** (au lieu d'une seule) pour s'assurer que le modèle de 29M intègre correctement la logique d'attention sur le tag `<|persona|>` et parvienne à recopier les faits de son contexte de 800 caractères sans sur-apprendre.

---

## 4. Statut des Métriques

Les rapports d'évaluation sont poussés dans Redis (clés `dbz:eval:report:own` et `llm:latest`) et affichés sur le tableau de bord compagnon.
La purge automatique du cache sémantique a été effectuée pour garantir que chaque évaluation teste le modèle entraîné en direct.
