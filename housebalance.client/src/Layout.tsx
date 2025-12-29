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

import "./styles/Layout.css";
import "./styles/Sidebar.css";

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

const drawerWidth = 240;

export default function Layout() {
    const location = useLocation();

    return (
        <Box sx={{ display: "flex" }}>
            <AppBar
                className="topbar"
                position="fixed"
                sx={{
                    zIndex: 1300
                }}
            >
                <Toolbar>
                    <Typography className="page-title" variant="h6" sx={{ fontWeight: "bold" }}>
                        HouseBalance
                    </Typography>
                </Toolbar>
            </AppBar>

            <Drawer
                variant="permanent"
                sx={{
                    width: 240,
                    '& .MuiDrawer-paper': {
                        width: 240,
                        background: '#0b3c8c',
                        color: 'white'
                    }
                }}
            >
                <Toolbar />
                <List>
                    {menu.map(item => (
                        <ListItemButton
                            key={item.path}
                            component={Link}
                            to={item.path}
                            selected={location.pathname === item.path}
                            sx={{
                                '&.Mui-selected': {
                                    background: '#1565c0 !important'
                                },
                                '&:hover': {
                                    background: '#1e88e5'
                                },
                                color: 'white'
                            }}
                        >
                            <ListItemText primary={item.text} />
                        </ListItemButton>
                    ))}
                </List>
            </Drawer>


            <Box
                component="main"
                sx={{ flexGrow: 1, ml: `${drawerWidth}px`, mt: 8 }}
            >
                <Outlet />
            </Box>
        </Box>
    );
}
