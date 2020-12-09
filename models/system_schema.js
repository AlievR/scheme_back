const {Schema,model,Types} = require("mongoose")

const schema = new Schema ({
    name: {type: String, required: true},
    fileSrc: {type: String, required: true, unique: true},
    id_group: {type: Types.ObjectId},
    size: {type: String, required: true},
}, {
    timestamps:true
}

)
module.exports = model('schems_lists', schema)