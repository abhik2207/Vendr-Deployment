const mongoose = require('mongoose');
const { Schema } = mongoose;

const productSchema = new Schema({
    title: { type: String, required: [true, 'Please provide a title for the product'], unique: true },
    brand: { type: String, required: [true, 'Please provide a brand for the product'] },
    category: { type: String, required: [true, 'Please provide a category for the product'] },
    description: { type: String, required: [true, 'Please provide a description for the product'] },
    price: { type: Number, min: [0, 'Price of product cannot be less than 0'], required: [true, 'Please provide a price for the product'], max: [100000, 'Price of product cannot be greater than 100,000'] },
    discountPercentage: { type: Number, min: [0, 'Discount percentage of product cannot be less than 0'], max: [90, 'Discount percentage of product cannot be gearter than 90'] },
    rating: { type: Number, min: [0, 'Rating of product cannot be less than 0'], max: [5, 'Rating of product cannot be greater than 5'], default: 0 },
    stock: { type: Number, min: [0, 'Stock of product cannot be less than 0'], default: 0 },
    thumbnail: { type: String, required: [true, 'Provide a thumbnail of the product'] },
    images: [String],
    colors: { type: [Schema.Types.Mixed] },
    sizes: { type: [Schema.Types.Mixed] },
    highlights: { type: [String] },
    deleted: { type: Boolean, default: false }
});

const virtual = productSchema.virtual('id');
virtual.get(function () {
    return this._id;
});
productSchema.set('toJSON', {
    virtuals: true,
    versionKey: false,
    transform: function (doc, ret) {
        delete ret._id;
    }
})

const ProductModel = mongoose.model('Product', productSchema);
exports.Product = ProductModel;