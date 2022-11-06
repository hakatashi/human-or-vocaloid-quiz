import classNames from 'classnames';
import React, {useCallback, useRef, useState} from 'react';
import ReactPlayer from 'react-player';
import songs from '../data/songs.yml';
import style from './Game.module.css';

const FADE_DURATION = 2;

interface Prop {
	tick: number,
	index: number,
}

const Game = ({tick, index}: Prop) => {
	const [playing, setPlaying] = useState(false);
	const [selectedOption, setSelectedOption] = useState<boolean | null>(null);
	const playerEl = useRef<ReactPlayer>(null);

	const song = songs[0];

	const onPlayerReady = useCallback(() => {
		if (playerEl.current) {
			playerEl.current.seekTo(song.startTime);
		}
		setPlaying(true);
	}, [tick]);

	const onClickOption = useCallback((option: boolean) => {
		setSelectedOption(option);
	}, []);

	let volume = 1;
	if (playerEl.current) {
		const currentTime = playerEl.current.getCurrentTime();
		if (currentTime < song.startTime + FADE_DURATION) {
			volume = (currentTime - song.startTime) / FADE_DURATION;
		} else if (song.endTime - FADE_DURATION < currentTime) {
			volume = (song.endTime - currentTime) / FADE_DURATION;
		}
	}

	return (
		<div>
			<h2>第{index}/10問</h2>
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
			<div className={style.player}>
				<div className={classNames(style.playerOverlay, {[style.hidden]: selectedOption !== null})}>
					♪♪♪
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
