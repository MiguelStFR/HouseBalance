import DeleteIcon from "@mui/icons-material/Delete";
import {
    Box,
    Button,
    Card,
    CardContent,
    Container,
    Divider,
    Grid,
    IconButton,
    List,
    ListItem,
    ListItemText,
    TextField,
    Typography,
} from "@mui/material";
import { useEffect, useState } from "react";
import { api } from "../Api";

export default function Pessoas() {
    const [nome, setNome] = useState("");
    const [idade, setIdade] = useState<number>(0);
    const [lista, setLista] = useState<any[]>([]);

    const carregar = async () => {
        try
        {
            const res = await api.get("/pessoas");
            setLista(res.data);
        }
        catch (e)
        {
            console.error("Erro ao carregar pessoas", e);
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
            await api.post("/pessoas", {
                Nome: nome,
                Idade: idade
            });

            setNome("");
            setIdade(0);
            carregar();
        }
        catch (e) {
            console.error("Erro ao salvar pessoa", e);
            alert("Erro ao salvar pessoa");
        }
    };

    const deletar = async (id: number) => {
        try
        {
            await api.delete(`/pessoas/${id}`);
            carregar();
        }
        catch (e)
        {
            console.error("Erro ao deletar pessoa", e);
            alert("Erro ao deletar pessoa");
        }
    };

    return (
        <Container maxWidth="md" sx={{ mt: 5 }}>
            <Typography variant="h4" fontWeight="bold" gutterBottom>
                Gerenciamento de Pessoas
            </Typography>

            <Grid container spacing={3}>
                {/* Formulário */}
                <Grid item xs={12} md={5}>
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
                                onChange={(e) => setNome(e.target.value)}
                            />

                            <TextField
                                label="Idade"
                                type="number"
                                fullWidth
                                margin="normal"
                                value={idade || ""}
                                onChange={(e) => setIdade(Number(e.target.value))}
                            />

                            <Button
                                fullWidth
                                variant="contained"
                                color="primary"
                                sx={{ mt: 2 }}
                                onClick={salvar}
                            >
                                Salvar
                            </Button>
                        </CardContent>
                    </Card>
                </Grid>

                {/* Lista */}
                <Grid item xs={12} md={7}>
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
                                    {lista.map((p) => (
                                        <Box key={p.id}>
                                            <ListItem
                                                secondaryAction={
                                                    <IconButton
                                                        edge="end"
                                                        color="error"
                                                        onClick={() => deletar(p.id)}>
                                                        <DeleteIcon/>
                                                    </IconButton>
                                                }
                                            >
                                                <ListItemText
                                                    primary={`${p.nome}`}
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
                </Grid>
            </Grid>
        </Container>
    );
}
