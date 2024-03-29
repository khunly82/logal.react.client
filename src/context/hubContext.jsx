import { HubConnectionBuilder } from "@microsoft/signalr";
import { createContext, useEffect, useRef } from "react";
import { useRecoilState } from "recoil";
import sessionState from "../state/sessionState";

export const HubContext = createContext(null);

export const HubContextProvider = ({children}) => {

    const [session] = useRecoilState(sessionState);

    const connection = useRef(null);

    useEffect(() => {
        if(session) {
            connection.current = new HubConnectionBuilder()
                .withUrl('http://localhost:5100/ws/message?access_token='+session)
                .build();
            connection.current.start();

            console.log(connection)
        }
        else {
            connection.current?.stop()
        }
    }, [session])

    

    return <HubContext.Provider value={connection}>
        {children}
    </HubContext.Provider>
}