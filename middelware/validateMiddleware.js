import Joi from "joi";
const bookSchema = Joi.object({
    title: Joi.string().required(),
    author: Joi.string().required(),
    price: Joi.number().positive().required(),
    pages:Joi.number().positive().required()
});

const bookPatchSchema = Joi.object({
    title: Joi.string(),
    author: Joi.string(),
    pages:Joi.number().positive(),
    price:Joi.number().positive()
}).min(1);

function validateBook(req,res,next){
    const {error} = bookSchema.validate(req.body, {abortEarly:false});
    if(error){
        res.status(400).json({
            error:error.details.map(d=> d.message).join(", ")
        });
        return;
    }
    next();
}

function validateBookPatch(req,res,next){
    const {error} = bookPatchSchema.validate(req.body, {abortEarly:false});
    if(error){
        res.status(400).json({
            error: error.details.map(d => d.message).join(", ")
        }
    );
        return;
    }
    next();
}
export {validateBook,validateBookPatch};