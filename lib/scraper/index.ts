import { hostname } from "os";

import axios from "axios";
import * as cheerio from 'cheerio';
import { extractPrice } from "../utils";

export async function scrapeAmazonProduct(url:string) {

    if(!url) return;

    //BrightData proxy configuration...This is going to ensure that we can actually use right data scraping to able to get the product data

    //  curl --proxy brd.superproxy.io:22225 --proxy-user brd-customer-hl_f33e2f21-zone-pricetrackerr:war57elvzjyd -k 
    //  "https://geo.brdtest.com/mygeo.json"

    const username=String(process.env.BRIGHT_DATA_USERNAME);
    const password=String(process.env.PASSWORD);
    const port=22225;
    const session_id=(1000000 *Math.random()) | 0;
    const options= {
        auth: {
            username:`${username}-session-${session_id}`,
            password,
        },
        host:`brd.superproxy.io`,
        port,
        rejectUnauthorised:false,
    }
    try {
        //fetch the product page
        const response=await axios.get(url,options);   //axios is used to make API calls


        // console.log(response.data); // unfiltered data is shown in terminal which is scraped from web page

        const $=cheerio.load(response.data); // cheerio helps us to easily the values which are meaningful in sense
        //extract the product title
        const title=$('#productTitle').text().trim();
        
        //id-keywords actually used in amazon website
        const currentPrice=extractPrice(
            $('.priceToPay span.a-price-whole'),
            $('a.size.base.a-color-price'),
            $('.a-button-selected .a-color-base'),
            $('.a-price.a-text-price')
        );

        const originalPrice = extractPrice(
            $('#priceblock_ourprice'),
            $('.a-price.a-text-price span.a-offscreen'),
            $('#listPrice'),
            $('#priceblock_dealprice'),
            $('.a-size-base.a-color-price')
          );

          const outOfStock = $('#availability span').text().trim().toLowerCase() === 'currently unavailable';

          const images = 
                $('#imgBlkFront').attr('data-a-dynamic-image') || 
                $('#landingImage').attr('data-a-dynamic-image');



        console.log({title,currentPrice,originalPrice,outOfStock,images})

    } catch (error:any) {
        throw new Error(`Failed to scrape product:${error.message}`)
    }
}