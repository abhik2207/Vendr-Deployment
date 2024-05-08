const mongoose = require('mongoose');
const { Schema } = mongoose;

const brandSchema = new Schema({
    value: { type: String, required: [true, 'Please provide value of brand'], unique: true },
    label: { type: String, required: [true, 'Please provide label of brand'], unique: true },
});

const virtual = brandSchema.virtual('id');
virtual.get(function () {
    return this._id;
});
brandSchema.set('toJSON', {
    virtuals: true,
    versionKey: false,
    transform: function (doc, ret) {
        delete ret._id;
    }
})

const BrandModel = mongoose.model('Brand', brandSchema);
exports.Brand = BrandModel;