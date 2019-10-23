const puppeteer = require("puppeteer");
const cheerio = require("cheerio");
const dia = require("../supermercados/dia");
const coto = require("../supermercados/coto");
const disco = require("../supermercados/disco");

const config = {
    supermarkets: {
        dia: true,
        coto: true,
        disco: false
    }
}


const api_handler = {
    dia,
    coto,
    disco,
    config
}

module.exports = api_handler;