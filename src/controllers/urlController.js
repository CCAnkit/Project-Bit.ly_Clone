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
        
        if (!validUrl.isUri(baseUrl)) {         // check base url if valid using the validUrl.isUri method
            return res.status(400).send({status: false, msg: 'Base URL is in Invalid format'})
        }
        if (!validator.isValidDetails(url)){
            return res.status(400).send({status: false, msg: `Invalid request parameters. Please provide url details`})
        }
        const { longUrl } = url         // destructure the longUrl from req.body.longUrl
        
        let newUrl = {}       //blank Object for the finalUrl

        if (!(validator.isValidValue(longUrl))){
            return res.status(400).send({ status: false, msg: "Please provide the longUrl" })   //longUrl is mandory 
        }

        if (validUrl.isUri(longUrl)) {         
            
            let isUrlUsed = await urlModel.findOne({longUrl});      //finding the longUrl in urlModel
            
            if (isUrlUsed) {
                res.status(400).json({ status: false, msg: "Long URL is already exits" });
            }
        } else {        // check the valid format of longUrl by using the validUrl.isUri method
            return res.status(400).send({status: false, msg: 'Long URL is in Invalid format'})
        }

        const urlCode = shortId.generate()         // if valid, we create the url code
        
        const shortUrl = baseUrl + '/' + urlCode        // join the generated short code the the base url
        
        newUrl.longUrl = longUrl        //storing the longUrl into the newUrl object
        newUrl.shortUrl = shortUrl          //storing the shortUrl into the newUrl object
        newUrl.urlCode = urlCode        //storing the urlCode into the newUrl object

        let finalData = await urlModel.create(newUrl)   //creating the ShortUrl   
        res.status(201).send({status: true, msg: "ShortUrl is created Successfully", data: finalData })
    }
    catch(err) {
        console.log(err)
        res.status(500).send({msg: err.message})
    }
}

// --------------get Url By urlCode-----------------------------------------------------------------------------------
const redirectUrl = async function(req, res) {
    try{
        let url = await urlModel.findOne({urlCode: req.params.urlCode})      //finding the urlCode in urlModel

        if (url) {     
            return res.status(301).redirect(url.longUrl)     // if url is valid we perform a redirect

        } else { 
            return res.status(404).send({status: false, msg: 'No URL Found'})   //If not found     
        }
    }
    catch(err) {
        console.log(err)
        res.status(500).send({msg: err.message})
    }
}

module.exports.urlShorten = urlShorten;
module.exports.redirectUrl = redirectUrl;
