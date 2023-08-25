const cheerio = require("cheerio");
const axios = require("axios");

const searchVideo = async (key) =>{
    if (key.length < 20) {
        const urlApi = `https://www.eporner.com/api/v2/video/search/?query=${key}&per_page=5&page=1&thumbsize=small&order=top-weekly&gay=1&lq=2&format=json`;

        const axiosResponse = await axios.request({
            method: "GET",
            url: urlApi,
            headers: {
                "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/108.0.0.0 Safari/537.36"
            }
        });
        console.log("url api :", axiosResponse.data.videos);
        return axiosResponse.data;
    }

}
const performScraping = async (url) =>{
    // downloading the target web page
    // by performing an HTTP GET request in Axios
    const axiosResponse = await axios.request({
        method: "GET",
        url: url,
        headers: {
            "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/108.0.0.0 Safari/537.36"
        }
    })
    const $ = cheerio.load(axiosResponse.data);
    const downloaddiv = $("#downloaddiv");
    const porn_dload = downloaddiv.find("#hd-porn-dload");
    const container_link = porn_dload.find(".dloaddivcol");
    let urlVideo = "";
    let videoInfo;
    const all_link = container_link.each((index, element) => {
        // console.log("element : ",element);
        const video = $(element).find("a").attr("href");
        console.log(video);
        const videoSize = $(element).find("a").html();
        console.log(videoSize);
        urlVideo = video;
        const regex = /(\d+\.\d+)\sMB/;  // Recherche d'un nombre décimal suivi de MB

        const match = videoSize.match(regex);

        if (match) {
            const size = match[1]; // Le premier groupe de capture contient le nombre
            console.log("video size : ", size);
            videoInfo = {
                url: `https://www.eporner.com${video}`,
                size: size
            }
            console.log("video info : ", videoInfo);
        } else {
            console.log("Aucune correspondance trouvée.");
        }
    });
    console.log("url video :", urlVideo);
    return urlVideo;

}

module.exports={
    searchVideo,
    performScraping
}