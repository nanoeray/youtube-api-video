const youtubedl = require('youtube-dl-exec')
const express = require('express');
const http = require("http");
const https = require("https");
const app = express();
app.use(express.json());

app.post("/get", (req, res) => {
    const {url} = req.body;
    let sources;
    youtubedl(url, {
        dumpSingleJson: true,
        noCheckCertificates: true,
        noWarnings: true,
        preferFreeFormats: true,
        addHeader: [
            'referer:youtube.com',
            'user-agent:googlebot'
        ]

    }).then(output => {
        let videos = {};
        let formats = output.requested_downloads[0];
        formats = formats.requested_formats.filter(el => el.fps != null)[0];

        console.log(formats)
        videos = {url: formats.url, quality: formats.format_note, fps: formats.fps}



        // let formats = output.requested_downloads[0].requested_formats;
        sources = {
            sources: videos,
            thumbnail: output.formats[0].url
        }

        console.log(sources)
        res.status(200).json(sources);
    })
});

const httpServer = http.createServer(app);

httpServer.listen(80)