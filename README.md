# pesto-project

This template should help get you started developing with Vue 3 in Vite.

## Recommended IDE Setup

[VSCode](https://code.visualstudio.com/) + [Volar](https://marketplace.visualstudio.com/items?itemName=Vue.volar) (and disable Vetur) + [TypeScript Vue Plugin (Volar)](https://marketplace.visualstudio.com/items?itemName=Vue.vscode-typescript-vue-plugin).

## Customize configuration

See [Vite Configuration Reference](https://vitejs.dev/config/).

## Project Setup

```sh
npm install
```

### Compile and Hot-Reload for Development

```sh
npm run dev
```

### Compile and Minify for Production

```sh
npm run build
```

### DB Structure
For the db, firebase firestore is used.
In the frontend, firestore CRUD APIs are used, 'setDoc', 'deleteDoc' and 'updateDoc'.
For displaying the data, snapshots are used so that the data is always real time.

Firebase email and password authentication is also used for authenticating user.
Each user can see only their tasks and not others.

Search and filter functionality is also added so user can search by name of the task or filter them by their status.

To set the project for your firebase db, please change the firebaseConfig of firebase in 'firebase.js' file.
