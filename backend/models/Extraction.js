import mongoose from "mongoose";

const ExtractionSchema = new mongoose.Schema({
  fileName: String,
  type: String,
  text: String,
  metadata: Object,
  uploadedAt: { type: Date, default: Date.now },
});

const Extraction = mongoose.model("Extraction", ExtractionSchema);

export default Extraction;
