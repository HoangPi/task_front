import { useAppDispatch, useAppSelector } from '../../redux/hook'
import Button from '@mui/material/Button';
import Box from '@mui/material/Box';
import { useNavigate, type NavigateFunction } from "react-router-dom"
import { Avatar, Backdrop, Badge, Collapse, Divider, IconButton, List, ListItem, ListItemText, Paper, Popover, Stack, Typography } from '@mui/material';
import { useContext, useEffect, useState } from 'react';
import { AccountCircleOutlined, Circle, LogoutOutlined, Notifications } from '@mui/icons-material'
import { removeUserInfomation } from '../../redux/storage/user';
import { service } from '../../service';
import { NotificationContext } from './notificationContext';

function NavAnonymous({ navigate }: { navigate: NavigateFunction }) {
    return <>
        <Button onClick={() => navigate("/signin")} color="inherit">Sign in</Button>
        <Button onClick={() => navigate("/signup")} color="inherit">Sign up</Button>
    </>
}

export function NavLoged({ navigate }: { navigate: NavigateFunction }) {
    const [expanded, setExpanded] = useState(false);
    const user = useAppSelector((s) => s.user)
    const dispatch = useAppDispatch()

    const handleToggle = () => {
        setExpanded((prev) => !prev);
    };
    return (
        <>
            {/* The Background Overlay */}
            <Backdrop
                sx={{ color: '#fff', zIndex: (theme) => theme.zIndex.drawer + 1 }}
                open={expanded}
                onClick={() => setExpanded(false)}
            />
            <NotificationMenu />
            <Button
                color="inherit"
                onClick={() => navigate("/dashboard")}
                sx={{ mr: 2 }} // Adds space between this and the avatar
            >
                Dashboard
            </Button>
            <Box
                sx={{
                    position: 'relative',
                    display: 'inline-block', // Wraps tightly around the Avatar
                    mt: 2,
                    zIndex: (theme) => expanded ? theme.zIndex.drawer + 2 : 1
                }}
            >
                {/* The Trigger Button - Changed to an Avatar */}
                <IconButton onClick={handleToggle} sx={{ p: 0 }}>
                    <Avatar alt="User Avatar" />
                </IconButton>

                {/* The Floating Area - Width halved to 225px */}
                <Box
                    sx={{
                        position: 'absolute',
                        top: '100%',
                        right: 0,
                        width: 225
                    }}
                >
                    <Collapse in={expanded}>
                        <Paper elevation={4} sx={{ p: 2, mt: 1 }}>

                            <Typography variant="subtitle1" sx={{ fontWeight: 'bold', textAlign: 'right' }}>
                                {user.name}
                            </Typography>

                            <Typography variant="body2" sx={{ color: 'grey.800', mb: 2, textAlign: 'right' }}>
                                {user.email}
                            </Typography>

                            {/* Profile Button - No outline, icon on right */}
                            <Button
                                variant="text"
                                fullWidth
                                onClick={() => navigate("/profile")}
                                endIcon={<AccountCircleOutlined />}
                                sx={{
                                    mb: 1, justifyContent: 'right', color: 'text.primary',
                                    '&:hover': {
                                        backgroundColor: 'ActiveText', // Light red background
                                        color: 'ButtonHighlight', // Red text for sign out
                                        transform: 'scale(1.02)', // Slightly grows the button
                                    }
                                }}
                            >
                                Profile
                            </Button>

                            <Divider sx={{ my: 1 }} />

                            {/* Sign Out Button - No outline, icon on right */}
                            <Button
                                variant="text"
                                fullWidth
                                endIcon={<LogoutOutlined />}
                                onClick={() => {
                                    localStorage.removeItem("access")
                                    dispatch(removeUserInfomation());
                                    navigate("/")
                                }}
                                sx={{
                                    justifyContent: 'right', color: 'text.primary',
                                    transition: 'all 0.2s ease-in-out',
                                    '&:hover': {
                                        backgroundColor: 'error.light', // Light red background
                                        color: 'ButtonHighlight', // Red text for sign out
                                        transform: 'scale(1.02)', // Slightly grows the button
                                    }
                                }}
                            >
                                Sign out
                            </Button>

                        </Paper>
                    </Collapse>
                </Box>
            </Box>
        </>
    );
}

export function NavSmall({ navigate }: { navigate: NavigateFunction }) {
    return <>
        <NavAnonymous navigate={navigate}></NavAnonymous>
    </>
}

// const mockMessages = [
//     {
//         id: 1,
//         title: 'New Work Item assigned',
//         content: 'You have been assigned to "Implement User Authentication"',
//         time: '5m ago',
//         unread: true
//     },
//     {
//         id: 2,
//         title: 'Sprint 14 Started',
//         content: 'The current sprint has officially started.',
//         time: '2h ago',
//         unread: true
//     },
//     {
//         id: 3,
//         title: 'Alex mentioned you',
//         content: 'Alex mentioned you in a comment on #4 Fix CSS Grid Layout bugs',
//         time: '1d ago',
//         unread: false
//     },
// ];

export type UserNotification = {
    id: number,
    priority: number,
    message: string,
    path: string
    has_read: boolean
}

export const NotificationMenu = () => {
    const user = useAppSelector(state => state.user)
    const [anchorEl, setAnchorEl] = useState<HTMLButtonElement | null>(null);
    const [notifications, setNotifications] = useState<UserNotification[]>([])
    const navigate = useNavigate()
    const noticeContext = useContext(NotificationContext)

    // Calculate unread count for the badge
    const unreadCount = notifications.reduce((accumulator, current) => accumulator + (!current.has_read ? 1 : 0), 0);

    const handleClick = (event: React.MouseEvent<HTMLButtonElement>) => {
        setAnchorEl(event.currentTarget);
    };

    const handleClose = () => {
        setAnchorEl(null);
    };

    const open = Boolean(anchorEl);
    const id = open ? 'notification-popover' : undefined;
    useEffect(() => {
        service.userService.getNotification(0)
            .then(res => setNotifications(res))
    }, [user.userId])

    return (
        <>
            {/* 1. The Notification Button */}
            <IconButton
                onClick={handleClick}
                aria-describedby={id}
                sx={{ color: 'text.secondary', '&:hover': { bgcolor: '#f3f2f1' } }}
            >
                <Badge badgeContent={unreadCount} color="error">
                    <Notifications />
                </Badge>
            </IconButton>

            {/* 2. The Popover Container */}
            <Popover
                id={id}
                open={open}
                anchorEl={anchorEl}
                onClose={handleClose}
                anchorOrigin={{
                    vertical: 'bottom',
                    horizontal: 'right',
                }}
                transformOrigin={{
                    vertical: 'top',
                    horizontal: 'right',
                }}
                PaperProps={{
                    sx: { width: 350, mt: 1, boxShadow: '0px 8px 24px rgba(0,0,0,0.12)', borderRadius: 2 }
                }}
            >
                {/* Header */}
                <Stack
                    direction="row"
                    justifyContent="space-between"
                    alignItems="center"
                    sx={{ p: 2, borderBottom: '1px solid #edebe9' }}
                >
                    <Typography variant="h6" sx={{ fontSize: '1rem', fontWeight: 700 }}>
                        Notifications
                    </Typography>

                    {/* Group the action buttons together on the right */}
                    <Stack direction="row" spacing={1}>
                        <Button
                            onClick={() => {
                                setNotifications(notifications.filter(item => !item.has_read));
                                service.userService.handleNotification(true);
                            }}
                            size="small"
                            color="error"
                            sx={{ textTransform: 'none', fontWeight: 600 }}
                        >
                            Delete read
                        </Button>

                        <Button
                            onClick={() => {
                                setNotifications(notifications.map(item => ({ ...item, has_read: true })));
                                service.userService.handleNotification(false);
                            }}
                            size="small"
                            sx={{ textTransform: 'none', fontWeight: 600 }}
                        >
                            Mark all as read
                        </Button>
                    </Stack>
                </Stack>

                {/* Message List */}
                <List sx={{ p: 0, maxHeight: 400, overflow: 'auto' }}>
                    {notifications.length === 0 ? (
                        <Box sx={{ p: 3, textAlign: 'center' }}>
                            <Typography variant="body2" color="text.secondary">
                                No new notifications
                            </Typography>
                        </Box>
                    ) : (
                        notifications.map((msg, index) => (
                            <div key={msg.id}>
                                <ListItem
                                    alignItems="flex-start"
                                    onClick={() => {
                                        service.userService.handleNotification(false, msg.id)
                                        setNotifications(notifications.map((item) => item.id !== msg.id ? item : { ...item, has_read: true }))
                                        noticeContext?.dispatch(msg)
                                        navigate(`/${msg.path}`)
                                    }}
                                    sx={{
                                        px: 2,
                                        py: 1.5,
                                        bgcolor: msg.has_read ? '#eff6fc' : 'transparent', // Light blue tint for unread
                                        '&:hover': { bgcolor: msg.has_read ? '#e1effa' : '#f3f2f1', cursor: 'pointer' }
                                    }}
                                >
                                    <ListItemText
                                        primary={
                                            <Stack direction="row" justifyContent="space-between" alignItems="center" mb={0.5}>
                                                <Typography variant="body2" sx={{ fontWeight: msg.has_read ? 700 : 600, color: '#323130' }}>
                                                    {msg.message}
                                                </Typography>
                                                {msg.has_read && <Circle sx={{ fontSize: 10, color: '#0078d4' }} />}
                                            </Stack>
                                        }
                                        secondary={
                                            <Stack spacing={0.5}>
                                                <Typography variant="caption" sx={{ color: '#605e5c', display: 'block' }}>
                                                    {msg.has_read}
                                                </Typography>
                                                <Typography variant="caption" sx={{ color: 'text.disabled', fontWeight: 600 }}>
                                                    {msg.has_read}
                                                </Typography>
                                            </Stack>
                                        }
                                    />
                                </ListItem>
                                {index < notifications.length - 1 && <Divider component="li" />}
                            </div>
                        ))
                    )}
                </List>

                {/* Footer */}
                <Box sx={{ p: 1, borderTop: '1px solid #edebe9', textAlign: 'center' }}>
                    <Button fullWidth size="small" sx={{ textTransform: 'none', color: 'text.secondary' }}>
                        View all notifications
                    </Button>
                </Box>
            </Popover>
        </>
    );
};