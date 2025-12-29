import { useEffect, useState } from "react";
import { api } from "../Api";
import {
    Card, CardContent, Typography, Table,
    TableHead, TableRow, TableCell, TableBody, Box, Container
} from "@mui/material";

import {
    PieChart, Pie, Cell, Tooltip, Legend,
    BarChart, Bar, XAxis, YAxis, CartesianGrid,
} from "recharts";

import "../styles/Dashboard.css";
import "../styles/Layout.css";

interface PessoaTotais {
    pessoaId: number;
    pessoa: string;
    totalReceitas: number;
    totalDespesas: number;
    saldo: number;
}

interface CategoriaTotais {
    categoriaId: number;
    categoria: string;
    totalReceitas: number;
    totalDespesas: number;
    saldo: number;
}

interface Wrapper<T> {
    itens: T[];
    totalReceitas: number;
    totalDespesas: number;
    saldo: number;
}

export default function Dashboard() {
    const [pessoas, setPessoas] = useState<Wrapper<PessoaTotais>>();
    const [categorias, setCategorias] = useState<Wrapper<CategoriaTotais>>();

    const carregar = async () => {
        try {
            const p = await api.get<Wrapper<PessoaTotais>>("/pessoas/totais");
            const c = await api.get<Wrapper<CategoriaTotais>>("/categorias/totais");

            setPessoas(p.data);
            setCategorias(c.data);
        }
        catch {
            alert("Erro ao carregar DashBoard");
        }
    };

    useEffect(() => {
        carregar();
    }, []);

    const saldoPorPessoa = (pessoas?.itens ?? []).map(p => ({
        ...p,
        valorAbsoluto: Math.abs(p.saldo),
        positivo: p.saldo >= 0
    }));

    return (
        <Container maxWidth="lg" className="dashboard-container">
            <Typography className="page-title">
                Dashboard Financeiro
            </Typography>

            <div className="dashboard-cards">

                <Card className="dashboard-card" elevation={4}>
                    <CardContent>
                        <Typography variant="h6">Total Receitas</Typography>
                        <Typography variant="h4" color="green">
                            R$ {pessoas?.totalReceitas?.toFixed(2) ?? 0}
                        </Typography>
                    </CardContent>
                </Card>

                <Card className="dashboard-card" elevation={4}>
                    <CardContent>
                        <Typography variant="h6">Total Despesas</Typography>
                        <Typography variant="h4" color="red">
                            R$ {pessoas?.totalDespesas?.toFixed(2) ?? 0}
                        </Typography>
                    </CardContent>
                </Card>

                <Card className="dashboard-card" elevation={4}>
                    <CardContent>
                        <Typography variant="h6">Saldo Geral</Typography>
                        <Typography variant="h4" color="primary">
                            R$ {pessoas?.saldo?.toFixed(2) ?? 0}
                        </Typography>
                    </CardContent>
                </Card>

            </div>

            <div className="dashboard-charts">
                <h2 className="chart-title">Saldo por Pessoa</h2>

                <PieChart width={450} height={320}>
                    <Pie
                        data={saldoPorPessoa}
                        dataKey="valorAbsoluto"
                        nameKey="pessoa"
                        cx="50%"
                        cy="50%"
                        outerRadius={110}
                        label={(item: any) => `${item.pessoa}: R$ ${item.saldo}`}
                    >
                        {saldoPorPessoa.map((p, i) => (
                            <Cell
                                key={i}
                                fill={p.positivo ? "#4caf50" : "#f44336"}
                            />
                        ))}
                    </Pie>

                    <Tooltip
                        formatter={(value: number, _name, item: any) =>
                            [`R$ ${item.payload.saldo}`, "Saldo"]
                        }
                    />

                    <Legend />
                </PieChart>
            </div>

            <div className="dashboard-charts">
                <h2 className="chart-title">
                    Receitas x Despesas por Categoria
                </h2>

                <BarChart width={720} height={350} data={categorias?.itens ?? []}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="categoria" />
                    <YAxis />
                    <Tooltip />
                    <Legend />
                    <Bar dataKey="totalReceitas" fill="#4caf50" name="Receitas" />
                    <Bar dataKey="totalDespesas" fill="#f44336" name="Despesas" />
                </BarChart>
            </div>

            {/* TABELA PESSOAS */}
            <h2 className="chart-title">
                Totais por Pessoa
            </h2>

            <Table className="dashboard-table">
                <TableHead>
                    <TableRow>
                        <TableCell>Pessoa</TableCell>
                        <TableCell>Receitas</TableCell>
                        <TableCell>Despesas</TableCell>
                        <TableCell>Saldo</TableCell>
                    </TableRow>
                </TableHead>

                <TableBody>
                    {pessoas?.itens.map(p => (
                        <TableRow key={p.pessoaId}>
                            <TableCell>{p.pessoa}</TableCell>
                            <TableCell>R$ {p.totalReceitas.toFixed(2)}</TableCell>
                            <TableCell>R$ {p.totalDespesas.toFixed(2)}</TableCell>
                            <TableCell>R$ {p.saldo.toFixed(2)}</TableCell>
                        </TableRow>
                    ))}
                </TableBody>
            </Table>

            <h2 className="chart-title">
                Totais por Categoria
            </h2>

            <Table className="dashboard-table">
                <TableHead>
                    <TableRow>
                        <TableCell>Categoria</TableCell>
                        <TableCell>Receitas</TableCell>
                        <TableCell>Despesas</TableCell>
                        <TableCell>Saldo</TableCell>
                    </TableRow>
                </TableHead>

                <TableBody>
                    {categorias?.itens.map(c => (
                        <TableRow key={c.categoriaId}>
                            <TableCell>{c.categoria}</TableCell>
                            <TableCell>R$ {c.totalReceitas.toFixed(2)}</TableCell>
                            <TableCell>R$ {c.totalDespesas.toFixed(2)}</TableCell>
                            <TableCell>R$ {c.saldo.toFixed(2)}</TableCell>
                        </TableRow>
                    ))}
                </TableBody>
            </Table>

            <Box mt={6} />

        </Container>
    );
}
