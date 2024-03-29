import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useRecoilState } from "recoil";
import sessionState from "../state/sessionState";

const useGuard = () => {
    const navigate = useNavigate();
    const [session] = useRecoilState(sessionState)

    useEffect(() => {
        if(!session) {
            navigate('/login');
        }
    }, [])
}


export default useGuard;