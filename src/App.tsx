import {useState} from 'react';
import ReactPlayer from 'react-player';
import songs from '../data/songs.yml';
import style from './App.module.css';

const App = () => {
	const [count, setCount] = useState(0);
	return (
		<div className={style.root}>
			<h1>Vite + React</h1>
			<div className={style.card}>
				<button type="button" onClick={() => setCount((oldCount) => oldCount + 1)}>
					count is {count}
				</button>
				<p>
					Edit <code>src/App.tsx</code> and save to test HMR
				</p>
			</div>
			{songs.map((song) => (
				<ReactPlayer key={song.url} url={song.url} controls/>
			))}
		</div>
	);
};

export default App;
