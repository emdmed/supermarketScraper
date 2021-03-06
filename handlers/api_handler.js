const puppeteer = require("puppeteer");
const cheerio = require("cheerio");
const dia = require("../supermercados/dia");
const coto = require("../supermercados/coto");
const disco = require("../supermercados/disco");
const jumbo = require("../supermercados/jumbo");

const config = {
    supermarkets: {
        dia: true,
        coto: true,
        disco: true,
        jumbo: true
    },
    show_n_products: 10
}

const api_handler = {
    dia,
    coto,
    disco,
    jumbo,
    config
}

module.exports = api_handler;