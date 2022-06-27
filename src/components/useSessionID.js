import { useState } from 'react';
import Cookies from 'js-cookie';

export default function useSessionID() {
    //gets session id by default
    const getSessionID = () => {
        const sessionID = sessionStorage.getItem('sessionID');
        return sessionID;
    };
    const [sessionID, setSessionID] = useState(getSessionID());

    //retrieve sessionid from the backend during login and then set it in the session storage
    const saveSessionID = userSessionID => {
        sessionStorage.setItem('sessionID', userSessionID);
        setSessionID(userSessionID)
    }

    return {
        setSessionID: saveSessionID,
        sessionID
    }
}