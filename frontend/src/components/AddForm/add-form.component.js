import React from 'react';
import TextField from '@material-ui/core/TextField';
import Button from '@material-ui/core/Button';
import Grid from '@material-ui/core/Grid';
import { makeStyles } from '@material-ui/core/styles';
import axios from 'axios';

const useStyles = makeStyles((theme) => ({
	root: {
		'& > *': {
			margin: theme.spacing(1),
			width: '25ch',
		},
	},
}));

const AddForm = (props) => {
	const classes = useStyles();
	const [selectedDate, setSelectedDate] = React.useState(new Date());
	const [minutes, setMinutes] = React.useState(0);

	const handleDateChange = (evt) => {
		console.log(evt.target.value);
		setSelectedDate(evt.target.value);
	};

	const handleMinuteChange = (evt) => {
		setMinutes(evt.target.value);
	}

	const handleSubmit = () => {
		const data = {
			'fitnessdate': selectedDate,
			'fitnessminutes': minutes
		}
		// console.log(data);
		axios.post('http://localhost:8080/api/fitness/add', data)
			.then(res => {
				props.refreshData();
			});
	}

	return(
		<div>
			<h1>Enter New Time</h1>
			<form className={classes.root} noValidate autoComplete="off">
				<TextField
					id="Date"
					type="date"
					value={selectedDate}
					onChange={handleDateChange}
					label="Fitness Date"
					variant="outlined" />
				<TextField id="Minutes"
					label="Fitness Minutes"
					value={minutes}
					onChange={handleMinuteChange}
					variant="outlined" />
				<Button
					variant="contained"
					onClick={handleSubmit}
					color="primary">Submit</Button>
			</form>
		</div>
	)
}

export default AddForm;
