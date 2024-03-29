import { atom } from "recoil";

const sessionState = atom({
    key: 'token',
    default: null
})

export default sessionState;