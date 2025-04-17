
# 📦 `src/providers/data/`

Ce dossier contient toute la configuration liée aux **data providers** et aux **WebSocket providers** pour l’application.

---

## 📂 Contenu

| Fichier                | Rôle |
|:-----------------------|:------------------------------------------------|
| `index.ts`              | Centralise la configuration des clients GraphQL et WebSocket, et exporte les `dataProvider` et `liveProvider` utilisés par Refine. |
| `fetch-wrapper.ts`      | Contient un wrapper personnalisé autour de `fetch` pour : gérer l’authentification via token, configurer les headers, et intercepter les erreurs GraphQL.|

---

## 📌 Détails des fichiers

### `index.ts`
- Définit les **URL API** et **WebSocket**.
- Crée un client GraphQL via `@refinedev/nestjs-query`.
- Implémente un **WebSocket client** (avec gestion dynamique du token dans les headers).
- Exporte :
  - `dataProvider` : utilisé par Refine pour toutes les opérations de données (CRUD).
  - `liveProvider` : permet à Refine de recevoir des mises à jour en temps réel via GraphQL subscriptions.

### `fetch-wrapper.ts`
- Implémente :
  - `customFetch` : fonction qui ajoute les headers nécessaires (token, content-type, etc.) et utilise `fetch`.
  - `getGraphQLErrors` : fonction qui extrait et formatte les erreurs retournées par l’API GraphQL.
  - `fetchWrapper` : fonction qui intercepte les réponses et déclenche une erreur en cas d’erreur GraphQL.

---

## 📊 Schéma rapide

```
Refine App
 ├── dataProvider  --> GraphQLClient (fetchWrapper → API)
 └── liveProvider  --> WebSocketClient (auth via token)
```

---

## ✅ Utilisation

Dans `App.tsx` :
```tsx
<Refine 
  dataProvider={dataProvider}
  liveProvider={liveProvider}
  ...
/>
```

---

## ✨ Avantages
- Centralisation des appels API.
- Sécurité via token d’auth intégré.
- Gestion centralisée des erreurs.
- Possibilité d’ajouter facilement d’autres providers (REST, Firebase, etc).

---

## 🛠️ Pour améliorer
- Gestion automatique du rafraîchissement de token.
- Logger ou monitoring des erreurs.
- Fallback réseau en cas de déconnexion WebSocket.
