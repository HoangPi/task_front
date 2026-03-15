import React, { useState } from 'react';
import {
    Box,
    Typography,
    Table,
    TableBody,
    TableCell,
    TableContainer,
    TableHead,
    TableRow,
    IconButton,
    Button,
    Breadcrumbs,
    Link,
    TextField,
    InputAdornment,
    Avatar,
    Chip,
    Stack,
    Collapse,
} from '@mui/material';
import {
    Add,
    FilterList,
    Search,
    KeyboardArrowRight,
    KeyboardArrowDown,
    MenuBook, // User Story Icon
    AssignmentTurnedIn, // Task Icon
    BugReport, // Bug Icon
    Settings,
} from '@mui/icons-material';

// Mock Data Structure
const backlogItems = [

    { id: 401, title: 'Authentication Module', type: 'User Story', state: 'New', assigned: 'JD', remaining: '12h', children: [] },
    { id: 402, title: 'Setup JWT Strategy', type: 'Task', state: 'Active', assigned: 'AS', remaining: '4h' },
    { id: 403, title: 'Database Schema for Users', type: 'Task', state: 'New', assigned: 'JD', remaining: '8h' },
    { id: 405, title: 'Fix Login CSS Glitch', type: 'Bug', state: 'Resolved', assigned: 'ME', remaining: '2h', children: [] },
    { id: 408, title: 'Navigation Refactor', type: 'User Story', state: 'New', assigned: 'JD', remaining: '20h', children: [] },
];

const TypeIcon = ({ type }: { type: 'User Story' | 'Bug' | string }) => {
    if (type === 'User Story') return <MenuBook sx={{ fontSize: 18, color: '#0078d4' }} />;
    if (type === 'Bug') return <BugReport sx={{ fontSize: 18, color: '#e81123' }} />;
    return <AssignmentTurnedIn sx={{ fontSize: 18, color: '#f2c80f' }} />;
};

export default function AzureBacklogPage() {
    const [openItems, setOpenItems] = useState({ 401: true });

    const toggleRow = (id: number) => {
        setOpenItems(prev => ({ ...prev, [id]: !prev[id] }));
    };

    return (
        <Box sx={{ display: 'flex', bgcolor: '#fff' }}>
            <Box component="main" sx={{ flexGrow: 1, p: 0 }}>
                {/* Breadcrumbs Area */}
                <Box sx={{ px: 3, pt: 2, pb: 1 }}>
                    <Breadcrumbs aria-label="breadcrumb" sx={{ fontSize: '0.85rem' }}>
                        <Link underline="hover" color="inherit" href="#">My Project</Link>
                        <Link underline="hover" color="inherit" href="#">Dev Team</Link>
                        <Typography color="text.primary" sx={{ fontSize: '0.85rem', fontWeight: 600 }}>Backlog</Typography>
                    </Breadcrumbs>
                </Box>

                {/* Toolbar */}
                <Stack direction="row" spacing={2} sx={{ px: 3, py: 1, alignItems: 'center', borderBottom: '1px solid #eaeaea' }}>
                    <Button variant="contained" startIcon={<Add />} size="small" sx={{ textTransform: 'none', bgcolor: '#0078d4' }}>
                        New Work Item
                    </Button>
                    <TextField
                        placeholder="Filter by keyword"
                        size="small"
                        variant="standard"
                        InputProps={{
                            startAdornment: (<InputAdornment position="start"><Search fontSize="small" /></InputAdornment>),
                            disableUnderline: true,
                            sx: { fontSize: '0.85rem', bgcolor: '#f3f2f1', px: 1, borderRadius: 1 }
                        }}
                    />
                    <IconButton size="small"><FilterList fontSize="small" /></IconButton>
                    <Box sx={{ flexGrow: 1 }} />
                    <IconButton size="small"><Settings fontSize="small" /></IconButton>
                </Stack>

                {/* Backlog Table */}
                <TableContainer>
                    <Table size="small" sx={{ '& .MuiTableCell-root': { py: 0.5, px: 1, fontSize: '0.85rem', borderBottom: '1px solid #f3f2f1' } }}>
                        <TableHead sx={{ bgcolor: '#faf9f8' }}>
                            <TableRow>
                                <TableCell sx={{ width: 60 }}>Order</TableCell>
                                <TableCell>Title</TableCell>
                                <TableCell sx={{ width: 120 }}>State</TableCell>
                                <TableCell sx={{ width: 150 }}>Assigned To</TableCell>
                                <TableCell sx={{ width: 100 }}>Remaining</TableCell>
                            </TableRow>
                        </TableHead>
                        <TableBody>
                            {backlogItems.map((item) => (
                                <React.Fragment key={item.id}>
                                    {/* Parent Row */}
                                    <TableRow hover>
                                        <TableCell>{item.id}</TableCell>
                                        <TableCell>
                                            <Stack direction="row" alignItems="center" spacing={1}>
                                                {/* <IconButton size="small" onClick={() => toggleRow(item.id)} sx={{ p: 0 }}>
                                                    {item.children.length > 0 ? (openItems[item.id] ? <KeyboardArrowDown /> : <KeyboardArrowRight />) : null}
                                                </IconButton> */}
                                                <TypeIcon type={item.type} />
                                                <Typography variant="body2" sx={{ fontWeight: 500, cursor: 'pointer', color: '#0078d4', '&:hover': { textDecoration: 'underline' } }}>
                                                    {item.title}
                                                </Typography>
                                            </Stack>
                                        </TableCell>
                                        <TableCell><Chip label={item.state} size="small" variant="outlined" sx={{ height: 20, fontSize: '0.7rem' }} /></TableCell>
                                        <TableCell>
                                            <Stack direction="row" spacing={1} alignItems="center">
                                                <Avatar sx={{ width: 20, height: 20, fontSize: 10 }}>{item.assigned}</Avatar>
                                                <Typography variant="caption">{item.assigned}</Typography>
                                            </Stack>
                                        </TableCell>
                                        <TableCell>{item.remaining}</TableCell>
                                    </TableRow>
                                </React.Fragment>
                            ))}
                        </TableBody>
                    </Table>
                </TableContainer>
            </Box>
        </Box>
    );
}