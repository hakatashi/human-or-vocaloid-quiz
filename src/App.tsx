import React, {useCallback, useEffect, useRef, useState} from 'react';
import ReactPlayer from 'react-player';
import style from './App.module.css';
import Game from './Game';

type Phase = 'start' | 'game' | 'finish';

const App = () => {
	const [tick, setTick] = useState(0);
	const [phase, setPhase] = useState<Phase>('start');
	const playerEl = useRef<ReactPlayer>(null);

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

	return (
		<div className={style.root}>
			{phase === 'start' && (
				<div>
					<h1><span className="human">人間</span>か<span className="vocaloid">ボカロ</span>かクイズ</h1>
					<p className={style.subtitle}>made by <a href="https://github.com/hakatashi">@hakatashi</a></p>
					<div className={style.card}>
						<p>
							これから流れる音声を聞いて、<br/>
							<span className="human">人間</span>の歌声か<span className="vocaloid">合成音声</span>の歌声か<wbr/>
							当ててください
						</p>
						<button type="button" onClick={onClickStart}>
							はじめる
						</button>
					</div>
				</div>
			)}
			{phase === 'game' && (
				<Game tick={tick} index={1}/>
			)}
		</div>
	);
};

export default App;
