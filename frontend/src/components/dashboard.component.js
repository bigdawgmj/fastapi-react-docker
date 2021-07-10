import React from 'react';
import Paper from '@material-ui/core/Paper';
import Grid from '@material-ui/core/Grid';
import Card from '@material-ui/core/Card';
import CardHeader from '@material-ui/core/CardHeader';
import CardContent from '@material-ui/core/CardContent';
import Table from '@material-ui/core/Table';
import TableBody from '@material-ui/core/TableBody';
import TableCell from '@material-ui/core/TableCell';
import TableContainer from '@material-ui/core/TableContainer';
import TableHead from '@material-ui/core/TableHead';
import TableRow from '@material-ui/core/TableRow';
import { Delete } from '@material-ui/icons';
import { withStyles } from '@material-ui/core/styles';
import {
	VictoryBar,
	VictoryChart,
	VictoryAxis,
	VictoryTooltip,
	VictoryTheme
} from 'victory';
import { range } from 'lodash';
import AddForm from './AddForm/add-form.component';

import axios from 'axios';

const styles = (theme) => ({
    root: {
        backgroundColor: 'beige',
        color: 'white',
    },
    cards: {
        margin: theme.spacing(2),
        backgroundColor: 'white',
    },
    paper: {
        padding: theme.spacing(2),
        textAlign: 'center',
        backgroundColor: 'gray',
    },
    header: {
        color: 'red',
    },
    headPaper: {
        padding: theme.spacing(2),
        textAlign: 'center',
        backgroundColor: '#19475D',
        color: 'white',
    },
});

class DashboardComponent extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            error: null,
            isLoaded: false,
            books: [],
            weekAvg: {},
            avgData: [],
            sumData: [],
            totalWeeks: 0,
            minWeeks: 0,
        };
    }

	baseUrl = 'http://localhost:8080/api/fitness/';
	getWeekAvg = () => {
        axios.get(this.baseUrl + `weekavg?start=2021-06-01&end=2021-07-09`).then((res) => {
            this.setState({ avgData: res.data.agg });
        });
	}
	getWeekSum = () => {
        axios.get(this.baseUrl + `weeksum?start=2021-06-01&end=2021-07-09`).then((res) => {
            res.data.agg.forEach((d) => {
                if (d.minutes > this.state.totalWeeks) {
                    this.setState({ totalWeeks: d.week });
                }
            });
            this.setState({ sumData: res.data.agg });
        });
	}
	getRecords = () => {
        axios.get(this.baseUrl + `period?end=7-31-2021&start=1-1-2021`).then((res) => {
            const sortedItems = res.data.sort((a, b) => (a.fitnessdate > b.fitnessdate ? 1 : -1));
            this.setState({
                isLoaded: true,
                weekAvg: { name: 'Fitness', color: '#08c96b', items: sortedItems.map((d) => ({ ...d, date: new Date(d.fitnessdate) })) },
            });
        });
	}

	refreshData = () => {
		this.getWeekAvg();
		this.getWeekSum();
		this.getRecords();
	}

    componentDidMount() {
		this.refreshData();
    }

    render() {
        const { classes } = this.props;
        const { error, isLoaded } = this.state;

		const handleDelete = (row) => {
			axios.delete('http://localhost:8080/api/fitness/remove/' + row.fitnessid)
				.then(res => {
					this.refreshData();
				});
		}

        if (error) {
            return <div>Error: {error.message}</div>;
        } else if (!isLoaded) {
            return <div>Loading...</div>;
        } else {
            return (
                <div>
                    <Grid container className={classes.root} spacing={3}>
                        <Grid item xs={12}>
                            <Card className={classes.cards}>
                                <Paper className={classes.headPaper}>
                                    <h1>Mark's Fitness Tracker</h1>
                                </Paper>
                            </Card>
                        </Grid>
                        <Grid item xs={6}>
                            <Card className={classes.cards}>
                                <CardHeader title={'Weekly Averages'} />
                                <CardContent>
                                    <Paper className={classes.paper}>
                                        <VictoryChart theme={VictoryTheme.material} domainPadding={20}>
                                            <VictoryAxis
                                                label={'Week'}
                                                tickValues={range(22, this.state.totalWeeks + 1)}
                                                style={{ axisLabel: { fontSize: 12, padding: 30 } }}
                                            />
                                            <VictoryAxis
                                                label={'Avg Minutes'}
                                                style={{ axisLabel: { fontSize: 12, padding: 40 } }}
                                                fixLabelOverlap={true}
                                                dependentAxis
                                            />
                                            <VictoryBar
												data={this.state.avgData}
												x="week"
												y="avg_minutes"
												labels={({datum}) => `minutes: ${datum.avg_minutes.toFixed(1)}`}
												labelComponent={<VictoryTooltip dy={0} centerOffset={{x: 25}} />}
											/>
                                        </VictoryChart>
                                    </Paper>
                                </CardContent>
                            </Card>
                        </Grid>
                        <Grid item xs={6}>
                            <Card className={classes.cards}>
                                <CardHeader title={'Weekly Totals'} />
                                <CardContent>
                                    <Paper className={classes.paper}>
                                        <VictoryChart theme={VictoryTheme.material} domainPadding={20}>
                                            <VictoryAxis
                                                label={'Week'}
                                                tickValues={range(22, this.state.totalWeeks + 1)}
                                                fixLabelOverlap={true}
                                                style={{ axisLabel: { fontSize: 12, padding: 30 } }}
                                            />
                                            <VictoryAxis
                                                dependentAxis
                                                label={'Total Minutes'}
                                                style={{ axisLabel: { fontSize: 12, padding: 40 } }}
                                                fixLabelOverlap={true}
                                            />
                                            <VictoryBar
												data={this.state.sumData}
												x="week"
												y="minutes"
												labels={({datum}) => `minutes: ${datum.minutes}`}
												labelComponent={<VictoryTooltip dy={0} centerOffset={{x: 25}} />}
											/>
                                        </VictoryChart>
                                    </Paper>
                                </CardContent>
                            </Card>
                        </Grid>
                        <Grid item xs={12}>
                            <Card className={classes.cards}>
                                <CardContent>
                                    <Paper className={classes.paper}>
										<AddForm refreshData={this.refreshData}/>
									</Paper>
                                </CardContent>
							</Card>
						</Grid>
                        <Grid item xs={12}>
                            <Card className={classes.cards}>
                                <CardContent>
                                    <Paper className={classes.paper}>
                                        <TableContainer component={Paper}>
                                            <Table className={classes.table} aria-label="simple table">
                                                <TableHead>
                                                    <TableRow>
                                                        <TableCell align="center">Date</TableCell>
                                                        <TableCell align="center">Minutes Exercised</TableCell>
														<TableCell align="center">Actions</TableCell>
                                                    </TableRow>
                                                </TableHead>
                                                <TableBody>
                                                    {this.state.weekAvg.items.map((row) => (
                                                        <TableRow key={row.fitnessdate}>
                                                            <TableCell align="center">{row.fitnessdate}</TableCell>
                                                            <TableCell align="center">{row.fitnessminutes}</TableCell>
															<TableCell align="center">
																<Delete color="secondary" onClick={(evt) => { handleDelete(row) }}/>
															</TableCell>
                                                        </TableRow>
                                                    ))}
                                                </TableBody>
                                            </Table>
                                        </TableContainer>
                                    </Paper>
                                </CardContent>
                            </Card>
                        </Grid>
                    </Grid>
                </div>
            );
        }
    }
}

export default withStyles(styles)(DashboardComponent);
