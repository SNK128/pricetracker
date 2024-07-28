"use client" //if u need interctivity , consider converting part of this to a client component
import { scrapeAndStoreProduct } from '@/lib/actions';
//import React from 'react'   // use a rafce to create a base react arrow component  install ES7+ react... to use this shortcut

import { FormEvent, useState } from 'react'



const isValidAmazonProductURL = (url:string) => {
  try {
    const parsedURL=new URL(url);
    const hostname=parsedURL.hostname;

    // check if hostname contains amazom.com or amazom.any county name
    if(hostname.includes('amazon.com') || hostname.includes('amazon.') || hostname.endsWith('amazon'))
    {
      return true;
    }
  } catch (error) {
    return false; //if something wents wrong its still not a valid URL
  }
  return false;
}

const Searchbar = () => {
  const [searchPrompt, setSearchPrompt] = useState('');
  const [isLoading, setisLoading] = useState(false);

  const handleSubmit= async(event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    const isValidLink = isValidAmazonProductURL(searchPrompt);

    //alert(isValidLink? 'Valid Link' : 'Invalid Link')
    if(!isValidLink) return alert('Please provide a valid amazon link')

      try {
        setisLoading(true);

        //scrape the product page\
        // create first server action
        const product=await scrapeAndStoreProduct(searchPrompt);

      } catch (error) {
        console.log(error);
        
      } finally {
        setisLoading(false);
      }

  }
  return (
    <form 
    className="flex flex-wrap gap-4 mt-12" 
    // onsubmit is used for interactivity
    onSubmit={handleSubmit}  
    >
      <input 
      type="text"
      value={searchPrompt}
      onChange={(e) => setSearchPrompt(e.target.value)}
      placeholder="Enter product link"
      className="searchbar-input"
       />

       <button 
       type="submit" 
       className="searchbar-btn"
       disabled={searchPrompt===''}
       > 
        {isLoading ? 'Searching...' :'Search'}
       </button> 

    </form>
  )
}

export default Searchbar