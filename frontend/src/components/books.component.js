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
import { withStyles } from '@material-ui/core/styles';
import { VictoryBar, VictoryChart, VictoryAxis, VictoryTheme } from 'victory';
import { range } from 'lodash';

import axios from 'axios';
// import MultilineChart from './MultilineChart';

// const dimensions = {
//     width: 400,
//     height: 200,
//     margin: { top: 30, right: 30, bottom: 30, left: 60 },
// };

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

class BooksComponent extends React.Component {
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

    componentDidMount() {
        const baseUrl = 'http://localhost:8080/api/fitness/';
        axios.get(baseUrl + `weekavg?start=2021-06-01&end=2021-07-09`).then((res) => {
            this.setState({ avgData: res.data.agg });
        });

        axios.get(baseUrl + `weeksum?start=2021-06-01&end=2021-07-09`).then((res) => {
            res.data.agg.forEach((d) => {
                if (d.minutes > this.state.totalWeeks) {
                    this.setState({ totalWeeks: d.week });
                }
            });
            this.setState({ sumData: res.data.agg });
        });

        axios.get(baseUrl + `period?end=7-1-2021&start=1-1-2021`).then((res) => {
            const sortedItems = res.data.sort((a, b) => (a.fitnessdate > b.fitnessdate ? 1 : -1));
            this.setState({
                isLoaded: true,
                weekAvg: { name: 'Fitness', color: '#08c96b', items: sortedItems.map((d) => ({ ...d, date: new Date(d.fitnessdate) })) },
            });
        });
    }

    render() {
        const { classes } = this.props;
        const { error, isLoaded } = this.state;

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
                                            <VictoryBar data={this.state.avgData} x="week" y="avg_minutes" />
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
                                            <VictoryBar data={this.state.sumData} x="week" y="minutes" />
                                        </VictoryChart>
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
                                                    </TableRow>
                                                </TableHead>
                                                <TableBody>
                                                    {this.state.weekAvg.items.map((row) => (
                                                        <TableRow key={row.name}>
                                                            <TableCell align="center">{row.fitnessdate}</TableCell>
                                                            <TableCell align="center">{row.fitnessminutes}</TableCell>
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

export default withStyles(styles)(BooksComponent);
