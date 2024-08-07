import { createContext, useState } from "react";
import axios from "axios";

export const UserContext = createContext();

const UserContextProvider = (props) => {

    const [userName, setUserName] = useState(null);
    const [userIncome, setUserIncome] = useState(null);
    const [regUserId, setRegUserId] = useState(null);
    const [authState, setAuthState] = useState(false);
    
    const userInfo = {
        userName,
        setUserName,
        userIncome,
        setUserIncome,
        regUserId,
        setRegUserId,
        authState,
        setAuthState,
    }

    return (
    <UserContext.Provider value={userInfo}>
        {props.children}
    </UserContext.Provider>
    )
}

export default UserContextProvider;