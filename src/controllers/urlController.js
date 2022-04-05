const urlModel = require("../models/urlModel.js");
const express = require('express');
const validUrl = require('valid-url')
const shortId = require('shortid')
const validator = require("../validators/validator.js");


const baseUrl = `http://localhost:3000`;      // The API base Url endpoint


// ----------------URL Shorten-----------------------------------------------------------------------------------
const urlShorten = async function(req, res) {
    try{
        const url = req.body
        
        if (!validator.isValidDetails(url)){
            return res.status(401).send({status: false, msg: `Invalid request parameters. Please provide Url details`})
        }
       
        if (!validUrl.isWebUri(baseUrl)) {     // check the valid format of baseUrl by using the validUrl.isWebUri method
            return res.status(401).send({status: false, msg: 'Base URL is in Invalid format'})
        }
        const { longUrl } = url         // destructure the longUrl from req.body.longUrl

        let newUrl = {}       //blank Object 

        if (!(validator.isValidValue(longUrl))){
            return res.status(400).send({ status: false, msg: "Please provide the longUrl" })   //longUrl is mandory 
        }
        if (!validUrl.isWebUri(longUrl)) {     // check the valid format of longUrl by using the validUrl.isWebUri method
            return res.status(401).send({status: false, msg: 'Long URL is in Invalid format'})
        }
        
        let isLongUrlExist = await urlModel.findOne({longUrl}); //finding the longUrl in the urlModel
        
        if (isLongUrlExist) {     //if exist sends the shortUrl/urlCode 
            return res.status(200).send({status: false, msg: 'Short URL is already Exist', data: { longUrl: isLongUrlExist.longUrl, urlCode : isLongUrlExist.urlCode, shortUrl : isLongUrlExist.shortUrl} })
        }
        const urlCode = shortId.generate().toLowerCase()       // if valid, we create the url code

        const isUrlCodeExist = await urlModel.findOne({urlCode}); //finding the urlCode in the urlModel

        if (isUrlCodeExist) {
            return res.status(401).send({ status: false, msg: "URL code is already exits, Create another UrlCode" });
        }

        const shortUrl = baseUrl + '/' + urlCode        // join the generated short code with the base url
        
        newUrl.longUrl = longUrl        //storing the longUrl into the newUrl object
        newUrl.shortUrl = shortUrl          //storing the shortUrl into the newUrl object
        newUrl.urlCode = urlCode        //storing the urlCode into the newUrl object

        let finalData = await urlModel.create(newUrl)   //creating the ShortUrl   
        return res.status(201).send({status: true, msg: "ShortUrl is created Successfully", data: finalData })
    }
    catch(err) {
        console.log(err)
        return res.status(500).send({msg: err.message})
    }
}

// --------------Redirected the LongUrl-----------------------------------------------------------------------------------
const redirectUrl = async function(req, res) {
    try{
        const urlCode = req.params.urlCode
        const url = await urlModel.findOne({urlCode: urlCode})      //finding the urlCode in urlModel
        if (url) {     
            return res.status(301).redirect(url.longUrl)     // if url is valid we perform a redirect

        } else { 
            return res.status(404).send({status: false, msg: 'No URL Found'})   //If not found     
        }
    }
    catch(err) {
        console.log(err)
        return res.status(500).send({msg: err.message})
    }
}

module.exports.urlShorten = urlShorten;
module.exports.redirectUrl = redirectUrl;
