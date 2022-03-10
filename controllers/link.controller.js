const Link = require("../model/linkModel");
const User = require("../model/userModel");
const fetch = require('cross-fetch');
const convert = require('xml-js')


// get user's links

exports.getLinkData = async (req, res) =>{
    try{
        const {userId} =  req.query

        //  get User
        const user = await User.findById(userId)

        if(!user){ res.status(400).send({ detail: "Error to get Link List" });}
        else if(user.isVerified){
            res.send({result : true , error: false, message : "Got your Links", data: user.links});
        }
        else{
            res.status(400).send({ detail: "Error to get Link List" })
        }
         
        
    }catch(error){
        res.status(404).send({error: true, message : error.message, result: false});
    }
}

// get user's links by username

exports.getLinkByUser = async (req, res) =>{
    try{
        const {userName} =  req.params

        //  get User
        const user = await User.findOne({username: userName})
        

        if(!user){ res.status(400).send({ message: "Error to get Link List" });}
        else if(user.isVerified){
            let stamp = new Date()
            
            let insightId = stamp.getTime()
            let date = stamp.toLocaleDateString('en-IN')
            
            let [filter] = user.insight.filter((item) => item.date === date )
            if(!filter){
                user.insight =  [...user.insight, {
                    insightId,
                    date,
                    createdTimestamp : stamp,
                    lastUpdatedTimeStamp : stamp,
                    counts: 1
                }]
            }else{
                user.insight[user.insight.indexOf(filter)].counts++
                user.insight[user.insight.indexOf(filter)].lastUpdatedTimeStamp = stamp
            }
            // await user.save()

            let u = await User.findByIdAndUpdate(user._id,{
                views : user.views + 1, 
                linkCount : user.links.length,
                insight : [...user.insight]
            } )
            res.send({result : true , error: false, message : "Got your Links", data: {name : u.name, username: u.username, views: u.views, insight: u.insight}, urls: u.links});
        }
        else{
            res.status(400).send({ message: "Error to get Link List" })
        }
         
        
    }catch(error){
        res.status(404).send({error: true, message : error.message, result: false});
    }
}

//  add Links

exports.addLinks = async (req, res)=>{
    try{
        const url = req.body.url
        const userId = req.body.userId
        
        //  add link data
        let link =  new Link({
           link : url,
           by: userId
        })
        

        await link.getLinkData(url)
        await link.save()
        let user = await User.findById(userId)
        link = await User.findByIdAndUpdate(userId, {links : [...user.links, link ]})
        


        if (!link) {
            res.status(404).send({ message: "cannot add a link", result: false, error: true });
        }else{
            res.send({message: "Successfully link added", result: true, error: false, data: link})
        }
    }
    catch(error){
        res.status(404).send({error: true, message : error.message, result: false})
    }
}


//  add sitemap

exports.addSitemap = async (req, res)=>{
    try{
        const url = req.body.url
        const userId = req.body.userId

        //  sitemap link

        let user = await User.findById(userId)
        let maps = user.sitemaps
        maps = [...maps, url]
        maps = maps.filter((item,index) => maps.indexOf(item) === index)
        user.sitemaps = maps
        user = await user.save()
        user? res.send({data:user, message: "Successfully added", result:true, error: false}) : res.status(400).send({error: true, result: false, message:"cannot add your sitemap"})
       
    }
    catch(error){
        res.status(404).send({error: true, message : error.message, result: false})
    }
}

//  del Links

exports.delLink = async (req, res)=>{
    try{
        const urlId = req.body.url
        const userId = req.body.userId
        
        //  del link data

        await Link.findByIdAndRemove(urlId)
        
        let links = await Link.find({by: userId})

        let user = await User.findById(userId)
        user.links = links
        let link = await user.save()


        if (!link) {
            res.status(404).send({ message: "cannot del a link", result: false, error: true });
        }else{
            res.send({message: "Successfully link added", result: true, error: false, data: link})
        }
    }
    catch(error){
        res.status(404).send({error: true, message : error.message, result: false})
    }
}

// REDIRECT LINK

exports.redirectUrl = async(req, res)=>{
    let ShortId = req.params.shortId
    
    try{
        let filter = {
        shorturl : ShortId
    }
    
    let getUrlData =  await Link.findOne(filter)
    getUrlData.views++
    await getUrlData.save()

    let userId  = getUrlData.by
    let links = await Link.find({by: userId})
    let user = await User.findByIdAndUpdate(userId,{links : links})
    



   let REDIRECT_LINK = await Link.findOne(filter)

   !REDIRECT_LINK ? res.send({result: false, error:{message: "Inavlid url"}, message: "May be Invalid Url", data: null})
        :
        res.send({result: true, error:null, message:"Successfull!", data: REDIRECT_LINK, url : REDIRECT_LINK.link})

}catch(err){
    return res.status(400).send({result: false, error:true, message:err.message})
}
}



//  fetch sitemaps

exports.fetchSitemaps = async(req, res) => {
    // fetch xml - sitemap
let userName = req.params.username
let result = []

let user = await User.findOne({username : userName})
let lastIndex = user.sitemaps.length -1
 await user.sitemaps.forEach(async (link, index)=>{
    
        let xmlData = await fetch(link).then(res=> res.text())

        let data = await JSON.parse(convert.xml2json(xmlData, {compact: true}))
        
        data = data.urlset.url

       if(index === lastIndex){
        result.push(data)
        res.send(result)
       }else{
        result.push(data)
       }
    })
 


// add links

// data.forEach(({loc})=>{
//     let link =  new Link({
//         link : loc._text,
//         by: user._id
//      })
     

//      await link.getLinkData(url)
//      await link.save()

//      let user = await User.findById(userId)
//      let linkList = user.links
//      linkList = [...linkList, link]
//      user.links = linkList
//      link = await user.save()


//      if (!link) {
//          res.status(404).send({ message: "cannot add a link", result: false, error: true });
//      }
// })
}