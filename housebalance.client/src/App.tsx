import { Routes, Route } from "react-router-dom";
import Layout from "./Layout";
import Pessoas from "./Pages/Pessoas";
import Categorias from "./Pages/Categorias";
import Transacoes from "./Pages/Transacoes";
import Dashboard from "./Pages/Dashboard";

export default function App() {
    return (
        <Routes>
            <Route path="/" element={<Layout />}>
                <Route index element={<Pessoas />} />
                <Route path="categorias" element={<Categorias />} />
                <Route path="transacoes" element={<Transacoes />} />
                <Route path="dashboard" element={<Dashboard />} />
            </Route>
        </Routes>
    );
}