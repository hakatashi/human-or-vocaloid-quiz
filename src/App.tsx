import React, {useCallback, useEffect, useRef, useState} from 'react';
import ReactPlayer from 'react-player';
import songs from '../data/songs.yml';
import style from './App.module.css';

type Phase = 'start' | 'game' | 'finish';

const App = () => {
	const [tick, setTick] = useState(0);
	const [playing, setPlaying] = useState(false);
	const [phase, setPhase] = useState<Phase>('start');
	const playerEl = useRef<ReactPlayer>(null);

	const song = songs[0];

	useEffect(() => {
		const intervalId = setInterval(() => {
			setTick((val) => val + 1);
		}, 100);
		return () => {
			clearInterval(intervalId);
		};
	}, []);

	const onClickStart = useCallback(() => {
		setPhase('game');
	}, [playerEl]);

	const onPlayerReady = useCallback(() => {
		console.log('onReady');
		if (playerEl.current) {
			playerEl.current.seekTo(song.startTime);
		}
		setPlaying(true);
	}, []);

	return (
		<div className={style.root}>
			{phase === 'start' && (
				<div>
					<h1>人間かボカロかクイズ</h1>
					<p className={style.subtitle}>made by <a href="https://github.com/hakatashi">@hakatashi</a></p>
					<div className={style.card}>
						<p>
							今から流れる音声を聞いて、<br/>
							人間の歌声か合成音声の歌声か当ててください
						</p>
						<button type="button" onClick={onClickStart}>
							はじめる
						</button>
					</div>
				</div>
			)}
			{phase === 'game' && (
				<div className={style.player}>
					<ReactPlayer
						ref={playerEl}
						url={song.url}
						controls
						playing={playing}
						volume={(tick % 100) / 300}
						onReady={onPlayerReady}
					/>
				</div>
			)}
		</div>
	);
};

export default App;
