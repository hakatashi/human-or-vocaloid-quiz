declare module '*/songs.yml' {
	interface Song {
		url: string,
		startTime: number,
		endTime: number,
		isHuman: boolean,
		title: string,
		artist: string,
		singer: string,
	}
	const value: Song[];
	export default value;
}
