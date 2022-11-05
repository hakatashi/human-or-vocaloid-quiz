interface Song {
	url: string,
	startTime: number,
	endTime: number,
	isHuman: boolean,
	title: string,
	artist: string,
	singer: string,
}

declare const value: Song[];

export = value;
