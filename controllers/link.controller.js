const Link = require("../model/linkModel");
const User = require("../model/userModel");


// get user's links

exports.getLinkData = async (req, res) =>{
    try{
        const {userId} =  req.body

        //  get User
        const user = await User.findById(userId)

        if(!user) res.status(400).send({ detail: "Error to get Link List" });
         res.send({result : true , error: false, message : "Got your Links", data: user.links});
        
    }catch(error){
        res.status(404).send({error: true, message : error.message, result: false});
    }
}


//  add Links

exports.addLinks = async (req, res)=>{
    try{
        const url = req.body.url
        const userId = req.body.userId
        // links.forEach(url => {

        // })
        let link =  new Link({
           link : url
        })
        //  add link data

        await link.getLinkData(url)
        await link.save()

        let user = await User.findById(userId)
        let linkList = user.links
        linkList = [...linkList, link]
        user.links = linkList
        link = await user.save()


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