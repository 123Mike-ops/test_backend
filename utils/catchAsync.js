// for controller function with async 

module.exports=fn=>{
    return (req,res,next)  =>{
        fn(req,res,next).catch(next)  
    }
                       //uses for only asyncronous function
}