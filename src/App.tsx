import classNames from 'classnames';
import {Howl} from 'howler';
import React, {useCallback, useEffect, useRef, useState} from 'react';
import ReactPlayer from 'react-player';
import {TwitterIcon, TwitterShareButton, FacebookIcon, FacebookShareButton, LineIcon, LineShareButton} from 'react-share';
import {v4 as uuid} from 'uuid';
import songs from '../data/songs.yml';
import style from './App.module.css';
import Game from './Game';

interface Result {
	isHuman: boolean,
	selectedOption: boolean,
	isCorrect: boolean,
}

const drumSound = new Howl({
	src: ['drum.mp3'],
});

const doraSound = new Howl({
	src: ['dora.mp3'],
});

type Phase = 'start' | 'game' | 'finish';

const App = () => {
	const [songIndex, setSongIndex] = useState(0);
	const [phase, setPhase] = useState<Phase>('start');
	const playerEl = useRef<ReactPlayer>(null);
	const [results, setResults] = useState<Result[]>([]);
	const [sessionId, setSessionId] = useState('');
	const [resultShownIndex, setResultShownIndex] = useState(0);
	const correctCount = results.filter((result) => result.isCorrect).length;
	const shareText = (
		`人間かボカロかクイズで${results.length}問中${correctCount}問正解しました!\n`
		+ results.map((result) => result.isCorrect ? '🟩' : '⬜').join('')
	);
	const shareUrl = location.href.replace(location.hash, "");

	const onQuizFinish = (index: number) => {
		setResultShownIndex(index);
		if (index > 0) {
			drumSound.play();
		}
		if (index === songs.length + 1) {
			setTimeout(() => {
				setResultShownIndex(index + 1);
			}, 2000);
		}
		else if (index === songs.length) {
			setTimeout(() => {
				setResultShownIndex(index + 1);
				doraSound.play();
				onQuizFinish(index + 1);
			}, 1000);
		} else {
			setTimeout(() => {
				onQuizFinish(index + 1);
			}, 500);
		}
	};

	useEffect(() => {
		setSessionId(uuid());
	}, []);

	const onClickStart = useCallback(() => {
		setPhase('game');
	}, [playerEl]);

	const onGameFinish = useCallback((result: Result) => {
		setResults((value) => [...value, result]);
		if (songIndex === songs.length - 1) {
			setPhase('finish');
			onQuizFinish(0);
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
				<Game
					key={songIndex}
					index={songIndex + 1}
					song={songs[songIndex]}
					isLastSong={songIndex === songs.length - 1}
					onFinish={onGameFinish}
					sessionId={sessionId}
				/>
			)}
			{phase === 'finish' && (
				<div>
					<ol className={style.results}>
						{results.map((result, index) => (
							<li
								key={index}
								style={{
									visibility: index < resultShownIndex ? 'visible' : 'hidden',
								}}
							>
								<span className={style.index}>{index + 1}問目</span>
								<span
									className={classNames(style.result, result.isCorrect ? style.correct : style.wrong)}
								>
									{result.isCorrect ? '正解' : '不正解'}
								</span>
							</li>
						))}
					</ol>
					<p
						style={{
							visibility: resultShownIndex >= songs.length + 1 ? 'visible' : 'hidden',
						}}
					>
						{correctCount}問正解🎉
					</p>
					<p
						className="share"
						style={{
							visibility: resultShownIndex >= songs.length + 2 ? 'visible' : 'hidden',
						}}
					>
						<TwitterShareButton
							title={shareText}
							url={shareUrl}
						>
							<TwitterIcon size="1em" />
						</TwitterShareButton>
						<FacebookShareButton
							quote={shareText}
							url={shareUrl}
						>
							<FacebookIcon size="1em" />
						</FacebookShareButton>
						<LineShareButton
							title={shareText}
							url={shareUrl}
						>
							<LineIcon size="1em" />
						</LineShareButton>
					</p>
				</div>
			)}
		</div>
	);
};

export default App;
