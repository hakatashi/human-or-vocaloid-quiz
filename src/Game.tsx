import classNames from 'classnames';
import {collection, addDoc} from 'firebase/firestore';
import {Howl} from 'howler';
import React, {useCallback, useEffect, useRef, useState} from 'react';
import ReactPlayer from 'react-player';
import style from './Game.module.css';
import {db} from './lib/firebase';

const FADE_DURATION = 2;

interface Song {
	url: string,
	startTime: number,
	endTime: number,
	isHuman: boolean,
	title: string,
	artist: string,
	singer: string,
	chorusTime: number,
	engine?: string,
}

interface Prop {
	index: number,
	totalLength: number,
	song: Song,
	onFinish: (result: {
		isHuman: boolean,
		selectedOption: boolean,
		isCorrect: boolean,
	}) => void,
	sessionId: string,
}

const correctSound = new Howl({
	src: ['correct.mp3'],
});

const incorrectSound = new Howl({
	src: ['incorrect.mp3'],
});

const Game = ({index, song, onFinish, sessionId, totalLength}: Prop) => {
	const [playing, setPlaying] = useState(false);
	const [isPlayerInitialized, setIsPlayerInitialized] = useState(false);
	const [volume, setVolume] = useState(1);
	const [finished, setFinished] = useState(false);
	const [replayCount, setReplayCount] = useState(1);
	const [selectedOption, setSelectedOption] = useState<boolean | null>(null);
	const [showPlayButton, setShowPlayButton] = useState(false);
	const [debug, setDebug] = useState('');
	const playerEl = useRef<ReactPlayer>(null);

	const isCorrect = selectedOption === null ? null : selectedOption === song.isHuman;

	const isPlayable = useCallback(() => {
		if (!isPlayerInitialized) {
			return false;
		}

		if (!playing) {
			return true;
		}

		if (!playerEl.current) {
			return false;
		}

		return true;
	}, [playing]);

	const isPlayableCheckin = useCallback(() => {
		if (isPlayable()) {
			return;
		}
		setShowPlayButton(true);
	}, [isPlayable]);

	useEffect(() => {
		setTimeout(() => {
			console.log('checkin');
			isPlayableCheckin();
		}, 3000);
	}, []);

	const onPlayerReady = useCallback(() => {
		playerEl.current?.seekTo(song.startTime);
		setPlaying(true);
		setIsPlayerInitialized(true);
		setShowPlayButton(false);
	}, [song, isPlayableCheckin]);

	const onClickOption = useCallback(async (option: boolean) => {
		if (option === song.isHuman) {
			correctSound.play();
		} else {
			incorrectSound.play();
		}

		setSelectedOption(option);
		setPlaying(true);
		setVolume(1);
		playerEl.current?.seekTo(song.chorusTime);

		await addDoc(collection(db, 'vocaloid_quiz_answers'), {
			song,
			index,
			replayCount,
			selectedOption: option,
			isCorrect: option === song.isHuman,
			sessionId,
			date: new Date(),
		});
	}, [song, index, replayCount, selectedOption, sessionId, isCorrect]);

	const onClickReplay = useCallback(() => {
		if (replayCount <= 0) {
			return;
		}

		playerEl.current?.seekTo(song.startTime);

		setPlaying(true);
		setFinished(false);
		setReplayCount(replayCount - 1);
	}, [replayCount, playerEl]);

	const onTick = useCallback(() => {
		if (!playerEl.current || selectedOption !== null) {
			return;
		}

		const currentTime = playerEl.current.getCurrentTime();
		setDebug(JSON.stringify({
			playerEl: playerEl.current !== undefined,
			selectedOption,
			currentTime,
			startTime: song.startTime,
		}));

		if (currentTime < song.startTime) {
			playerEl.current?.seekTo(song.startTime);
		}

		if (currentTime < song.startTime + FADE_DURATION) {
			setVolume((currentTime - song.startTime) / FADE_DURATION);
		} else if (song.endTime - FADE_DURATION < currentTime) {
			setVolume((song.endTime - currentTime) / FADE_DURATION);
		} else {
			setVolume(1);
		}

		if (song.endTime < currentTime && !finished) {
			setPlaying(false);
			setFinished(true);
		}
	}, [playerEl, finished, selectedOption]);

	const onPlayerProgress = useCallback(() => {
		setShowPlayButton(false);
		onTick();
	}, [onTick]);

	useEffect(() => {
		const intervalId = setInterval(() => {
			onTick();
		}, 1000);
		return () => {
			clearInterval(intervalId);
		};
	}, [onTick]);

	return (
		<div>
			<div className={style.descriptionSection}>
				<div className={style.questionSection}>
					<h2>第{index}/{totalLength}問</h2>
					<p>この歌声、<span className="human">人間？</span> <span className="vocaloid">ボカロ？</span></p>
					<div className={style.options}>
						<button
							type="button"
							className={style.option}
							onClick={() => onClickOption(true)}
						>
							<span className={classNames(style.optionName, 'human')}>
								人間
							</span><br/>
							<span className={style.description}>
								歌い手・VTuberなどの<wbr/>
								肉声をそのまま録音した歌声
							</span>
						</button>
						<button
							type="button"
							className={style.option}
							onClick={() => onClickOption(false)}
						>
							<span className={classNames(style.optionName, 'vocaloid')}>
								ボカロ
							</span><br/>
							<span className={style.description}>
								Vocaloid・SynthV・UTAUなど、<wbr/>
								合成音声による歌声
							</span>
						</button>
					</div>
				</div>
				{selectedOption !== null && (
					<div className={style.answerSection}>
						{isCorrect ? (
							<h2>正解！</h2>
						) : (
							<h2 className={style.incorrectAnswer}>不正解⋯⋯</h2>
						)}
						<p className={style.answerDescription}>
							この歌声は
							{song.isHuman ? <span className="human">人間</span> : <span className="vocaloid">合成音声</span>}
							です。
						</p>
						<div className={style.row}>
							<table className={style.songInfo}>
								<tr>
									<th>楽曲</th>
									<td>{song.title} by {song.artist}</td>
								</tr>
								<tr>
									<th>シンガー</th>
									<td>{song.singer}</td>
								</tr>
								{song.engine && (
									<tr>
										<th>歌唱エンジン</th>
										<td>{song.engine}</td>
									</tr>
								)}
							</table>
						</div>
						<div className={style.row}>
							<a
								href={song.url}
								className={style.youtubeLink}
								target="_blank"
								rel="noopener noreferrer"
							>
								YouTubeで観る
							</a>
						</div>
						<div className={style.row}>
							<button
								type="button"
								className={style.nextQuestion}
								onClick={() => {
									onFinish({
										isHuman: song.isHuman,
										selectedOption,
										isCorrect: isCorrect!,
									});
								}}
							>
								{index === totalLength - 1 ? '結果発表' : '次の問題へ'}
							</button>
						</div>
					</div>
				)}
			</div>
			<div className={style.player}>
				<div
					className={classNames(style.playerOverlay, {
						[style.hidden]: selectedOption !== null,
						[style.hasPlayButton]: showPlayButton,
					})}
				>
					{showPlayButton && (
						<button
							type="button"
							className={style.playButton}
						>
							再生されない場合<br/>ここをクリック
						</button>
					)}
					{finished && (
						<button
							type="button"
							className={classNames(
								style.replayButton,
								{[style.disabled]: replayCount === 0},
							)}
							onClick={onClickReplay}
						>
							リプレイ (あと{replayCount}回)
						</button>
					)}
					{!showPlayButton && !finished && (
						'♪♪♪'
					)}
				</div>
				<ReactPlayer
					ref={playerEl}
					url={song.url}
					width="100%"
					height="100%"
					controls
					playing={playing}
					volume={volume}
					onReady={onPlayerReady}
					onProgress={onPlayerProgress}
					progressInterval={100}
				/>
			</div>
			<p className={style.note}>
				※音声は必ずしも生声そのままではなく、<br/>
				エフェクトなどがかけられている可能性があります。
			</p>
		</div>
	);
};

export default Game;
