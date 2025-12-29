import { Link, Outlet, useLocation } from "react-router-dom";
import {
    Drawer,
    List,
    ListItemButton,
    ListItemText,
    Box,
    Toolbar,
    AppBar,
    Typography
} from "@mui/material";

interface MenuItem {
    text: string;
    path: string;
}

const menu: MenuItem[] = [
    { text: "Pessoas", path: "/" },
    { text: "Categorias", path: "/categorias" },
    { text: "Transações", path: "/transacoes" },
    { text: "Dashboard", path: "/dashboard" }
];

export default function Layout() {
    const location = useLocation();

    return (
        <Box sx={{ display: "flex" }}>
            <AppBar className="main-container" position="fixed">
                <Toolbar>
                    <Typography className="page-title" variant="h6">HouseBalance</Typography>
                </Toolbar>
            </AppBar>

            <Drawer variant="permanent" sx={{ width: 240 }}>
                <Toolbar />
                <List>
                    {menu.map(item => (
                        <ListItemButton
                            key={item.path}
                            component={Link}
                            to={item.path}
                            selected={location.pathname === item.path}
                        >
                            <ListItemText primary={item.text} />
                        </ListItemButton>
                    ))}
                </List>
            </Drawer>

            <Box component="main" sx={{ flexGrow: 1, ml: 30, mt: 8, p: 2 }}>
                <Outlet />
            </Box>
        </Box>
    );
}
