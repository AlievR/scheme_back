const {Schema,model,Types} = require("mongoose")

const schema = new Schema ({
    name: {type: String, required: true, unique: true},
    gateway: {type: String, required: true, unique: true}
}, {
    timestamps:true
}

)

module.exports = model('System', schema)