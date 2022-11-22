import React, {useCallback, useEffect, useRef, useState} from 'react';
import ReactPlayer from 'react-player';
import songs from '../data/songs.yml';
import style from './App.module.css';
import Game from './Game';

type Phase = 'start' | 'game' | 'finish';

const App = () => {
	const [songIndex, setSongIndex] = useState(0);
	const [phase, setPhase] = useState<Phase>('start');
	const playerEl = useRef<ReactPlayer>(null);
	const [results, setResults] = useState<{correct: boolean}[]>([]);

	const onClickStart = useCallback(() => {
		setPhase('game');
	}, [playerEl]);

	const onGameFinish = useCallback((result: {correct: boolean}) => {
		setResults((value) => [...value, result]);
		if (songIndex === songs.length - 1) {
			setPhase('finish');
		} else {
			setSongIndex((value) => value + 1);
		}
	}, [playerEl, songIndex]);

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
				<Game key={songIndex} index={songIndex + 1} song={songs[songIndex]} onFinish={onGameFinish}/>
			)}
			{phase === 'finish' && (
				<div>
					<h1>終わりです お疲れ様でした</h1>
					<p>{results.filter((result) => result.correct).length}問正解:tada:</p>
					<p>{JSON.stringify(results)}</p>
				</div>
			)}
		</div>
	);
};

export default App;
