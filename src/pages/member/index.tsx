import { useContext, useEffect, useMemo, useState } from 'react';
import {
    Box,
    Typography,
    Card,
    Avatar,
    Stack,
    Divider,
    IconButton,
    Grid
} from '@mui/material';
import { ChevronLeft, ChevronRight } from '@mui/icons-material';
import { useAppSelector } from '../../redux/hook';
import { SelectedIndexContext } from '../project/selectItemContext';
import { service } from '../../service';
import { ToastContext } from '../../components/toast/messageContetx';
import { ToastType } from '../../components/toast/notification';

// --- Types & Mock Data ---
type Role = 'EM' | 'SM' | 'PO';

export interface MemberInfoWithRole {
    id: string; // Used as key, hidden from UI
    name: string;
    email: string;
    role: Role;
}

// --- Helper Component for individual member cards ---
const MemberCard = ({ member }: { member: MemberInfoWithRole }) => (
    <Card
        variant="outlined"
        sx={{
            display: 'flex',
            alignItems: 'center',
            p: 2,
            borderColor: '#edebe9',
            boxShadow: 'none',
            '&:hover': { boxShadow: '0 2px 8px rgba(0,0,0,0.05)' },
            transition: 'box-shadow 0.2s',
            height: '100%'
        }}
    >
        <Avatar sx={{ width: 40, height: 40, bgcolor: '#0078d4', fontSize: '1rem', fontWeight: 600, mr: 2 }}>
            {member.name.charAt(0)}
        </Avatar>
        <Box>
            <Typography variant="body2" sx={{ fontWeight: 700, color: '#323130' }}>
                {member.name}
            </Typography>
            <Typography variant="caption" sx={{ color: '#605e5c' }}>
                {member.email}
            </Typography>
        </Box>
    </Card>
);

export const MembersPage = () => {
    // Group members by role
    const projects = useAppSelector(state => state.projectStorage.projects)
    const projectIndex = useContext(SelectedIndexContext).value
    const [searchMembers, setSearchMembers] = useState<MemberInfoWithRole[]>([])
    const [searchManagers, setSearchManagers] = useState<MemberInfoWithRole[]>([])
    const productOwners = useMemo(() => {
        return searchManagers.filter(item => item.role === 'PO')
    }, [searchManagers]);
    const scrumMasters = useMemo(() => {
        return searchManagers.filter(item => item.role === 'SM')
    }, [searchManagers]);
    const toastContext = useContext(ToastContext)

    // Pagination state for EM role
    const [emPage, setEmPage] = useState(0);

    useEffect(() => {
        if (projects.length > 0 && projectIndex !== -1) {
            service.projectService.getMembersOfProject(projects[projectIndex].id, 'POSM', 0)
                .then(res => {
                    setSearchManagers(res)
                    return service.projectService.getMembersOfProject(projects[projectIndex].id, 'EM', 0)
                })
                .then(res => setSearchMembers(res))
                .catch(e => toastContext?.dispatcher({ message: e, type: ToastType.ERROR }))
        }
    }, [projectIndex])

    return (
        <Box sx={{ p: 4, maxWidth: 1200, mx: 'auto', bgcolor: '#fff', minHeight: '100vh' }}>

            <Typography variant="h5" sx={{ fontWeight: 700, mb: 1, color: '#323130' }}>
                Project Members
            </Typography>
            <Typography variant="body2" sx={{ color: 'text.secondary', mb: 4 }}>
                Manage and view the roles of everyone in this project.
            </Typography>

            <Stack spacing={5}>

                {/* --- Product Owner Section --- */}
                <Box>
                    <Typography variant="subtitle1" sx={{ fontWeight: 700, mb: 2, color: '#323130' }}>
                        Product Owner (PO)
                    </Typography>
                    <Grid container spacing={2}>
                        {productOwners.map(member => (
                            <Grid size={{ xs: 12, sm: 6, md: 3 }} key={member.id}>
                                <MemberCard member={member} />
                            </Grid>
                        ))}
                    </Grid>
                </Box>

                <Divider sx={{ borderColor: '#edebe9' }} />

                {/* --- Scrum Master Section --- */}
                <Box>
                    <Typography variant="subtitle1" sx={{ fontWeight: 700, mb: 2, color: '#323130' }}>
                        Scrum Master (SM)
                    </Typography>
                    <Grid container spacing={2}>
                        {scrumMasters.map(member => (
                            <Grid size={{ xs: 12, sm: 6, md: 3 }} key={member.id}>
                                <MemberCard member={member} />
                            </Grid>
                        ))}
                    </Grid>
                </Box>

                <Divider sx={{ borderColor: '#edebe9' }} />

                {/* --- Execution Members Section with Pagination --- */}
                <Box>
                    <Stack direction="row" justifyContent="space-between" alignItems="center" sx={{ mb: 2 }}>
                        <Typography variant="subtitle1" sx={{ fontWeight: 700, color: '#323130' }}>
                            Execution Members (EM)
                        </Typography>

                        {/* Pagination Controls */}
                        {searchMembers.length > 0 && (
                            <Stack direction="row" alignItems="center" spacing={1}>
                                <IconButton
                                    size="small"
                                    onClick={() => setEmPage(prev => Math.max(0, prev - 1))}
                                    disabled={emPage === 0}
                                    sx={{ border: '1px solid #edebe9', borderRadius: 1 }}
                                >
                                    <ChevronLeft fontSize="small" />
                                </IconButton>
                                <IconButton
                                    size="small"
                                    onClick={() => {
                                        service.projectService.getMembersOfProject(projects[projectIndex].id, 'EM', emPage + 1)
                                            .then(res => {
                                                setEmPage((e) => e + 1)
                                                setSearchMembers(res)
                                            })
                                            .catch(e => toastContext?.dispatcher({ message: e, type: ToastType.ERROR }))
                                    }}
                                    disabled={searchMembers.length < 20}
                                    sx={{ border: '1px solid #edebe9', borderRadius: 1, color: '#0078d4' }}
                                >
                                    <ChevronRight fontSize="small" />
                                </IconButton>
                            </Stack>
                        )}
                    </Stack>

                    <Grid container spacing={2}>
                        {searchMembers.map(member => (
                            <Grid size={{ xs: 12, sm: 6, md: 3 }} key={member.id}>
                                <MemberCard member={member} />
                            </Grid>
                        ))}
                    </Grid>
                </Box>

            </Stack>
        </Box>
    );
};