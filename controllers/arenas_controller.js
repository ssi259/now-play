const ArenaManager = require("../services/arena_manager")
exports.create_arena = async(req,resp)=>{
        
    try{
        var input_response =  await ArenaManager.pre_process_create_arena(req,resp)
        var processed_reponse =  await ArenaManager.process_arena_input_req(input_response)
        var post_process_response = await ArenaManager.post_arena_process(req,resp,processed_reponse)
    }catch(e){
        console.log(e)
    }finally{
    }
}




exports.arena_image_upload = async (req, res) =>{
    try {
        const file = req.file
        console.log("file", file);
        return res.send({ message: 'File uploaded successfully.', file });
        // res.send({ "details": "file received", "req":req.body });
    } catch (e) {
        console.log(e)
    }
}