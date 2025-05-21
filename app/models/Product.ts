import mongoose from 'mongoose';

const productSchema = new mongoose.Schema(
	{
		id: {
			type: String,
			required: true,
			unique: true,
		},
		title: {
			type: String,
			required: true,
		},
		link: {
			type: String,
			required: true,
		},
		image_link: {
			type: String,
			required: true,
		},
		price: {
			amount: {
				type: Number,
				required: true,
			},
			currency: {
				type: String,
				required: true,
				default: 'USD',
			},
		},
		availability: {
			type: String,
			required: true,
		},
	},
	{
		timestamps: true,
	}
);

// Create indexes for better search performance
productSchema.index({ title: 'text' });

export default mongoose.models.Product ||
	mongoose.model('Product', productSchema);
