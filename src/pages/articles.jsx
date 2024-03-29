import { useContext, useEffect, useState } from "react";
import useGuard from "../hooks/guard";
import { useRecoilState } from "recoil";
import sessionState from "../state/sessionState";
import { Button, Dialog, DialogActions, DialogContent, Table, TableBody, TableCell, TableHead, TableRow, TextField } from "@mui/material";
import { HubConnection } from "@microsoft/signalr";
import { HubContext } from "../context/hubContext";


const Articles = () => {
    useGuard();

    const [movies, setMovies] = useState([]);
    const [session] = useRecoilState(sessionState);
    const [selectedMovie, setSelectedMovie] = useState(null);
    const [editOpen, setEditOpen] = useState(false);

    const connection = useContext(HubContext);

    const edit = (m) => {
        setSelectedMovie(m);
        setEditOpen(true);
        connection.current?.send("update", {
            collection: "movies",
            updatedItem: m._id,
            isUpdating: true,
        });
    } 

    const closeDialog = () => {
        setEditOpen(false);
        connection.current?.send("update", {
            collection: "movies",
            updatedItem: selectedMovie._id,
            isUpdating: false,
        });
    }

    const save = async () => {
        await fetch('http://localhost:5100/ClientA/Method2/' + selectedMovie._id, {
            method: 'PUT',
            body: JSON.stringify(selectedMovie),
            headers: {
                Authorization: 'Bearer ' + session,
                "content-type": "application/json"
            }
        })
        closeDialog();
        setMovies(movies => 
            movies.map(m => {
                if(m._id === selectedMovie._id)
                    return selectedMovie;
                return m;
            })
        )
    }

    useEffect(async () => {
        const resonse = await fetch('http://localhost:5100/clientA/method1', {
            headers: { Authorization: 'Bearer ' + session }
        });
        const movies = await resonse.json();
        setMovies(movies);

        connection.current?.on('lock_movies', data => {
            setMovies(movies => movies.map(m => {
                if(m._id === data.updatedItem) {
                    return { ...m, lock: data.isUpdating }
                }
                return m;
            }))
        });
    }, [])

    return <> 
    <Table>
        <TableHead>
            <TableRow>
                <TableCell>Id</TableCell>
                <TableCell>Titre</TableCell>
                <TableCell>Rating</TableCell>
                <TableCell>Actions</TableCell>
            </TableRow>
        </TableHead>
        <TableBody>
            { movies.map(m => <TableRow key={m.title}>
                <TableCell>{m._id}</TableCell>
                <TableCell>{m.title}</TableCell>
                <TableCell>{m.rating}</TableCell>
                <TableCell>
                    <Button disabled={!!m.lock} onClick={() => edit(m)}>Edit</Button>
                </TableCell>
            </TableRow>) }
        </TableBody>
    </Table>

    <Dialog open={editOpen}>
        <DialogContent>
            <div>
                <TextField label="Titre"
                           value={selectedMovie?.title}
                           onChange={({target}) => setSelectedMovie(m => ({...m, title: target.value}))}></TextField>
            </div>
            <div>
                <TextField label="Rating"
                           value={selectedMovie?.rating}
                           onChange={({target}) => setSelectedMovie(m => ({...m, rating: target.value}))}></TextField>
            </div>
        </DialogContent>
        <DialogActions>
            <Button onClick={closeDialog}>Cancel</Button>
            <Button onClick={save}>Save</Button>
        </DialogActions>
    </Dialog>
    </>
}

export default Articles;