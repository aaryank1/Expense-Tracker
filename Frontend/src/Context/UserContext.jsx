import { createContext, useState } from "react";

export const UserContext = createContext();

const UserContextProvider = (props) => {

    const [userName, setUserName] = useState(null);
    const [userIncome, setUserIncome] = useState(null);
    const [regUserId, setRegUserId] = useState(null);
    
    const userInfo = {
        userName,
        setUserName,
        userIncome,
        setUserIncome,
        regUserId,
        setRegUserId
    }

    return (
    <UserContext.Provider value={userInfo}>
        {props.children}
    </UserContext.Provider>
    )
}

export default UserContextProvider;