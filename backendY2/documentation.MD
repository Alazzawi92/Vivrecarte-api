# Documentation Backend – API Test

## 1. Configuration

### Variables d’environnement (`.env`)

| Variable                     | Description                                  |
|-------------------------------|----------------------------------------------|
| PORT                          | Port du serveur (ex : 5000)                  |
| DB_HOST                        | Host MySQL                                   |
| DB_USER                        | Utilisateur MySQL                             |
| DB_PASS                        | Mot de passe MySQL                            |
| DB_NAME                        | Base de données                               |
| JWT_SECRET                     | Secret pour JWT                               |
| SMTP_HOST / BREVO_SMTP_HOST    | SMTP pour envoi mails                         |
| SMTP_USER / BREVO_SMTP_USER    | Auth SMTP                                     |
| SMTP_PASS / BREVO_SMTP_PASS    | Auth SMTP                                     |
| SMTP_PORT / BREVO_SMTP_PORT    | Port SMTP                                     |
| SMTP_SENDER                     | Email expéditeur                              |
| CLIENT_URL                     | URL front-end (pour lien vérification email) |

---

### baseURL: 

```
https://vivre-card.vercel.app
```
|-----------------------------|

## 2. Endpoints
### 2.1 Authentification

| Méthode | Route                      | Description                                        | Body / Params                                                                                 | Réponse attendue |
|---------|----------------------------|--------------------------------------------------|-----------------------------------------------------------------------------------------------|-----------------|
| POST    | `/api/auth/register`       | Création utilisateur + envoi email de vérification | `{ "email": string, "password": string, "confirmPassword": string }`                           | `{ "userId": number }` |
| POST    | `/api/auth/login`          | Connexion et récupération JWT                     | `{ "email": string, "password": string }`                                                    | `{ "token": string }` |
| GET     | `/api/auth/verify/:token`  | Vérification email via token                      | Param URL : `token` (string)                                                                 | `{ "message": "Email vérifié avec succès" }` |



### 2.2 Utilisateur

| Méthode | Route                       | Description                        | Body / Params                              | Réponse attendue |
|---------|-----------------------------|------------------------------------|-------------------------------------------|-----------------|
| PUT     | `/api/users/location`       | Mettre à jour la localisation      | `{ "latitude": number, "longitude": number }` | `{ "success": true }` |
| GET     | `/api/users/active`         | Récupérer utilisateurs actifs (dernières 3 min) | Aucun                                     | `[ { "id": number, "email": string, "latitude": number, "longitude": number } ]` |

---

## 3. Sécurité

- **JWT** : Toutes les routes `/api/users` nécessitent un token valide dans le header `Authorization: Bearer <token>`  
- **Rate Limiting** : 50 requêtes par IP / 15 minutes (globale et sur `/api/auth`)  
- **Validation** : Tous les inputs passent par Zod (`registrationSchema`, `loginSchema`, `updateLocationSchema`)  
- **Mot de passe** : Hashé avec `argon2`  
- **Emails** : Token de vérification unique et supprimé après confirmation  

---

## 4. Tests recommandés

1. **Inscription**  
   - Email valide / invalide  
   - Mot de passe invalide (moins de 8 caractères, pas de majuscule, pas de chiffre)  
   - Vérifier email de confirmation  

2. **Login**  
   - Utilisateur inexistant  
   - Mot de passe incorrect  
   - JWT valide après connexion  

3. **Vérification Email**  
   - Token valide / expiré / inexistant  

4. **Mise à jour localisation**  
   - Latitude / Longitude valide et hors limites  
   - Vérifier que `req.user.id` est utilisé et pas un id arbitraire  

5. **Récupération utilisateurs actifs**  
   - Vérifier que seules les données safe sont retournées (`id`, `email`, `latitude`, `longitude`)  

---

## 5. Notes pour testeur

- Les erreurs sont renvoyées avec format `{ success: false, message: string }`  
- Toutes les réponses en succès sont sécurisées, pas de mot de passe ni token exposé  
- Pour tester le backend en local, utiliser `localhost:<PORT>` et `.env` configuré  
- Vérifier les logs pour SMTP et JWT pour débogage  