const mongoose = require('mongoose');
const { Schema } = mongoose;

const querySchema = new Schema({
    userEmail: { type: String, required: [true, "Please provide user's email address"] },
    query: { type: String, required: [true, 'Please provide a query from the user'] },
});

const virtual = querySchema.virtual('id');
virtual.get(function () {
    return this._id;
});
querySchema.set('toJSON', {
    virtuals: true,
    versionKey: false,
    transform: function (doc, ret) {
        delete ret._id;
    }
})

const QueryModel = mongoose.model('Query', querySchema);
exports.Query = QueryModel;