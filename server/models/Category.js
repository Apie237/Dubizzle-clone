import mongoose from 'mongoose';

const categorySchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    unique: true
  },
  slug: {
    type: String,
    required: true,
    unique: true
  },
  icon: String,
  description: String,
  parentCategory: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Category'
  },
  customFields: [{
    fieldName: String,
    fieldType: {
      type: String,
      enum: ['text', 'number', 'dropdown', 'checkbox', 'radio']
    },
    options: [String],
    required: Boolean,
    placeholder: String
  }],
  isActive: {
    type: Boolean,
    default: true
  }
}, {
  timestamps: true
});

export default mongoose.model('Category', categorySchema);