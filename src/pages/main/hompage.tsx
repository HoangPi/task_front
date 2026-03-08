import Box from '@mui/material/Box';
import Grid from '@mui/material/Grid';

export default function HomePage() {

    return (
        <Box sx={{ flexGrow: 1 }}>
            <h1>Lorem ipsum dolor</h1>

            <Grid container spacing={20} marginX={15}>
                <Grid size={6}>
                    Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non.
                </Grid>
                <Grid size={6}>
                    Proident, sunt in culpa qui officia deserunt mollit anim id est laborum. Curabitur pretium tincidunt lacus. Nulla gravida orci a odio. Nullam varius, turpis et commodo pharetra, est eros bibendum elit, nec luctus magna felis sollicitudin mauris. Integer in mauris eu nibh euismod gravida. Duis ac tellus et risus vulputate vehicula. Donec lobortis risus.
                </Grid>
            </Grid>
        </Box>
    );
}