import { Autorenew, Groups, KeyboardArrowRight, Speed } from '@mui/icons-material';
import { Container, Stack, Typography, Button, Paper, Divider } from '@mui/material';
import Box from '@mui/material/Box';
import Grid from '@mui/material/Grid';
import { useNavigate } from 'react-router-dom';


const scrumHighlights = [
    {
        title: "The Sprint",
        icon: <Speed />,
        desc: "A time-boxed period (usually 2-4 weeks) where a 'Done', useable, and potentially releasable product Increment is created."
    },
    {
        title: "Roles",
        icon: <Groups />,
        desc: "The Product Owner (the 'What'), the Scrum Master (the 'How'), and the Development Team (the 'Doers')."
    },
    {
        title: "Backlog Management",
        icon: <Autorenew />,
        desc: "A dynamic list of everything that might be needed in the product. It is the single source of requirements."
    },
    {
        title: "Daily Standup",
        icon: <Groups />,
        desc: "A 15-minute event for the Team to synchronize activities and create a plan for the next 24 hours."
    }
];

export default function HomePage() {
    const navigate = useNavigate()
    return (
        <Box sx={{ bgcolor: '#fff', color: '#323130' }}>

            {/* --- HERO SECTION --- */}
            <Box
                sx={{
                    pt: 12,
                    pb: 10,
                    background: 'linear-gradient(135deg, #f3f2f1 0%, #ffffff 100%)',
                    borderBottom: '1px solid #edebe9'
                }}
            >
                <Container maxWidth="md">
                    <Stack spacing={3} alignItems="center" textAlign="center">
                        <Typography
                            variant="overline"
                            sx={{ fontWeight: 700, color: '#0078d4', letterSpacing: 2 }}
                        >
                            Introducing Our Agile Workspace
                        </Typography>
                        <Typography
                            variant="h2"
                            sx={{ fontWeight: 800, color: '#201f1e', lineHeight: 1.1 }}
                        >
                            Sprinting towards <br /> efficiency, without the sweat.
                        </Typography>
                        <Typography
                            variant="h6"
                            sx={{ color: '#605e5c', fontWeight: 400, maxWidth: 600 }}
                        >
                            A seamless management tool designed to bridge the gap between
                            messy backlogs and high-velocity releases.
                        </Typography>
                        <Stack direction="row" spacing={2} sx={{ mt: 2 }}>
                            <Button
                                variant="contained"
                                size="large"
                                onClick={()=>navigate('/signup')}
                                endIcon={<KeyboardArrowRight />}
                                sx={{ bgcolor: '#0078d4', px: 4, py: 1.5, textTransform: 'none', fontWeight: 600 }}
                            >
                                Get Started
                            </Button>
                            <Button
                                variant="outlined"
                                size="large"
                                sx={{ px: 4, py: 1.5, textTransform: 'none', fontWeight: 600, color: '#323130', borderColor: '#8a8886' }}
                            >
                                View Documentation
                            </Button>
                        </Stack>
                    </Stack>
                </Container>
            </Box>

            {/* --- SCRUM INTRODUCTION SECTION --- */}
            <Container maxWidth="lg" sx={{ py: 10 }}>
                <Grid container spacing={6} alignItems="center">
                    <Grid size={6}>
                        <Typography variant="h4" sx={{ fontWeight: 800, mb: 3 }}>
                            What is SCRUM?
                        </Typography>
                        <Typography variant="body1" sx={{ color: '#605e5c', lineHeight: 1.8, mb: 2 }}>
                            Scrum is an iterative, incremental framework for project management.
                            Instead of a "big bang" release, it focuses on delivering value in
                            small, manageable chunks called <strong>Sprints</strong>.
                        </Typography>
                        <Typography variant="body1" sx={{ color: '#605e5c', lineHeight: 1.8 }}>
                            It’s built on three main pillars:
                            <strong> Transparency</strong>, <strong>Inspection</strong>, and <strong>Adaptation</strong>.
                            In short: see the work, check the work, fix the work.
                        </Typography>
                    </Grid>

                    <Grid size={6}>
                        <Grid container spacing={2}>
                            {scrumHighlights.map((item, idx) => (
                                <Grid size={6} key={idx}>
                                    <Paper
                                        variant="outlined"
                                        sx={{ p: 3, height: '100%', border: '1px solid #edebe9', '&:hover': { borderColor: '#0078d4' } }}
                                    >
                                        <Box sx={{ color: '#0078d4', mb: 1.5 }}>{item.icon}</Box>
                                        <Typography variant="subtitle1" sx={{ fontWeight: 700, mb: 1 }}>
                                            {item.title}
                                        </Typography>
                                        <Typography variant="body2" sx={{ color: '#605e5c' }}>
                                            {item.desc}
                                        </Typography>
                                    </Paper>
                                </Grid>
                            ))}
                        </Grid>
                    </Grid>
                </Grid>
            </Container>

            {/* --- FOOTER CTA --- */}
            <Box sx={{ bgcolor: '#201f1e', color: '#fff', py: 6 }}>
                <Container maxWidth="md" sx={{ textAlign: 'center' }}>
                    <Typography variant="h5" sx={{ mb: 2, fontWeight: 600 }}>
                        Ready to organize your chaos?
                    </Typography>
                    <Typography variant="body2" sx={{ color: '#a19f9d', mb: 3 }}>
                        Join hundreds of teams delivering better software, faster.
                    </Typography>
                    <Divider sx={{ bgcolor: '#323130', mb: 4 }} />
                    <Typography variant="caption" sx={{ color: '#a19f9d' }}>
                        © 2026 Project Agile. Built with efficiency in mind.
                    </Typography>
                </Container>
            </Box>
        </Box>
    );
}