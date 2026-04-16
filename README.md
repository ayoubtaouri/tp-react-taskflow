Compte Rendu TP4 : MUI vs Bootstrap & Architecture BDD

Partie 1 : Header avec Material UI
Q1 : Combien de lignes de CSS avez-vous écrit pour le Header MUI ? Comparez avec votre Header.module.css. J'ai écrit 0 ligne de CSS externe pour le composant HeaderMUI. Tout le style est géré via la propriété sx directement dans les composants (CSS-in-JS). En comparaison, mon ancien Header.module.css nécessitait probablement autour de 20-30 lignes de code pour gérer le flexbox, les espacements et les couleurs manuellement.

Partie 3 : Header avec Bootstrap
Q2 : Comparez le code du Header MUI vs Bootstrap. Lequel est plus lisible ? Plus court ? Le code Bootstrap est globalement plus court car il utilise des classes utilitaires pour gérer le style et la disposition (ex: className="ms-auto d-flex align-items-center gap-3"). Je trouve cette approche familière et efficace, car elle évite d'avoir des objets de style lourds directement dans le JSX, rendant le tout plus lisible à mon sens.

Partie 4 : Login avec Bootstrap
Q3 : Le Login MUI utilise sx={{}} pour le style. Le Login Bootstrap utilise des classes CSS (className). Quel système préférez-vous ? Pourquoi ? Je préfère le système de classes CSS de Bootstrap (className). Il est beaucoup plus rapide à écrire et permet de garder un code React épuré. Les classes utilitaires (comme mb-3, w-100, d-flex) sont des standards de l'industrie, ce qui rend le code facilement compréhensible par n'importe quel développeur, sans avoir à apprendre la syntaxe spécifique du CSS-in-JS de MUI.

Partie 5 : Tableau comparatif
Critère	Material UI	React-Bootstrap
Installation	Nécessite plusieurs paquets (@mui/material, @emotion..., icônes)	Simple (react-bootstrap bootstrap)
Nombre de composants utilisés	Élevé (Box, Card, Typography, TextField, etc.)	Modéré (Container, Card, Form)
Lignes de CSS écrites	0 (utilisation exclusive de la prop sx)	0 (utilisation de className et styles inlines)
Système de style	Propriété sx={{}} (CSS-in-JS)	Classes utilitaires via className
Personnalisation couleurs	Centralisée (via ThemeProvider)	Très flexible (via la surcharge de variables SCSS)
Responsive	Breakpoints définis dans l'objet sx	Classes de grille habituelles (col-md, etc.)
Lisibilité du code	Bonne, mais peut devenir verbeuse	Excellente, code HTML/JSX plus épuré
Documentation	Très complète et interactive	Claire, concise et familière
Votre préférence		React-Bootstrap
Q4 : Si vous deviez choisir UNE seule library pour TaskFlow en production, laquelle et pourquoi ? Je choisirais React-Bootstrap. C'est une bibliothèque plus légère et moins prescriptive visuellement que Material UI. Elle permet de monter des interfaces responsives très rapidement tout en offrant une grande flexibilité pour personnaliser le design (via SCSS) afin qu'il ne ressemble pas obligatoirement au thème par défaut de Google. De plus, la syntaxe à base de classes rend la maintenance du code très simple pour les équipes.

Partie 6 : Architecture Base de Données
Schéma de l'architecture actuel de TaskFlow :

[Navigateur / React (Port 5173)] -- (HTTP GET/POST/PUT/DELETE via Axios) --> [json-server (Port 4000)] --> [db.json]
Si on remplaçait json-server par :

a) Firebase : [React] -- (Requêtes HTTPS via le SDK) --> [Firebase / Serveurs Google]
b) Express + MongoDB : [React] -- (HTTP via Axios) --> [Backend Express.js] -- (TCP / Mongoose) --> [Base de données MongoDB]
Q5 : Pourquoi React ne peut-il PAS se connecter directement à MySQL ? React s'exécute côté client (dans le navigateur de l'utilisateur). Si React se connectait directement à MySQL, cela impliquerait d'inclure les identifiants de la base de données (host, user, mot de passe) dans le code source JavaScript, exposant ainsi toute la base de données au public. De plus, les navigateurs ne gèrent pas le protocole réseau TCP brut requis pour communiquer avec MySQL.

Q6 : json-server est parfait pour notre TP. Donnez 3 raisons pour lesquelles on ne l'utiliserait PAS en production.

Sécurité inexistante : Aucune authentification réelle ni gestion des rôles ; tout le monde peut accéder et modifier le fichier entier.
Problème de concurrence : Il lit et écrit dans un seul fichier texte (db.json), ce qui provoquera des erreurs et de la lenteur si plusieurs vrais utilisateurs interagissent en même temps.
Fonctionnalités BDD absentes : Il n'est pas possible de faire des requêtes d'agrégation complexes, des transactions ou d'assurer l'intégrité des données à grande échelle.
Q7 : Firebase permet à React de se connecter directement (pas de backend Express). Comment est-ce possible alors que MySQL ne le permet pas ? Firebase est un "Backend-as-a-Service" (BaaS). Contrairement à MySQL qui est juste un moteur de données, Firebase expose une API HTTP sécurisée que le navigateur peut appeler via le SDK Firebase. La sécurité n'est pas gérée par un mot de passe unique caché dans React, mais par des Security Rules configurées sur les serveurs de Firebase qui valident l'identité de l'utilisateur pour chaque requête.

Partie 7 : Questions de réflexion
Q8 : Votre TaskFlow utilise json-server. Un client vous demande de passer en production avec de vrais utilisateurs. Quelles étapes sont nécessaires ?

Développer une vraie API Backend (ex: avec Node.js/Express ou Java/Spring).
Mettre en place une véritable base de données (PostgreSQL, MySQL ou MongoDB) et y migrer la structure de db.json.
Implémenter un système d'authentification robuste (JWT, OAuth2).
Héberger le Frontend (ex: Vercel) et le Backend + BDD (ex: AWS, Render) sur des serveurs sécurisés.
Q9 : MUI et Bootstrap sont des libraries externes. Quel est le risque d'en dépendre ?

Taille du bundle : Ces bibliothèques sont lourdes et augmentent le temps de téléchargement et d'exécution du JavaScript pour le client.
Mises à jour et dépréciation : Une mise à jour majeure de MUI ou Bootstrap peut casser l'UI (breaking changes). De plus, si l'équipe derrière la bibliothèque l'abandonne, notre application se retrouve avec une dette technique compliquée à remplacer.
Q10 : Vous devez créer une app de chat en temps réel. json-server, Firebase ou Backend custom ? Justifiez. Je choisirais Firebase (ou un backend custom utilisant des WebSockets). Justification : Une application de chat requiert du temps réel. json-server repose sur le protocole HTTP classique (le client doit interroger le serveur manuellement pour voir s'il y a de nouveaux messages). À l'inverse, Firebase (Firestore) maintient une connexion ouverte continue, permettant au serveur de "pousser" les messages vers le Frontend instantanément à la seconde où ils sont reçus.

