import {useState} from 'react';
import './App.css';
import ReactPlayer from 'react-player';
import songs from '../data/songs.yml';

console.log(songs);

const App = () => {
	const [count, setCount] = useState(0);

	return (
		<div className="App">
			<h1>Vite + React</h1>
			<div className="card">
				<button type="button" onClick={() => setCount((oldCount) => oldCount + 1)}>
					count is {count}
				</button>
				<p>
					Edit <code>src/App.tsx</code> and save to test HMR
				</p>
			</div>
			<ReactPlayer url="https://www.youtube.com/watch?v=ysz5S6PUM-U" controls/>
		</div>
	);
};

export default App;
