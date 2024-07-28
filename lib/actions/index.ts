// implementing the server action and our first scrapping functionality

"use server"

import { scrapeAmazonProduct } from "../scraper";

export async function scrapeAndStoreProduct(productUrl:string) {
    if(!productUrl) return;  //exit thr function

    try {
        const scrapedProduct=await scrapeAmazonProduct(productUrl);
        
    } catch (error:any) {
        throw new Error(`Failed to create/update product: ${error.message}`)
    }
}