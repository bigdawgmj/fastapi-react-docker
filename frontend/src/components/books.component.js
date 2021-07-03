import React from 'react';
import Button from '@material-ui/core/Button';
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

import axios from 'axios';
import * as d3 from 'd3';
import MultilineChart from './MultilineChart';
// import schc from "../SCHC.json";
// import vcit from "../VCIT.json";
// import portfolio from "../PORTFOLIO.json";


// const portfolioData = { name: "Portfolio", color: "#ffffff", items: portfolio.map((d) => ({ ...d, date: new Date(d.date) })) };
// const schcData = { name: "SCHC", color: "#d53e4f", items: schc.map((d) => ({ ...d, date: new Date(d.date) }))};
// const vcitData = { name: "VCIT", color: "#5e4fa2", items: vcit.map((d) => ({ ...d, date: new Date(d.date) })) };
const dimensions = {
  width: 400,
  height: 200,
  margin: { top: 30, right: 30, bottom: 30, left: 60 }
};

const styles = (theme) => ({
	root: {
		backgroundColor: 'beige',
		color: 'white'
	},
	cards: {
		margin: theme.spacing(2),
		backgroundColor: 'white'
	},
	paper: {
		padding: theme.spacing(2),
		textAlign: 'center',
		backgroundColor: 'gray'
	},
	header: {
		color: 'red'
	}
})

class BooksComponent extends React.Component {
	constructor(props) {
		super(props);
		this.state = {
			error: null,
			isLoaded: false,
			books: [],
            weekAvg: {}
		}
	}

	componentDidMount() {

		var url = "http://localhost:8080/api/books/list"
		fetch(url)
			.then(res => res.json())
			.then(
				(result) => {
					this.setState({
						isLoaded: true,
						books: result
					});
				},
				(error) => {
					this.setState({
						isLoaded: true,
						error
					});
				}
			)

		axios.get(`http://localhost:8080/api/fitness/period?end=1-1-2021&start=12-25-2000`)
            .then(res => {
                const sortedItems = res.data.sort((a, b) => (a.fitnessdate > b.fitnessdate) ? 1 : -1);
                this.setState({
                    weekAvg: { name: "Fitness", color: "#08c96b", items: sortedItems.map((d) => ({ ...d, date: new Date(d.fitnessdate) })) }
                });
        })
    }
	render() {
		const { classes } = this.props;
		const { error, isLoaded } = this.state;

		if (error) {
			return <div>Error: {error.message}</div>
		} else if (!isLoaded) {
			return <div>Loading...</div>
		} else {
			return (
                <div>
					<Grid container className={classes.root} spacing={3}>
						<Grid item xs={6}>
							<Card className={classes.cards}>
								<CardHeader
									title={"Weekly Averages"}
								/>
								<CardContent>
									<Paper className={classes.paper}>
									<MultilineChart
										data={[this.state.weekAvg]}
										dimensions={dimensions}
									/>
									</Paper>
								</CardContent>
							</Card>
						</Grid>
						<Grid item xs={6}>
							<Card className={classes.cards}>
								<CardHeader
									title={"Weekly Totals"}
								/>
								<CardContent>
									<Paper className={classes.paper}>
									<MultilineChart
										data={[this.state.weekAvg]}
										dimensions={dimensions}
									/>
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
            )
		}

	}
}

export default withStyles(styles)(BooksComponent);
