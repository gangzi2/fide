var mongoose = require('mongoose');
var memberSchema = mongoose.Schema({
    name: {
        type: String,
        required: true
    },
    password: {
        type: String,
        required: true
    },
    status: {
        type: String,
        required: true
    },
    email: {
        type: String
    },
    telephone: {
        type: String
    }
});
var Member = module.exports = mongoose.model('Member', memberSchema);
//restful api for get method
module.exports.getMembers= function (callback, limit) {
    Member.find(callback).limit(limit);
};
module.exports.getMemberByName = function (name, callback) {
    var query ={name:name};
    Member.find(query, callback);
};
module.exports.getMemberById = function (id, callback) {
    Member.findById(id, callback);
};
//restful api for post method
module.exports.addMember = function (member, callback) {
    Member.create(member, callback);
};
