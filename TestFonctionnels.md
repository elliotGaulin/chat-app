# Tests fonctionnels

## Tests pour l'api

### Prérequis

1. Le serveur se lance sans erreur avec ```npm run watch```

### Création d' utilisateurs 

2. L'api créer un utilisateur avec un nom et un mot de passe avec la route POST ```/users```
3. L'api retourne un message d'erreur si le nom ou le mot de passe n'est pas renseigné

### Connexion d' utilisateurs
4. L'api retourne les infos de l'utilisateur avec un nom et un mot de passe avec la route POST ```/users/login```
5. L'api retourne un message d'erreur et un code 401 si le nom ou le mot de passe n'est pas renseigné ou invalide

### Lecture des messages
6. L'api retourne les messages de l'utilisateur avec la route GET ```/messages```
7. L'api retourne un message d'erreur et un code 401 si l'entete d'autorisation n'est pas renseigné ou invalide

### Ecriture des messages
8. L'api écrit un message de l'utilisateur avec la route POST ```/messages```
9. Si le message est vide, l'api retourne un message d'erreur

### Conversations
10. L'api retourne les conversations de l'utilisateur avec la route GET ```/conversations```
11. L'api retourne un message d'erreur et un code 401 si l'entete d'autorisation n'est pas renseigné ou invalide

### Messages d'une conversation
12. L'api retourne les messages d'une conversation de l'utilisateur avec la route GET ```/conversations/:otherUserId```
13. Dans le cas où le id de l'utilisateur n'est pas du format valide, l'api retourne un message d'erreur

### WebSocket
14. La connexion au WebSocket se fait sans erreur avec l'url ```ws://localhost:8080```
15. L'api ferme la connexion avec un code 4001 si le premier message ne contient pas le token d'authentification
16. Lorsqu'un message est envoyé, l'api envoie le message à tout ceux qui sont connectés au WebSocket et qui sont dans la conversation
17. Le message ne peut pas être vide

## Tests pour le client

### Prérequis
16. L'application React se lance sans erreur avec ```npm start```


### Connexion
17. L'application React affiche la page de connexion correctement
18. L'application React affiche un message d'erreur si le nom ou le mot de passe n'est pas renseigné
19. L'application React affiche un message d'erreur si le nom ou le mot de passe est invalide
20. L'application React redirige vers la page de chat si le nom et le mot de passe sont valides

### Page de chat
21. L'application React affiche la page de chat correctement

    #### Liste des conversations
    22. L'application React affiche la liste des conversations correctement
    23. La liste de conversation est mise à jour lorsqu'un message est reçu ou envoyé
    24. La conversation est chargée lorsqu'elle est sélectionnée

    #### Liste des messages
    25. L'application React affiche la liste des messages correctement
    26. La liste de messages est mise à jour lorsqu'un message est reçu ou envoyé
    27. La liste de messages défile automatiquement vers le bas lorsqu'un message est reçu ou envoyé
    28. Les messages sont placés à droite si c'est l'utilisateur qui les a envoyés

    #### Envoi de messages
    29. L'application React envoie un message correctement
    30. L'application React affiche un message d'erreur si le message est vide
    31. Le message s'affiche dans la liste des messages

## Barre de navigation
32. L'application React affiche la barre de navigation correctement
33. Le titre de la page est sois "Chat app" ou "bien le nom de l'utilisateur"
34. Le bouton de déconnexion est présent lorsque l'utilisateur est connecté
35. Le bouton de déconnexion déconnecte l'utilisateur et redirige vers la page de connexion