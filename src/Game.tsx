import React, {useCallback, useRef, useState} from 'react';
import ReactPlayer from 'react-player';
import songs from '../data/songs.yml';
import style from './App.module.css';

interface Prop {
	tick: number,
}

const Game = ({tick}: Prop) => {
	const [playing, setPlaying] = useState(false);
	const playerEl = useRef<ReactPlayer>(null);

	const song = songs[0];

	const onPlayerReady = useCallback(() => {
		if (playerEl.current) {
			playerEl.current.seekTo(song.startTime);
		}
		setPlaying(true);
	}, []);

	return (
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
	);
};

export default Game;
