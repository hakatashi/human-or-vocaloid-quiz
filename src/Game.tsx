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
	const [startTick, setStartTick] = useState(0);
	const playerEl = useRef<ReactPlayer>(null);

	const song = songs[0];

	const onPlayerReady = useCallback(() => {
		if (playerEl.current) {
			playerEl.current.seekTo(song.startTime - 1);
		}
		setPlaying(true);
		setStartTick(tick);
	}, [tick]);

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
			<p>第{index}/10問</p>
			<p>この歌声、人間？ ボカロ？</p>
			<div className={style.options}>
				<button type="button" className={style.option}>
					<span className={style.optionName}>人間</span><br/>
					<span className={style.description}>
						歌い手・VTuberなどの<wbr/>
						肉声をそのまま録音した歌声
					</span>
				</button>
				<button type="button" className={style.option}>
					<span className={style.optionName}>ボカロ</span><br/>
					<span className={style.description}>
						Vocaloid・SynthV・UTAUなど、<wbr/>
						合成音声による歌声
					</span>
				</button>
			</div>
			<div className={style.player}>
				<div className={style.playerOverlay}>
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
