import { useState } from 'react';

export default function useSessionID() {

    const getSessionID = () => {
        const sessionID = sessionStorage.getItem('sessionID');
        return sessionID;
    };
    const [sessionID, setSessionID] = useState(getSessionID());

    const saveSessionID = userSessionID => {
        sessionStorage.setItem('sessionID', userSessionID);
        setSessionID(userSessionID)
    }

    return {
        setSessionID: saveSessionID,
        sessionID
    }
}