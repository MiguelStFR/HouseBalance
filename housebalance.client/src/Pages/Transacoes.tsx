import { useEffect, useState } from "react";
import { api } from "../Api";
import {
    Container,
    Card,
    CardContent,
    Typography,
    TextField,
    Button,
    List,
    ListItem,
    ListItemText,
    Divider,
    Box,
    IconButton
} from "@mui/material";
import DeleteIcon from "@mui/icons-material/Delete";

import "../styles/Layout.css";
import "../styles/FormListPage.css";

interface Pessoa {
    id: number;
    nome: string;
}

interface Categoria {
    id: number;
    descricao: string;
}

interface Transacao {
    id: number;
    descricao: string;
    valor: number;
    tipo: "despesa" | "receita";
    pessoa: string;
    categoria: string;
}

export default function Transacoes() {
    const [descricao, setDescricao] = useState("");
    const [valor, setValor] = useState<number>(0);
    const [tipo, setTipo] = useState<"despesa" | "receita">("despesa");
    const [pessoaId, setPessoaId] = useState<number>(0);
    const [categoriaId, setCategoriaId] = useState<number>(0);

    const [pessoas, setPessoas] = useState<Pessoa[]>([]);
    const [categorias, setCategorias] = useState<Categoria[]>([]);
    const [lista, setLista] = useState<Transacao[]>([]);

    const carregar = async () => {
        try {
            setPessoas((await api.get<Pessoa[]>("/pessoas")).data);
            setCategorias((await api.get<Categoria[]>("/categorias")).data);
            setLista((await api.get<Transacao[]>("/transacoes")).data);
        }
        catch {
            alert("Erro ao carregar dados");
        }
    };

    useEffect(() => {
        carregar();
    }, []);

    const deletar = async (id: number) => {
        if (!confirm("Excluir transação?"))
            return;

        try {
            await api.delete(`/transacoes/${id}`);
            carregar();
        }
        catch {
            alert("Erro ao excluir transação");
        }
    };

    const salvar = async () => {
        if (!descricao || valor <= 0 || !pessoaId || !categoriaId)
            return alert("Preencha os dados corretamente!");

        try {
            await api.post("/transacoes", {
                Descricao: descricao,
                Valor: valor,
                Tipo: tipo,
                PessoaId: pessoaId,
                CategoriaId: categoriaId
            });

            setDescricao("");
            setValor(0);
            carregar();
        }
        catch (e: any) {
            const msg = e.response?.data?.message
                ?? e.response?.data
                ?? "Erro ao salvar transação";

            alert(msg);
        }
    };

    return (
        <Container className="main-container" maxWidth="lg">
            <h1 className="page-title">Transações</h1>

            <div className="page-content">

                <div className="form-card">
                    <Card>
                        <CardContent>
                            <Typography variant="h6">Nova Transação</Typography>

                            <TextField
                                label="Descrição"
                                fullWidth
                                margin="normal"
                                value={descricao}
                                onChange={e => setDescricao(e.target.value)}
                            />

                            <TextField
                                label="Valor"
                                type="number"
                                fullWidth
                                margin="normal"
                                value={valor}
                                onChange={e => setValor(Number(e.target.value))}
                            />

                            <TextField
                                select
                                SelectProps={{ native: true }}
                                label="Tipo"
                                fullWidth
                                margin="normal"
                                value={tipo}
                                onChange={e => setTipo(e.target.value as "despesa" | "receita")}
                            >
                                <option value="despesa">Despesa</option>
                                <option value="receita">Receita</option>
                            </TextField>

                            <TextField
                                select
                                SelectProps={{ native: true }}
                                label="Pessoa"
                                fullWidth
                                margin="normal"
                                value={pessoaId}
                                onChange={e => setPessoaId(Number(e.target.value))}
                            >
                                <option value={0}>Selecione</option>
                                {pessoas.map(p => (
                                    <option key={p.id} value={p.id}>{p.nome}</option>
                                ))}
                            </TextField>

                            <TextField
                                select
                                SelectProps={{ native: true }}
                                label="Categoria"
                                fullWidth
                                margin="normal"
                                value={categoriaId}
                                onChange={e => setCategoriaId(Number(e.target.value))}
                            >
                                <option value={0}>Selecione</option>
                                {categorias.map(c => (
                                    <option key={c.id} value={c.id}>{c.descricao}</option>
                                ))}
                            </TextField>

                            <Button
                                fullWidth
                                variant="contained"
                                sx={{ mt: 2 }}
                                onClick={salvar}
                            >
                                Salvar
                            </Button>
                        </CardContent>
                    </Card>
                </div>

                <div className="list-card">
                    <Card>
                        <CardContent>
                            <Typography variant="h6">Histórico</Typography>

                            <List>
                                {lista.map(t => (
                                    <Box key={t.id}>
                                        <ListItem
                                            secondaryAction={
                                                <IconButton
                                                    color="error"
                                                    onClick={() => deletar(t.id)}
                                                >
                                                    <DeleteIcon />
                                                </IconButton>
                                            }
                                        >
                                            <ListItemText
                                                primary={`${t.descricao} - ${t.tipo.toUpperCase()} R$ ${t.valor}`}
                                                secondary={`Pessoa: ${t.pessoa} | Categoria: ${t.categoria}`}
                                            />
                                        </ListItem>
                                        <Divider />
                                    </Box>
                                ))}
                            </List>
                        </CardContent>
                    </Card>
                </div>
            </div>
        </Container>
    );
}