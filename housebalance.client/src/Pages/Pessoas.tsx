import DeleteIcon from "@mui/icons-material/Delete";
import {
    Box,
    Button,
    Card,
    CardContent,
    Container,
    Divider,
    IconButton,
    List,
    ListItem,
    ListItemText,
    TextField,
    Typography,
} from "@mui/material";
import { useEffect, useState } from "react";
import { api } from "../Api";

import "../styles/Layout.css";
import "../styles/FormListPage.css";

export default function Pessoas() {
    const [nome, setNome] = useState("");
    const [idade, setIdade] = useState<number>(0);
    const [lista, setLista] = useState<any[]>([]);

    const carregar = async () => {
        try {
            const res = await api.get("/pessoas");
            setLista(res.data);
        } catch {
            alert("Erro ao carregar pessoas");
        }
    };

    useEffect(() => {
        carregar();
    }, []);

    const salvar = async () => {
        if (!nome || idade <= 0)
            return alert("Preencha os dados corretamente!");

        try {
            await api.post("/pessoas", { Nome: nome, Idade: idade });
            setNome("");
            setIdade(0);
            carregar();
        } catch {
            alert("Erro ao salvar pessoa");
        }
    };

    const deletar = async (id: number) => {
        try {
            await api.delete(`/pessoas/${id}`);
            carregar();
        } catch {
            alert("Erro ao deletar pessoa");
        }
    };

    return (
        <Container className="main-container" maxWidth="lg">
            <h1 className="page-title">Gerenciamento de Pessoas</h1>

            <div className="page-content">

                <div className="form-card">
                    <Card elevation={4}>
                        <CardContent>
                            <Typography variant="h6" gutterBottom>
                                Cadastrar Pessoa
                            </Typography>

                            <TextField
                                label="Nome"
                                fullWidth
                                margin="normal"
                                value={nome}
                                onChange={e => setNome(e.target.value)}
                            />

                            <TextField
                                label="Idade"
                                type="number"
                                fullWidth
                                margin="normal"
                                value={idade || ""}
                                onChange={e => setIdade(Number(e.target.value))}
                            />

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
                    <Card elevation={4}>
                        <CardContent>
                            <Typography variant="h6" gutterBottom>
                                Pessoas Cadastradas
                            </Typography>

                            {lista.length === 0 ? (
                                <Typography color="text.secondary">
                                    Nenhuma pessoa cadastrada ainda.
                                </Typography>
                            ) : (
                                <List>
                                    {lista.map(p => (
                                        <Box key={p.id}>
                                            <ListItem
                                                secondaryAction={
                                                    <IconButton
                                                        color="error"
                                                        onClick={() => deletar(p.id)}>
                                                        <DeleteIcon />
                                                    </IconButton>
                                                }
                                            >
                                                <ListItemText
                                                    primary={p.nome}
                                                    secondary={`Idade: ${p.idade} anos`}
                                                />
                                            </ListItem>
                                            <Divider />
                                        </Box>
                                    ))}
                                </List>
                            )}
                        </CardContent>
                    </Card>
                </div>

            </div>
        </Container>
    );
}