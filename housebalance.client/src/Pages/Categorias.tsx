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

export interface Categoria {
    id: number;
    descricao: string;
    finalidade: "despesa" | "receita" | "ambas";
}

export default function Categorias() {
    const [descricao, setDescricao] = useState("");
    const [finalidade, setFinalidade] =
        useState<Categoria["finalidade"]>("despesa");
    const [lista, setLista] = useState<Categoria[]>([]);

    const carregar = async () => {
        try {
            const r = await api.get<Categoria[]>("/categorias");
            setLista(r.data);
        }
        catch {
            alert("Erro ao carregar categorias");
        }
    };

    useEffect(() => {
        carregar();
    }, []);

    const deletar = async (id: number) => {
        try {
            if (!confirm("Deseja realmente excluir?")) return;

            await api.delete(`/categorias/${id}`);
            carregar();
        }
        catch {
            alert("Erro ao excluir categoria");
        }
    };

    const salvar = async () => {
        if (!descricao)
            return alert("Informe a descrição");

        try {
            await api.post("/categorias", {
                Descricao: descricao,
                Finalidade: finalidade
            });

            setDescricao("");
            setFinalidade("despesa");
            carregar();
        }
        catch {
            alert("Erro ao salvar categoria");
        }
    };

    return (
        <Container className="main-container" maxWidth="lg">
            <h1 className="page-title">Cadastro de Categorias</h1>

            <div className="page-content">

                <div className="form-card">
                    <Card>
                        <CardContent>
                            <Typography variant="h6">Nova Categoria</Typography>

                            <TextField
                                label="Descrição"
                                fullWidth
                                margin="normal"
                                value={descricao}
                                onChange={e => setDescricao(e.target.value)}
                            />

                            <TextField
                                select
                                SelectProps={{ native: true }}
                                label="Finalidade"
                                fullWidth
                                margin="normal"
                                value={finalidade}
                                onChange={e =>
                                    setFinalidade(e.target.value as Categoria["finalidade"])
                                }
                            >
                                <option value="despesa">Despesa</option>
                                <option value="receita">Receita</option>
                                <option value="ambas">Ambas</option>
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
                            <Typography variant="h6">Categorias</Typography>

                            <List>
                                {lista.map(c => (
                                    <Box key={c.id}>
                                        <ListItem
                                            secondaryAction={
                                                <IconButton
                                                    color="error"
                                                    onClick={() => deletar(c.id)}
                                                >
                                                    <DeleteIcon />
                                                </IconButton>
                                            }
                                        >
                                            <ListItemText
                                                primary={c.descricao}
                                                secondary={`Finalidade: ${c.finalidade}`}
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
