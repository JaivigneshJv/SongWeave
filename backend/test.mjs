import { Downloader } from 'ytdl-mp3';
import YouTube from "youtube-sr";


const videos = await YouTube.search("dance monkey", { limit: 1 });

const downloader = new Downloader({
    outputDir: "./assets",
    getTags: true,
});

console.log(await downloader.downloadSong(videos[0].url))



