import { useEffect, useState } from "react"
import { taskService } from "../../../service/task/taskService"
import { reduxService, useAppDispatch, useAppSelector } from "../../../redux/hook"
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
    Divider,
    Stack,
    Button
} from "@mui/material"
import { BarChart } from "@mui/x-charts"
import { ArrowBackIosNew, ArrowForwardIos } from "@mui/icons-material"
import { WorkService, type WorkSummary } from "../../../service/work/workService"


export const ManagerOverview = () => {
    const dispatch = useAppDispatch()
    const tasks = useAppSelector(state => state.taskStorage.tasks)
    let [works, setWorks] = useState<WorkSummary[]>([])
    const [selectedIndex, setSelectedIndex] = useState(0)
    const [timeSelector, setTimeSelector] = useState({
        quarter: Math.floor(new Date().getMonth() / 3) + 1,
        year: new Date().getFullYear()
    })
    const handleUpdateTimeSelector = (up: boolean): void => {
        if (timeSelector.quarter >= 4 && up) {
            setTimeSelector({
                quarter: 1,
                year: timeSelector.year + 1
            })
        }
        else if (timeSelector.quarter <= 1 && !up) {
            setTimeSelector({
                quarter: 4,
                year: timeSelector.year - 1
            })
        }
        else {
            setTimeSelector({
                quarter: timeSelector.quarter + (up ? 1 : -1),
                year: timeSelector.year
            })
        }
    }

    const allMonths = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
    const startIndex = (timeSelector.quarter - 1) * 3;
    const currentMonths = allMonths.slice(startIndex, startIndex + 3);

    useEffect(() => {
        taskService.getTasksManagedByUser()
            .then(res => {
                dispatch(reduxService.taskService.addSummaryBulk(res))
            })
            .catch((e) => {
                console.log(e)
            })
    }, [])

    useEffect(() => {
        if (!tasks.length) {
            return
        }
        WorkService.getWorkSummary(tasks[selectedIndex].id, timeSelector.quarter, timeSelector.year)
            .then(res => {
                let workTemp: WorkSummary[] = []
                for (let i = 1; i <= 3; i++) {
                    workTemp.push({
                        id: 0,
                        month: (timeSelector.quarter - 1) * 3 + i,
                        year: timeSelector.year,
                        hours_actually_used: 0,
                        hours_done: 0,
                        hours_total: 0
                    })
                }
                res.forEach(item => {
                    console.log(item)
                    workTemp.forEach((temp, index) => {
                        if (temp.month === item.month && temp.year === item.year) {
                            Object.assign(workTemp[index], item)
                        }
                    })
                })
                setWorks(workTemp)
            })
            .catch(err => console.log(err))
    }, [timeSelector, selectedIndex, tasks.length])

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
                                    <Typography variant="h5" sx={{ mt: 2, color: 'green' }}>{tasks[selectedIndex].hours_actually_used}</Typography>
                                    <Typography variant="body2" color="text.secondary">Hours actually used</Typography>
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
                                    <Typography variant="h4" sx={{ mt: 2 }}>{tasks[selectedIndex].jobs_completed}</Typography>
                                    <Typography variant="body2" color="text.secondary">Jobs completed</Typography>
                                    <Typography variant="h5" sx={{ mt: 2, color: 'green' }}>{tasks[selectedIndex].jobs_in_progress}</Typography>
                                    <Typography variant="body2" color="text.secondary">On going job</Typography>
                                    <Typography variant="h5" sx={{ mt: 2, color: 'red' }}>{tasks[selectedIndex].jobs_aborted}</Typography>
                                    <Typography variant="body2" color="text.secondary">Job failed</Typography>
                                </CardContent>
                            </Card>
                        </Grid>


                        {/* 3. Bar Chart Representation (3 Metrics per month) */}
                        <Grid size={12}>
                            <Typography variant="h6" sx={{ mb: 2 }}>Monthly Performance Metrics</Typography>
                            <Paper elevation={2} sx={{ p: 4, bgcolor: '#ffffff', borderRadius: 2 }}>
                                <Stack direction="row" justifyContent="space-between" alignItems="center" sx={{ mb: 3 }}>
                                    <Typography variant="h6">
                                        Performance: Q{timeSelector.quarter} {timeSelector.year}
                                    </Typography>

                                    <Box>
                                        <Button
                                            size="small"
                                            onClick={() => handleUpdateTimeSelector(false)}
                                            startIcon={<ArrowBackIosNew />}
                                            sx={{ mr: 1 }}
                                        >
                                            Prev Quarter
                                        </Button>
                                        <Button
                                            size="small"
                                            onClick={() => handleUpdateTimeSelector(true)}
                                            endIcon={<ArrowForwardIos />}
                                        >
                                            Next Quarter
                                        </Button>
                                    </Box>
                                </Stack>

                                <Box sx={{ width: '100%', height: 350 }}>
                                    <BarChart
                                        xAxis={[{
                                            scaleType: 'band',
                                            data: currentMonths,
                                        }]}
                                        series={[
                                            { data: works.map((i) => i.hours_done), label: 'Hours done', color: '#42a5f5' },
                                            { data: works.map((i) => i.hours_actually_used), label: 'Hours userd', color: '#ab47bc' },
                                            { data: works.map((i) => i.hours_total), label: 'Total hours', color: '#81c784' },
                                        ]}
                                        height={300}
                                    // tooltip={{ trigger: 'item' }}
                                    />
                                </Box>
                                <Grid size={{ xs: 12, md: 12 }}>

                                </Grid>
                            </Paper>
                        </Grid>
                    </Grid>

                </>
                : <></>
            }

        </Box>
    )
}