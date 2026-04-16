Réponses aux questions théoriques et corrections - TP 3 : React Router, Axios & CRUD
Ce document contient les réponses aux questions de compréhension ainsi que l'identification des bugs volontaires glissés dans le sujet du TP 3.

Partie 2 & 3 : Protected Route et Navigation
[cite_start]Q1 : Pourquoi utiliser le composant <Navigate /> et pas le hook Maps() ici ? [cite: 526]

[cite_start]Réponse : Dans un composant React (comme ProtectedRoute), le rendu (le return) doit être déclaratif[cite: 518, 524]. [cite_start]Le composant <Navigate /> est conçu pour être retourné dans le JSX pour déclencher une redirection de manière déclarative[cite: 524]. Le hook Maps(), en revanche, est impératif ; il s'utilise uniquement en réponse à un événement (comme un clic de bouton) ou à l'intérieur d'un useEffect, mais jamais directement dans le corps de la fonction de rendu principal.
Bug Volontaire (Login) :

[cite_start]Problème : Dans le useEffect du composant Login, la ligne if (state.user) navigate(from); cause un problème dans l'historique de navigation[cite: 540, 574].
Correction : Il faut utiliser Maps(from, { replace: true });.
[cite_start]Q2 : Quelle différence entre Maps(from) et Maps(from, { replace: true }) ? [cite: 576]

Réponse : * Maps(from) ajoute une nouvelle entrée dans la pile d'historique du navigateur (History API). [cite_start]Si l'utilisateur clique sur le bouton "Retour", il reviendra sur la page de Login (ce qui n'est pas logique s'il est déjà connecté)[cite: 574, 575].
[cite_start]Maps(from, { replace: true }) remplace l'entrée actuelle (la page de Login) par la nouvelle cible (from) dans l'historique[cite: 576]. Le bouton "Retour" ramènera alors l'utilisateur à la page précédant la tentative de connexion, ce qui correspond au comportement attendu d'un point de vue expérience utilisateur (UX).
Partie 4 : Dashboard & Optimisation d'état
[cite_start]Q3 : Après un POST, pourquoi fait-on setProjects(prev => [...prev, data]) plutôt qu'un re-fetch GET ? [cite: 679]

Réponse : C'est une question d'optimisation (Mise à jour optimiste du DOM). [cite_start]L'API nous renvoie déjà l'objet créé avec son nouvel ID (le data du POST)[cite: 625]. En mettant à jour le state localement en ajoutant ce nouvel objet à la liste existante, on évite une requête réseau supplémentaire (le GET), ce qui réduit la charge sur le serveur et rend l'interface beaucoup plus rapide et réactive pour l'utilisateur.
Partie 5 : Page ProjectDetail (Résolution des bugs)
Il y a deux bugs dans le fichier ProjectDetail.tsx :

[cite_start]BUG 1 : Le tableau de dépendances du useEffect [cite: 698]

Problème : }, []);
Explication : Le useEffect ne s'exécute qu'une seule fois au montage. Si l'utilisateur navigue d'un projet à un autre (l'ID dans l'URL change), le composant ne rechargera pas les nouvelles données car id n'est pas surveillé.
Correction : }, [id, navigate]);
[cite_start]BUG 2 : L'affichage du nom de l'utilisateur [cite: 707]

Problème : userName={authState.user.name}
Explication : Si, pour une raison quelconque, la session expire ou si le state n'est pas encore totalement initialisé, authState.user peut être null. Essayer de lire .name sur null fera crasher toute l'application React.
[cite_start]Correction : Utiliser l'optional chaining (comme fait dans le Dashboard) : userName={authState.user?.name}[cite: 639].
Partie 6 : Routage
[cite_start]Q4 : Testez ces scénarios : [cite: 754]

[cite_start]a) /dashboard sans être connecté : Le composant ProtectedRoute intercepte la route et redirige vers /login[cite: 524, 747].
[cite_start]b) /projects/1 sans être connecté : Même chose, ProtectedRoute redirige vers /login car l'état user est null[cite: 524, 750].
[cite_start]c) /nimportequoi : La route path="*" intercepte l'URL inconnue et redirige vers /dashboard (avec un replace)[cite: 753]. Ensuite, si l'utilisateur n'est pas connecté, le ProtectedRoute de /dashboard le redirigera vers /login.
[cite_start]d) / (racine) : La route path="/" redirige vers /dashboard[cite: 752].
e) Connecté puis bouton Retour du navigateur : L'utilisateur revient à la page précédente. [cite_start]Si nous avons bien utilisé { replace: true } lors du login, il ne reverra jamais le formulaire de connexion[cite: 524, 576].
Partie 7 : Sidebar & Liens de navigation
Q5 : Quelle différence entre <Link> et <NavLink> ? [cite_start]Pourquoi NavLink ici ? [cite: 780]

Réponse : Les deux composants évitent le rechargement complet de la page pour la navigation SPA (Single Page Application). Cependant, <NavLink> est "intelligent" : il sait si le chemin vers lequel il pointe (to) correspond à l'URL actuelle du navigateur[cite: 768].
[cite_start]Pourquoi l'utiliser : Dans la Sidebar, cela permet d'exposer la propriété isActive dans sa prop className, ce qui nous permet d'appliquer conditionnellement la classe CSS .active pour mettre en surbrillance le projet actuellement sélectionné[cite: 768, 770].
Partie 8 : ProjectForm réutilisable
Bug Volontaire (ProjectForm) :

[cite_start]Problème : Il manque une instruction essentielle dans la fonction handleSubmit[cite: 799].
Correction : Il faut ajouter e.preventDefault(); avant d'appeler onSubmit(name, color). Sans cela, la soumission du formulaire rechargera la page entière[cite: 804].
Q6 : Ce composant sert pour le POST ET le PUT. [cite_start]Qu'est-ce qui change entre les deux usages ? [cite: 812]

Réponse : Ce qui change, ce sont les "Props" (les paramètres) qu'on lui passe depuis le composant parent[cite: 785].
[cite_start]Pour le POST (Création) : On ne lui passe pas d'initialName ni d'initialColor (il prendra les valeurs par défaut vides)[cite: 787, 788, 793]. [cite_start]La fonction passée à onSubmit exécutera un api.post()[cite: 654].
Pour le PUT (Modification) : On lui injectera les données actuelles du projet via initialName et initialColor pour pré-remplir le formulaire. La fonction onSubmit exécutera un api.put().
Partie 9 : Gestion des erreurs
Q7 : Arrêtez json-server et tentez un POST. [cite_start]Le message s'affiche ? [cite: 835]

Réponse : Oui, la requête va échouer (Network Error) puisque le backend est éteint. Le bloc catch va intercepter cette exception et mettre à jour le state error, ce qui déclenchera l'affichage conditionnel du message d'erreur dans l'interface[cite: 823, 832].
Q8 : Avec fetch, un 404 ne lance PAS d'erreur. [cite_start]Avec Axios, que se passe-t-il ? [cite: 836]

Réponse : Contrairement à l'API native fetch qui ne rejette la promesse qu'en cas de panne réseau (et où il faut vérifier manuellement res.ok), Axios simplifie la gestion des erreurs. Si le serveur renvoie un code de statut HTTP de type erreur (4xx comme 404 Not Found, ou 5xx comme 500 Internal Server Error), Axios rejette automatiquement la promesse, ce qui vous fait basculer directement dans le bloc catch[cite: 823, 836]. ======= <<<<<<< HEAD
Réponses aux questions théoriques - TP 2 : Auth Context & Protected Layout
Partie 3 : Auth Context & Provider
Q2 : Pourquoi le useAuth() lance une erreur si le context est null ? Quel bug ça prévient ?

[cite_start]Réponse : L'erreur est lancée intentionnellement si useAuth est appelé en dehors de l'arbre de composants enveloppé par <AuthProvider>[cite: 251, 261, 264].
Bug prévenu : Cela empêche des bugs silencieux et des crashs d'application du type Cannot read properties of null (reading 'state'). En forçant cette vérification, on s'assure que tout composant essayant de consommer le contexte d'authentification a bien accès aux valeurs state et dispatch définies par le Provider.
Q3 : Sans Context, comment feriez-vous pour partager le user entre Header, Sidebar et Login ? Combien de props ?

[cite_start]Réponse : Sans Context, il faudrait utiliser la technique du "Prop Drilling" (forage de props)[cite: 276]. Cela consisterait à stocker l'état de l'utilisateur dans le composant racine (ex: App) et à le faire descendre manuellement via des props à chaque niveau de l'arbre des composants.
[cite_start]Nombre de props : Cela nécessiterait de passer au moins une prop user (et potentiellement une prop onLogin/onLogout) à travers plusieurs composants intermédiaires pour atteindre le Header, la Sidebar et la page de Login, rendant le code lourd et difficile à maintenir[cite: 276].
Partie 4 : Page Login avec formulaire contrôlé
Q4 : Pourquoi e.preventDefault() est indispensable dans handleSubmit ?

[cite_start]Réponse : Par défaut, la soumission d'un formulaire HTML (<form>) provoque le rechargement complet de la page web[cite: 285, 346]. En React, un rechargement de page entraîne la perte de tout l'état de l'application (le State). [cite_start]e.preventDefault() annule ce comportement par défaut, permettant à React de gérer la soumission de manière asynchrone via JavaScript (avec fetch) tout en conservant l'état actuel[cite: 285, 288, 346].
Q5 : Que fait la destructuration { password, ...user } = users[0] ? Pourquoi exclure le password ?

[cite_start]Réponse : Cette syntaxe extrait la propriété password de l'objet utilisateur (récupéré depuis la base de données) et rassemble toutes les propriétés restantes (comme id, name, email) dans un nouvel objet nommé user[cite: 295, 347].
[cite_start]Pourquoi : On exclut le mot de passe pour des raisons de sécurité[cite: 202, 347]. [cite_start]Il ne faut jamais stocker d'informations sensibles comme un mot de passe en clair dans le State global (Context) de l'application front-end, car il serait facilement accessible et n'a aucune utilité pour l'interface une fois la connexion validée[cite: 202, 296].
Partie 5 & 6 : Protected Layout et Flux de déconnexion
Q6 : Pourquoi le Dashboard est un composant séparé et pas tout dans App ?

[cite_start]Réponse : Séparer le Dashboard permet une meilleure séparation des responsabilités[cite: 365, 400]. [cite_start]Le composant App se concentre uniquement sur la logique de routage conditionnel : afficher <Login /> si l'utilisateur n'est pas authentifié, ou <Dashboard /> s'il l'est[cite: 359, 362, 364]. [cite_start]Le Dashboard, quant à lui, encapsule toute la logique (récupération des données, layout avec Sidebar et Header) spécifique à l'espace connecté[cite: 365, 371].
Q8 : Dessinez le flux du callback onLogout :

Flux de déconnexion :
1. [cite_start][Header] : L'utilisateur clique sur le bouton "Déconnexion" (onClick)[cite: 418, 433].
      │
      ▼
2. [cite_start][Header props] : Appelle la fonction callback `onLogout`[cite: 408, 433].
      │
      ▼
3. [cite_start][App] : Exécute le `dispatch({ type: 'LOGOUT' })` fourni par le `useAuth`[cite: 392, 433].
      │
      ▼
4. [cite_start][authReducer] : Intercepte l'action 'LOGOUT' et remet le state à `initialState` (user = null)[cite: 221, 235].
      │
      ▼
5. [cite_start][Context] : La mise à jour du state déclenche un re-rendu (re-render) du composant `App`[cite: 433].
      │
      ▼
6. [App] : Vérifie `authState.user`. [cite_start]Comme il est null, rend `<Login />` à la place du `<Dashboard />`[cite: 359, 362, 433].
Partie 7 - BONUS : useLayoutEffect
Q9 : Pourquoi le flash disparaît avec useLayoutEffect ?

Réponse : Le navigateur traite l'affichage de l'écran en plusieurs étapes.
[cite_start]Avec useEffect, la modification du DOM (Commit) est faite, le navigateur peint l'écran (Paint) avec la position initiale (0,0), puis l'effet s'exécute, recalcule la position et repeint l'écran (d'où le flash)[cite: 489, 493].
[cite_start]Avec useLayoutEffect, l'effet s'exécute de manière synchrone juste après la mise à jour du DOM (Commit), mais avant que le navigateur ne peigne l'écran (Paint)[cite: 494, 495, 496]. [cite_start]Le navigateur attend que les calculs du useLayoutEffect soient terminés pour dessiner l'interface finale directement avec les bonnes coordonnées, éliminant ainsi le flash[cite: 491, 496]. Q10 : Pourquoi ne pas utiliser useLayoutEffect partout si c'est mieux ?
[cite_start]Réponse : Parce que useLayoutEffect est bloquant pour le rendu visuel[cite: 496, 497]. [cite_start]Comme le navigateur attend la fin de l'exécution de l'effet pour peindre l'écran[cite: 496], si vous y placez des opérations lourdes ou lentes (comme des requêtes réseau), l'application paraîtra figée ou mettra du temps à s'afficher pour l'utilisateur. useEffect est asynchrone et laisse le navigateur faire son rendu fluide, il est donc préférable de l'utiliser par défaut, sauf pour des problèmes très spécifiques de calcul de position dans le DOM (comme ici avec l'info-bulle). =======
Réponses aux questions théoriques - TP React & Web Moderne
Ce document contient les réponses aux questions de compréhension posées lors du TP de Développement Front-End.

Partie 1 : Initialisation du projet
Question : Ouvrez index.html. Que contient le <body> ? [cite_start]Lien avec le CSR ? [cite: 22]

Réponse : Le <body> contient uniquement une balise vide <div id="root"></div> et l'inclusion du script principal main.tsx.
Lien avec le CSR (Client-Side Rendering) : Contrairement au rendu côté serveur (SSR) où le HTML arrive déjà construit, en CSR, le serveur renvoie une page HTML presque vide. C'est React, exécuté par le navigateur (le client), qui va injecter et construire toute l'interface utilisateur dynamiquement à l'intérieur de la balise #root.
Partie 2 : Backend avec json-server
[cite_start]Question : Quelle différence entre des données en dur dans le code et une API REST ? [cite: 69]

Données en dur : Elles sont écrites directement dans les fichiers source de l'application. Pour les modifier, il faut changer le code source et recompiler l'application.
API REST : L'application récupère les données dynamiquement via des requêtes HTTP (ex: via json-server). Cela sépare le frontend des données, permettant de modifier le contenu sans toucher au code de l'interface et de simuler un environnement réel client-serveur.
Partie 3 : Composants avec Props
[cite_start]Question : Pourquoi className au lieu de class en JSX ? [cite: 85]

Réponse : Le JSX n'est pas du HTML pur, il est transpilé en JavaScript. Le mot class étant un mot-clé réservé en JavaScript (utilisé pour la programmation orientée objet), React utilise className pour cibler l'attribut HTML correspondant et éviter les conflits syntaxiques.
Question : Pourquoi key={p.id} est obligatoire dans .map() ? [cite_start]Que se passe-t-il avec l'index ? [cite: 105]

Obligation : La prop key aide le DOM Virtuel de React à identifier de manière unique quels éléments ont changé, été ajoutés ou supprimés, ce qui optimise grandement les performances lors des re-rendus.
Problème avec l'index : Utiliser l'index du tableau (0, 1, 2...) comme clé est une mauvaise pratique si la liste peut changer (tri, filtrage, suppression). Si l'ordre change, les index changent aussi, ce qui peut causer des bugs visuels et des problèmes d'état imprévisibles dans React.
Partie 4 : State, useEffect & Fetch
Q1 : Combien de fois le useEffect s'exécute-t-il ? [cite_start]Pourquoi ? [cite: 166]

Réponse : Il s'exécute une seule fois, juste après le premier rendu (montage) du composant. Cela est dû au tableau de dépendances vide [] passé en deuxième argument de useEffect.
Q2 : Arrêtez json-server (Ctrl+C) et rechargez. [cite_start]Que se passe-t-il ? [cite: 167]

Réponse : Les requêtes fetch échouent car l'API REST ne répond plus. Le bloc catch du code intercepte l'erreur (visible avec un console.error), le loading passe à false, mais l'interface s'affichera vide (sans projets ni colonnes) car les states projects et columns restent à leur valeur initiale (des tableaux vides).
Q3 : Ouvrez Network (F12). Voyez-vous les requêtes vers localhost:4000 ? [cite_start]Code HTTP ? [cite: 168]

Réponse : Oui, dans l'onglet Network (Réseau), on observe deux requêtes de type fetch/XHR vers /projects et /columns. Si json-server est lancé, leur code HTTP est 200 (OK), indiquant que la requête a réussi.
Q4 : Les nouvelles données s'affichent ? [cite_start]Décrivez le cycle complet. [cite: 171]

Réponse : Oui, si on modifie db.json et qu'on recharge la page, les nouvelles données s'affichent.
Cycle complet :
Rechargement de la page : Montage initial des composants (le state loading est vrai).
Déclenchement du useEffect -> lancement des requêtes fetch.
Réception des nouvelles données du json-server.
Mise à jour du State via setProjects et setColumns.
La modification du State provoque un re-rendu de l'application avec les nouvelles données et met à jour le DOM de la page.
[cite_start]Q5 : Dessinez le flux (json-server, fetch, useState, useEffect, composants, props). [cite: 172, 173]

Flux de l'application :
[json-server] (API REST)
      │
      ▼
[useEffect] -> exécute la fonction -> [fetch] (Requêtes HTTP)
                                          │
                                          ▼
                                   [useState] (Mise à jour de projects & columns)
                                          │
                                          ▼
                               [Composant Parent (App)] (Déclenche un re-rendu)
                                          │
                                          ▼
                                       [props]
                                          │
           ┌──────────────────────────────┼─────────────────────────────┐
           ▼                              ▼                             ▼
    [Header (title)]           [Sidebar (projects)]         [MainContent (columns)]
