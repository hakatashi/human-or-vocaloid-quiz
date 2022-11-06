import {useCallback, useEffect, useRef, useState} from 'react';
import ReactPlayer from 'react-player';
import songs from '../data/songs.yml';
import style from './App.module.css';

const App = () => {
	const [volume, setVolume] = useState(0);
	const [playing, setPlaying] = useState(false);
	const playerEl = useRef(null);

	const song = songs[0];

	useEffect(() => {
		const intervalId = setInterval(() => {
			setVolume((val) => val + 1);
		}, 100);
		return () => {
			clearInterval(intervalId);
		};
	}, []);

	const onStart = useCallback(() => {
		if (playerEl.current) {
			playerEl.current.seekTo(song.startTime);
		}
		setPlaying(true);
	}, []);

	return (
		<div className={style.root}>
			<h1>人間かボカロかクイズ</h1>
			<p className={style.subtitle}>made by <a href="https://github.com/hakatashi">@hakatashi</a></p>
			<div className={style.card}>
				<p>
					今から流れる音声を聞いて、<br/>
					人間の歌声か合成音声の歌声か当ててください
				</p>
				<button type="button" onClick={onStart}>
					はじめる
				</button>
			</div>
			<div className={style.player}>
				<ReactPlayer
					ref={playerEl}
					url={song.url}
					controls
					playing={false}
					volume={(volume % 100) / 300}
				/>
			</div>
		</div>
	);
};

export default App;
