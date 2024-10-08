import { hostname } from "os";

import axios from "axios";
import * as cheerio from 'cheerio';
import { extractCurrency, extractDescription, extractPrice } from "../utils";

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
        
        //id-keywords actually used in amazon web-site
        const currentPrice=extractPrice(
            $('.priceToPay span.a-price-whole'),
            $('a.size.base.a-color-price'),
            $('.a-button-selected .a-color-base'),
            $('.a-price.a-text-price') ///////////////////////////////////////original price
        );

        const originalPrice = extractPrice(
            $('#priceblock_ourprice'),
            $('.a-price.a-text-price span.a-offscreen'),
            $('#listPrice'),
            $('#priceblock_dealprice'),
            $('.a-size-base.a-color-price')
          );

          const outOfStock = $('#availability span').text().trim().toLowerCase() === 'currently unavailable';//#a-size-medium a-color-success

          const images = 
                $('#imgBlkFront').attr('data-a-dynamic-image') || 
                $('#landingImage').attr('data-a-dynamic-image')||
                '{}';

          const imageURLs=Object.keys(JSON.parse(images));

          const currency=extractCurrency($(' .a-price-symbol'))

          const discountRate=$('.savingsPercentage').text().replace(/[-%]/g,"");

          const description=extractDescription($)



        //console.log({title,currentPrice,originalPrice,outOfStock,images,imageURLs,currency,discountRate})

        //construct data obj with scraped info
        const data= {
            url,
            currency: currency|| '$',
            image: imageURLs[0],
            title,
            currentPrice: Number(currentPrice) || Number(originalPrice),
            originalPrice:Number(originalPrice) || Number(currentPrice),
            priceHistory: [],
            discountRate:Number(discountRate),
            category:'category',
            reviewsCount:100,
            stars:4.5,
            isOutOfStock:outOfStock,
            description,
            lowestPrice:Number(currentPrice) || Number(originalPrice),
            highestPrice:Number(originalPrice) || Number(currentPrice),
            averagePrice:Number(currentPrice) || Number(originalPrice),
        }

        console.log(data);
        return data;

    } catch (error:any) {
        throw new Error(`Failed to scrape product:${error.message}`)
    }
}