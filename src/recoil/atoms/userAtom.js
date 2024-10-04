// recoil/atoms/userAtom.js
import { atom } from "recoil";

export const userState = atom({
  key: "userState", // unique ID (with respect to other atoms/selectors)
  default: {
    uid: null,
    email: null,
    username: null,
    avatar: null,
    listOfWhiteboardIds: [], 
    role: null,
  },
});
