## Fields available from Firebase Auth’s user object:

|Property|	Description|
|:--------:|--------------|
|uid|	Unique ID for this user (used to identify them in your DB)|
|email|	Email address (if email/password or provider provides it)|
|displayName|	Display name (only filled if using OAuth like Google or if you set it manually)|
|photoURL|	Profile photo URL (from provider or if you set it manually)|
|emailVerified|	Whether their email is verified|
|phoneNumber|	(if using phone auth)|
|providerData|	Info about sign-in provider (Google, etc.)|
|metadata|	Creation & last sign-in timestamps|

## { useAuthState } from "react-firebase-hooks/auth";

*The package react-firebase-hooks provides ready-made React Hooks that make it easy to integrate Firebase services (like Authentication, Firestore, and Realtime Database) with React apps.*

useAuthState is a custom React hook that allows you to subscribe to Firebase Authentication state.

When you use it, it automatically keeps track of whether:

- a user is signed in,
- the user is signed out,
- or the authentication state is still loading.

useAuthState(auth) returns an array with three items:

- user — the current Firebase user object if logged in, otherwise null
- loading — true while Firebase is checking the auth state
- error — any error that occurred during the process

usage: 

```js
import { useAuthState } from "react-firebase-hooks/auth";
import { auth } from "./firebase"; 

function App() {
  const [user, loading, error] = useAuthState(auth);
  const id = user.uid
```

# other hooks - Realtime Database (react-firebase-hooks/database)

If you’re using the older Realtime Database instead of Firestore:

useObject(ref) → listens to a single object.

useList(ref) → listens to a list (array).

useObjectVal(ref) / useListVals(ref) → like above but returns just the data, not the snapshot.