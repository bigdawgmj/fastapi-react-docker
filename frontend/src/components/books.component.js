import React from 'react';

class BooksComponent extends React.Component {
	constructor(props) {
		super(props);
		this.state = {
			error: null,
			isLoaded: false,
			books: []
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
	}

	render() {
		const { error, isLoaded, books } = this.state;

		if (error) {
			return <div>Error: {error.message}</div>
		} else if (!isLoaded) {
			return <div>Loading...</div>
		} else {
			return <ul>
				{books.map((book, idx) => (
					<li key={idx}>
						{book}
					</li>
				))}
			</ul>
		}

	}
}

export default BooksComponent;
