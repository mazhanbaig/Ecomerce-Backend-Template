const mongoose = require("mongoose");

const productSchema = new mongoose.Schema({
    createdBy: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        required: true
    },
    name: {
        type: String,
        required: true,
        trim: true
    },
    slug: {
        type: String,
        unique: true,
        sparse: true
    },
    description: {
        type: String,
        required: true
    },
    price: {
        type: Number,
        required: true
    },
    stock: {
        type: Number,
        required: true,
        default: 0
    },
    category: {
        type: String,
        required: true,
        trim: true,
        default: "all"
    },
    images: [{
        type: String
    }],
    isActive: {
        type: Boolean,
        default: true
    }
}, { timestamps: true });

function createSlug(text) {
    return text
        .toString()
        .toLowerCase()
        .trim()
        .replace(/\s+/g, '-')
        .replace(/[^\w\-]+/g, '')
        .replace(/\-\-+/g, '-')
        .replace(/^-+/, '')
        .replace(/-+$/, '');
}

// pre save hook
productSchema.pre('save', async function () {
    if (this.isModified('name') || !this.slug) {
        let baseSlug = createSlug(this.name);
        let slug = baseSlug;
        let counter = 1;

        const existingProduct = await mongoose.model('Product').findOne({ slug });

        if (existingProduct && existingProduct._id.toString() !== this._id?.toString()) {
            while (true) {
                slug = `${baseSlug}-${counter}`;
                const slugExists = await mongoose.model('Product').findOne({ slug });
                if (!slugExists || slugExists._id.toString() === this._id?.toString()) break;
                counter++;
            }
        }

        this.slug = slug;
    }
});

// pre update hook
productSchema.pre('findOneAndUpdate', async function () {
    const update = this.getUpdate();
    if (update.name) {
        let baseSlug = createSlug(update.name);
        let slug = baseSlug;
        let counter = 1;

        const docToUpdate = await this.model.findOne(this.getQuery());
        if (docToUpdate && docToUpdate.name !== update.name) {
            const existingProduct = await mongoose.model('Product').findOne({ slug });
            if (existingProduct && existingProduct._id.toString() !== docToUpdate._id.toString()) {
                while (true) {
                    slug = `${baseSlug}-${counter}`;
                    const slugExists = await mongoose.model('Product').findOne({ slug });
                    if (!slugExists) break;
                    counter++;
                }
            }
            this.set({ slug });
        }
    }
});

const Product = mongoose.model("Product", productSchema);
module.exports = Product;