const mongoose = require('mongoose');

const UploadImageSchema = new mongoose.Schema({
  resourceType: {
    type: String,
    required: true,
    trim: true
  },
  resourceId: {
    type: mongoose.Schema.Types.ObjectId,
    required: true
  },
  files: [
    { 
      fieldName: {
        type: String,
        required: true,
        trim: true
      },
      hashType: {
        type: String,
        required: true,
        trim: true,
        default: 'sha256'
      },
      hash: {
        type: String,
        required: true,
        trim: true,
      },
      originalFileName: {
        type: String,
        required: true,
        trim: true,
      },
      filename: {
        type: String,
        required: true,
        trim: true,
      },
      sizeInBytes: {
        type: Number,
        required: true,
      },
      mimeType: {
        type: String,
        required: true,
        trim: true,
      }
    }
  ]
}, { versionKey: false });

const UploadModel = mongoose.model("UploadImageCanditate", UploadImageSchema);

module.exports = UploadModel;
