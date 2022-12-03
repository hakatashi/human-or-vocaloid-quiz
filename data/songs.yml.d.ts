interface Song {
	url: string,
	originalUrl?: string,
	startTime: number,
	endTime: number,
	isHuman: boolean,
	title: string,
	artist: string,
	singer: string,
	chorusTime: number,
	engine?: string,
}

declare const value: Song[];

export = value;
