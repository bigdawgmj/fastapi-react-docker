import React from 'react';
import Button from '@material-ui/core/Button';
import axios from 'axios';
import * as d3 from 'd3';
import MultilineChart from './MultilineChart';
import schc from "../SCHC.json";
import vcit from "../VCIT.json";
import portfolio from "../PORTFOLIO.json";

const portfolioData = { name: "Portfolio", color: "#ffffff", items: portfolio.map((d) => ({ ...d, date: new Date(d.date) })) };
const schcData = { name: "SCHC", color: "#d53e4f", items: schc.map((d) => ({ ...d, date: new Date(d.date) }))};
const vcitData = { name: "VCIT", color: "#5e4fa2", items: vcit.map((d) => ({ ...d, date: new Date(d.date) })) };
const dimensions = {
  width: 600,
  height: 300,
  margin: { top: 30, right: 30, bottom: 30, left: 60 }
};
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
		const { error, isLoaded, books } = this.state;

		if (error) {
			return <div>Error: {error.message}</div>
		} else if (!isLoaded) {
			return <div>Loading...</div>
		} else {
			return (
                <div>
                    <ul>
                        {books.map((book, idx) => (
                            <li key={idx}>
                                {book}
                            </li>
                        ))}
                    </ul>
                    <MultilineChart
                        data={[this.state.weekAvg]}
                        dimensions={dimensions}
                    />
                    <button variant="contained">Do Things!</button>
                </div>
            )
		}

	}
}

export default BooksComponent;
