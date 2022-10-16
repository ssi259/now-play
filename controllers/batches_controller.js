const BatchManager = require("../services/batch_manager")
const models = require('../models');

var lib = require('../lib/upload_files_s3')

exports.search_batch = async(req,resp)=>{
        
    try{
        var input_response =  await BatchManager.pre_process_params(req,resp)
        var processed_reponse =  await BatchManager.process_batch_search_input_req(input_response)
        var post_process_response = await BatchManager.post_process_search_batch(req,resp,processed_reponse)
    }catch(e){
        console.log(e)
    }finally{
    }
}
exports.create_batch = async(req,resp) =>{

    try{
        var input_response = await BatchManager.pre_process_create_batch(req,resp)
        var processed_reponse =  await BatchManager.process_batch_create_input_req(input_response)
        var post_process_response = await BatchManager.post_process_create_batch(req,resp,processed_reponse)
    }catch(e){
        console.log(e)
    }finally{
    }
}
exports.uploadImage = async(req,resp)=>{
    console.log(req.files)
    if(req.files.files_name!=null){
        for(each_file of req.files.files_name){
            var image_location = await lib.uploadFile(each_file)
            const result = await  models.BatchPhotos.create({batch_id: req.query.batch_id,img_url: image_location}).then(function (arena) {
                console.log("batch photos updated")
                resp.send("file uploaded successfuly")
            })
            
        }
    }   
}
