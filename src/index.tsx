import React, { Component } from 'react';
import ReactDOM from 'react-dom';
import './index.scss';
import { SquareProps, BoardProps, GameState } from './interfaces';

const Square = (props: SquareProps) => (
	<button className="square" onClick={props.onClick}>
		{props.value}
	</button>
);

class Board extends Component<BoardProps> {
	renderSquare(i: number) {
		return <Square key={`Board-Square${i}`} value={this.props.currentBoard.squares[i]} onClick={() => this.props.handleClick(i)} />;
	}

	generateBoard(size: number) {
		let i = 0;
		const base = new Array(size).fill(0);
		return base.slice().map((_, index) => (
			<div className="board-row" key={`Board-Row${i}`}>
				{base.slice().map(() => this.renderSquare(i++))}
			</div>
		));
	}

	render() {
		const winner = calculateWinner(this.props.currentBoard.squares);
		let status;
		if (winner) {
			status = 'Winner: ' + winner;
		} else if (this.props.currentBoard.squares.includes(null)) {
			status = 'Current player: ' + this.props.currentBoard.turn;
		} else {
			status = 'Draw!';
		}

		return (
			<div>
				<div className="status">{status}</div>
				{this.generateBoard(3)}
			</div>
		);
	}
}

class Game extends Component<{}, GameState> {
	constructor(props: any) {
		super(props);
		this.state = {
			history: [{ round: 0, squares: Array(9).fill(null), turn: 'X' }],
			currentRound: 0
		};
	}

	get currentBoard() {
		return this.state.history[this.state.currentRound];
	}

	jumpToRound(i: number) {
		this.setState({
			history: this.state.history.slice(0, i + 1),
			currentRound: i
		});
	}

	handleClick(i: number) {
		const squares = this.currentBoard.squares.slice();

		if (calculateWinner(squares) || squares[i]) {
			return;
		}

		squares[i] = this.currentBoard.turn;
		this.setState({
			history: this.state.history.concat([{ round: this.state.currentRound + 1, squares, turn: this.currentBoard.turn === 'X' ? 'O' : 'X' }]),
			currentRound: this.state.currentRound + 1
		});
	}

	render() {
		return (
			<div className="game">
				<div className="game-board">
					<Board handleClick={this.handleClick.bind(this)} currentBoard={this.currentBoard} />
					<button
						onClick={() =>
							this.currentBoard.round
								? this.jumpToRound(this.currentBoard.round - 1)
								: (document.getElementById('undoText')!.style.display = 'flex') &&
								  setTimeout(() => (document.getElementById('undoText')!.style.display = 'none'), 1000)
						}
					>
						Undo
					</button>
					<button onClick={() => this.jumpToRound(0)}>Restart</button>
					<p id="undoText" style={{ display: 'none' }}>
						There is nothing to undo!
					</p>
				</div>
				<div className="game-info">
					<div>
						{this.currentBoard.round ? `Current Round: ${this.currentBoard.round}` : 'Good luck!'}
						<hr></hr>
						History:
					</div>
					<ol>
						{this.state.history.slice(1, this.state.history.length - 1).map(h => (
							<ul key={`JumpTo${h.round}`} onClick={() => this.jumpToRound(h.round)}>
								Jump to Round {h.round}
							</ul>
						))}
					</ol>
				</div>
			</div>
		);
	}
}

// ========================================

ReactDOM.render(<Game />, document.getElementById('root'));

function calculateWinner(squares: Array<'X' | 'O' | null>) {
	for (const row of [
		[0, 1, 2],
		[3, 4, 5],
		[6, 7, 8],
		[0, 3, 6],
		[1, 4, 7],
		[2, 5, 8],
		[0, 4, 8],
		[2, 4, 6]
	]) {
		const first = squares[row[0]];
		if (first && row.every(n => squares[n] === first)) return first;
	}
	return null;
}
