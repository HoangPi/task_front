import { useEffect, useState } from "react"
import { taskService } from "../../service/task/taskService"
import { reduxService, useAppDispatch, useAppSelector } from "../../redux/hook"
// New MUI Imports
import {
    Box,
    Card,
    CardContent,
    Typography,
    Grid,
    MenuItem,
    FormControl,
    Select,
    InputLabel,
    Paper,
    Divider
} from "@mui/material"
import { PieChart } from "@mui/x-charts"

export const ManagerOverview = () => {
    const dispatch = useAppDispatch()
    const tasks = useAppSelector(state => state.taskStorage.tasks)
    const [selectedIndex, setSelectedIndex] = useState(0)

    useEffect(() => {
        taskService.getTasksManagedByUser()
            .then(res => {
                dispatch(reduxService.taskService.addSummaryBulk(res))
            })
            .catch((e) => {
                console.log(e)
            })
    }, [])

    return (
        <Box sx={{ p: 3 }}>
            {tasks.length >= 1
                ?
                <>
                    {/* 1. Dropdown Button on the Top Left */}
                    <Box sx={{ mb: 4, display: 'flex', justifyContent: 'flex-start' }}>
                        <FormControl sx={{ minWidth: 200 }}>
                            <InputLabel id="period-label">Report Period</InputLabel>
                            <Select
                                labelId="period-label"
                                id="period-select"
                                label="Report Period"
                                defaultValue={selectedIndex}
                                onChange={(ev) => setSelectedIndex(ev.target.value)}
                            >
                                {tasks.map((task, index) => (
                                    <MenuItem id={`task_${index}`} value={index}>{task.name}</MenuItem>
                                ))}
                            </Select>
                        </FormControl>
                    </Box>

                    {/* 2. Fixed 3 Card Section (No Loops) */}
                    <Grid container spacing={3} sx={{ mb: 6 }}>
                        {/* Card 1: Tasks */}
                        <Grid size={{ xs: 12, md: 6 }}>
                            <Card elevation={3}>
                                <CardContent>
                                    <Typography variant="h6" color="primary" gutterBottom>
                                        Task Volume
                                    </Typography>
                                    <Divider sx={{ my: 1 }} />
                                    <Typography variant="h4" sx={{ mt: 2 }}>{tasks[selectedIndex].hours_total}</Typography>
                                    <Typography variant="body2" color="text.secondary">Hours into the project</Typography>
                                    <Typography variant="h5" sx={{ mt: 2, color: 'orange' }}>{tasks[selectedIndex].hours_assigned}</Typography>
                                    <Typography variant="body2" color="text.secondary">Hours spent</Typography>
                                </CardContent>
                            </Card>
                        </Grid>

                        {/* Card 2: Team Performance */}
                        <Grid size={{ xs: 12, md: 6 }}>
                            <Card elevation={3}>
                                <CardContent>
                                    <Typography variant="h6" color="secondary" gutterBottom>
                                        Management efficiency
                                    </Typography>
                                    <Divider sx={{ my: 1 }} />
                                    <Typography variant="h4" sx={{ mt: 2 }}>{tasks[selectedIndex].hours_done}</Typography>
                                    <Typography variant="body2" color="text.secondary">Hours completed</Typography>
                                    <Typography variant="h5" sx={{ mt: 2, color: 'green' }}>{tasks[selectedIndex].hours_actually_used}</Typography>
                                    <Typography variant="body2" color="text.secondary">Hours actually used</Typography>
                                </CardContent>
                            </Card>
                        </Grid>

                        {/* Card 3: Financials */}
                        <Grid size={{ xs: 12, md: 12 }}>
                            <Card elevation={3} sx={{ height: '100%' }}>
                                <CardContent>
                                    <Typography variant="h6" sx={{ color: 'success.main' }} gutterBottom>
                                        Budget Allocation
                                    </Typography>
                                    <Divider sx={{ my: 1, mb: 2 }} />

                                    <Box sx={{ display: 'flex', justifyContent: 'center', height: 160 }}>
                                        <PieChart
                                            series={[
                                                {
                                                    data: [
                                                        {id: 0, value: tasks[selectedIndex].jobs_completed, label: `Tasks completed ${(tasks[selectedIndex].jobs_completed/(tasks[selectedIndex].jobs_in_progress + tasks[selectedIndex].jobs_completed + tasks[selectedIndex].jobs_in_progress) * 100).toPrecision(2)}%`},
                                                        {id: 1, value: tasks[selectedIndex].jobs_in_progress, label: `Tasks on going ${(tasks[selectedIndex].jobs_in_progress/(tasks[selectedIndex].jobs_in_progress + tasks[selectedIndex].jobs_completed + tasks[selectedIndex].jobs_in_progress) * 100).toPrecision(2)}%`},
                                                        {id: 2, value: tasks[selectedIndex].jobs_aborted, label: `Tasks failed ${(tasks[selectedIndex].jobs_aborted/(tasks[selectedIndex].jobs_in_progress + tasks[selectedIndex].jobs_completed + tasks[selectedIndex].jobs_in_progress) * 100).toPrecision(2)}%`},
                                                    ],
                                                    innerRadius: 30, // Creates a slight donut shape
                                                    outerRadius: 80,
                                                    paddingAngle: 2,
                                                    cornerRadius: 4,
                                                    highlightScope: { fade: 'global', highlight: 'item' },
                                                    faded: { innerRadius: 30, additionalRadius: -30, color: 'gray' },
                                                },
                                            ]}
                                            height={160}
                                            margin={{ top: 0, bottom: 0, left: 0, right: 100 }}
                                            slotProps={{
                                                legend: {
                                                    direction: 'vertical',
                                                    position: { vertical: 'middle', horizontal: 'end' },
                                                },
                                            }}
                                        />
                                    </Box>
                                </CardContent>
                            </Card>
                        </Grid>
                    </Grid>

                    {/* 3. Bar Chart Representation (3 Metrics per month) */}
                    <Typography variant="h6" sx={{ mb: 2 }}>Monthly Performance Metrics</Typography>
                    <Paper elevation={1} sx={{ p: 4, display: 'flex', alignItems: 'flex-end', justifyContent: 'space-around', height: 300, bgcolor: '#fafafa' }}>
                        {['Jan', 'Feb', 'Mar'].map((month) => (
                            <Box key={month} sx={{ textAlign: 'center', width: '20%' }}>
                                <Box sx={{ display: 'flex', alignItems: 'flex-end', justifyContent: 'center', gap: 1, height: 200, mb: 1 }}>
                                    {/* Visual Bar representation */}
                                    <Box sx={{ bgcolor: 'primary.main', width: 15, height: `${Math.random() * 100 + 20}%`, borderRadius: '4px 4px 0 0' }} />
                                    <Box sx={{ bgcolor: 'secondary.main', width: 15, height: `${Math.random() * 100 + 20}%`, borderRadius: '4px 4px 0 0' }} />
                                    <Box sx={{ bgcolor: 'success.main', width: 15, height: `${Math.random() * 100 + 20}%`, borderRadius: '4px 4px 0 0' }} />
                                </Box>
                                <Typography variant="caption">{month}</Typography>
                            </Box>
                        ))}
                    </Paper>
                </>
                : <></>
            }

        </Box>
    )
}