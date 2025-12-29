import { useEffect, useState } from "react";
import { api } from "../Api";
import {
    Card, CardContent, Typography, Grid, Container, Table,
    TableHead, TableRow, TableCell, TableBody, Box
} from "@mui/material";

import {
    PieChart, Pie, Cell, Tooltip, Legend,
    BarChart, Bar, XAxis, YAxis, CartesianGrid,
} from "recharts";

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
        try
        {
            const p = await api.get<Wrapper<PessoaTotais>>("/pessoas/totais");
            const c = await api.get<Wrapper<CategoriaTotais>>("/categorias/totais");

            setPessoas(p.data);
            setCategorias(c.data);
        }
        catch (e)
        {
            console.error("Erro ao carregar DashBoard", e);
            alert("Erro ao carregar DashBoard");
        }
    };

    useEffect(() => {
        carregar();
    }, []);

    const CORES = ["#4caf50", "#2196f3", "#f44336", "#ff9800", "#9c27b0"];

    const saldoPorPessoa = (pessoas?.itens ?? []).map(p => ({
        ...p,
        valorAbsoluto: Math.abs(p.saldo),
        positivo: p.saldo >= 0
    }));

    return (
        <Container maxWidth="lg">
            <Typography variant="h4" gutterBottom>
                Dashboard Financeiro
            </Typography>

            <Grid container spacing={3}>
                <Grid item xs={12} md={4}>
                    <Card>
                        <CardContent>
                            <Typography variant="h6">Total Receitas</Typography>
                            <Typography variant="h4" color="green">
                                R$ {pessoas?.totalReceitas?.toFixed(2) ?? 0}
                            </Typography>
                        </CardContent>
                    </Card>
                </Grid>

                <Grid item xs={12} md={4}>
                    <Card>
                        <CardContent>
                            <Typography variant="h6">Total Despesas</Typography>
                            <Typography variant="h4" color="red">
                                R$ {pessoas?.totalDespesas?.toFixed(2) ?? 0}
                            </Typography>
                        </CardContent>
                    </Card>
                </Grid>

                <Grid item xs={12} md={4}>
                    <Card>
                        <CardContent>
                            <Typography variant="h6">Saldo Geral</Typography>
                            <Typography variant="h4" color="primary">
                                R$ {pessoas?.saldo?.toFixed(2) ?? 0}
                            </Typography>
                        </CardContent>
                    </Card>
                </Grid>
            </Grid>

            <Box mt={4} />

            <Typography variant="h5" gutterBottom>
                Saldo por Pessoa
            </Typography>

            <PieChart width={450} height={300}>
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

            <Box mt={4} />

            <Typography variant="h5" gutterBottom>
                Receitas x Despesas por Categoria
            </Typography>

            <BarChart width={700} height={350} data={categorias?.itens ?? []}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="categoria" />
                <YAxis />
                <Tooltip />
                <Legend />
                <Bar dataKey="totalReceitas" fill="#4caf50" name="Receitas" />
                <Bar dataKey="totalDespesas" fill="#f44336" name="Despesas" />
            </BarChart>

            <Box mt={4} />

            <Typography variant="h5" gutterBottom>
                Totais por Pessoa
            </Typography>

            <Table>
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

            <Box mt={4} />

            <Typography variant="h5" gutterBottom>
                Totais por Categoria
            </Typography>

            <Table>
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
        </Container>
    );
}
