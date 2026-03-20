import React, { useState, useRef, useEffect, useContext } from 'react';
import {
    Button, Dialog, DialogTitle, DialogContent, DialogActions,
    TextField, Typography, Stack, Popover, List, ListItem,
    ListItemText, ListItemAvatar, Avatar, Chip, Box,
    ListItemButton
} from '@mui/material';
import { PersonAdd, Search, Close } from '@mui/icons-material';
import useDebounce from '../../../../hooks/use-debounce';
import { service } from '../../../../service';
import { ToastContext } from '../../../../components/toast/messageContetx';
import { ToastType } from '../../../../components/toast/notification';

export type SearchUser = {
    id: number,
    name: string,
    email: string
}

export const AddMemberButton = ({ project_id }: { project_id: number }) => {
    const [open, setOpen] = useState(false);
    const [searchTerm, setSearchTerm] = useState('');
    const [selectedUsers, setSelectedUsers] = useState<SearchUser[]>([]);
    const [anchorEl, setAnchorEl] = useState<HTMLDivElement | null>(null);
    const [searchUsers, setSearchUsers] = useState<SearchUser[]>([])
    const searchRef = useRef<HTMLDivElement>(null);
    const debounceEmail = useDebounce(searchTerm, 500)
    const toastContext = useContext(ToastContext)

    const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const value = e.target.value;
        setSearchTerm(value);
        setAnchorEl(value.length > 0 ? searchRef.current : null);
    };

    const handleSelectUser = (user: any) => {
        if (!selectedUsers.find(u => u.id === user.id)) {
            setSelectedUsers([...selectedUsers, user]);
        }
        setSearchTerm('');
        setAnchorEl(null);
    };

    const handleRemoveUser = (userId: number) => {
        setSelectedUsers(selectedUsers.filter(u => u.id !== userId));
    };

    const handleClose = () => {
        setOpen(false);
        setSearchTerm('');
        setSelectedUsers([]);
        setAnchorEl(null);
    };

    useEffect(() => {
        if (debounceEmail) {
            service.userService.getUsersByEmail(debounceEmail)
                .then(res => setSearchUsers(res))
                .catch(e => {
                    setSearchUsers([])
                    toastContext?.dispatcher({ message: e, type: ToastType.ERROR })
                })
        }
    }, [debounceEmail])

    function handleAdd(): void {
        console.log("WHY")
        service.projectService.createInvites(project_id, selectedUsers.map(item => item.id))
            .then(() => toastContext?.dispatcher({ message: "Invitation sent", type: ToastType.SUCCESS }))
            .catch(e => toastContext?.dispatcher({ message: e, type: ToastType.ERROR }))
    }

    return (
        <>
            <Button
                variant="outlined"
                startIcon={<PersonAdd />}
                onClick={() => setOpen(true)}
                fullWidth
                sx={{
                    color: '#323130',
                    borderColor: '#edebe9',
                    textTransform: 'none',
                    fontWeight: 600,
                    justifyContent: 'flex-start',
                    px: 2,
                    '&:hover': { bgcolor: '#f3f2f1', borderColor: '#c8c6c4' }
                }}
            >
                Add Member
            </Button>

            <Dialog open={open} onClose={handleClose} maxWidth="sm" fullWidth>
                <DialogTitle sx={{ fontWeight: 700, borderBottom: '1px solid #edebe9' }}>
                    Add Members
                </DialogTitle>

                <DialogContent sx={{ mt: 2, minHeight: '300px' }}>
                    <Stack spacing={2} sx={{ pt: 1 }}>

                        {/* Search Field Anchor */}
                        <Box ref={searchRef}>
                            <TextField
                                label="Search by name or email"
                                fullWidth
                                size="small"
                                autoComplete="off"
                                value={searchTerm}
                                onChange={handleSearchChange}
                                InputProps={{
                                    startAdornment: <Search sx={{ color: 'text.secondary', mr: 1 }} />
                                }}
                            />
                        </Box>

                        {/* Selected Users List */}
                        <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1, mt: 1 }}>
                            {selectedUsers.map((user) => (
                                <Chip
                                    key={user.id}
                                    label={user.name}
                                    onDelete={() => handleRemoveUser(user.id)}
                                    deleteIcon={<Close sx={{ fontSize: '14px !important' }} />}
                                    sx={{
                                        bgcolor: '#eff6fc',
                                        color: '#0078d4',
                                        fontWeight: 600,
                                        borderRadius: '4px'
                                    }}
                                />
                            ))}
                        </Box>

                        {/* Popover for Search Results */}
                        <Popover
                            open={Boolean(anchorEl)}
                            anchorEl={anchorEl}
                            onClose={() => setAnchorEl(null)}
                            disableAutoFocus
                            disableEnforceFocus
                            anchorOrigin={{ vertical: 'bottom', horizontal: 'left' }}
                            PaperProps={{
                                sx: {
                                    width: searchRef.current?.clientWidth, // Matches width of search field
                                    mt: 0.5,
                                    boxShadow: '0px 4px 12px rgba(0,0,0,0.1)'
                                }
                            }}
                        >
                            <List sx={{ p: 0 }}>
                                {searchUsers.map((user) => (
                                    <ListItem
                                        key={user.id}
                                        onClick={() => handleSelectUser(user)}
                                        sx={{ '&:hover': { bgcolor: '#f3f2f1' } }}
                                    >
                                        <ListItemButton>
                                            <ListItemAvatar>
                                                <Avatar sx={{ width: 32, height: 32, bgcolor: '#0078d4', fontSize: '0.8rem' }}>
                                                    {user.name.charAt(0)}
                                                </Avatar>
                                            </ListItemAvatar>
                                            <ListItemText
                                                primary={<Typography variant="body2" sx={{ fontWeight: 600 }}>{user.name}</Typography>}
                                                secondary={user.email}
                                                secondaryTypographyProps={{ sx: { fontSize: '0.75rem' } }}
                                            />
                                        </ListItemButton>
                                    </ListItem>
                                ))}
                            </List>
                        </Popover>
                    </Stack>
                </DialogContent>

                <DialogActions sx={{ p: 2, borderTop: '1px solid #edebe9' }}>
                    <Button onClick={handleClose} sx={{ color: 'text.secondary', textTransform: 'none' }}>
                        Cancel
                    </Button>
                    <Button
                        variant="contained"
                        onClick={handleAdd}
                        disabled={selectedUsers.length === 0}
                        sx={{ bgcolor: '#0078d4', textTransform: 'none', boxShadow: 'none' }}
                    >
                        Add {selectedUsers.length > 0 ? `(${selectedUsers.length})` : ''} Members
                    </Button>
                </DialogActions>
            </Dialog>
        </>
    );
};