import { Button, Card, CardActions, CardContent, TextField } from "@mui/material";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useRecoilState } from "recoil";
import sessionState from "../state/sessionState";


const Login = () => {

    const navigate = useNavigate();

    const [values, setValues] = useState({
        DatabaseName: 'logalMovies1',
        Username: '',
        Password: ''
    })

    const [session, setSession] = useRecoilState(sessionState);

    const login = async () => {
        const response = await fetch('http://localhost:5100/api/auth', { 
            method: 'POST',
            headers: { "content-type": 'application/json' },
            body: JSON.stringify(values),
        });
        const data = await response.json();

        if(data.Token) {
            setSession(data.Token)
            navigate('/');
        }
    }

    return <Card>
        <CardContent>
            <div>
                <TextField label="Client" 
                           value={'logalMovies1'}
                           onChange={({target}) => setValues(v => ({...v, DatabaseName: target.value}))}></TextField>
            </div>
            <div>
                <TextField label="Nom"
                           onChange={({target}) => setValues(v => ({...v, Username: target.value}))}></TextField>
            </div>
            <div>
                <TextField label="mot de passe" type="password"
                           onChange={({target}) => setValues(v => ({...v, Password: target.value}))}></TextField>
            </div>
        </CardContent>
        <CardActions>
            <Button type="submit" onClick={login}>Se Connecter</Button>
        </CardActions>
    </Card>
}

export default Login;

