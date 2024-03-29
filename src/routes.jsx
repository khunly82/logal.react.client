import Articles from "./pages/articles";
import Login from "./pages/login";

const routes = [
    { path: '/login', element: <Login/> },
    { path: '/', element: <Articles /> }
]

export default routes;