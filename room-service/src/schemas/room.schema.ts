import mongoose from 'mongoose';

// Sub-schema for drawing objects
const DrawingSchema = new mongoose.Schema(
  {
    id: { type: String, required: true },
    type: {
      type: String,
      enum: ['line', 'circle', 'rectangle'],
      required: true,
    },
    coordinates: { type: Object, required: true }, 
    style: { type: Object }, 
    createdBy: { type: String, required: true },
    createdAt: { type: Date, default: Date.now },
  },
  { _id: false }, // don't generate _id for subdocs
);

// Main schema for a room/canvas
const RoomSchema = new mongoose.Schema({
  _id: {
    type: String,
    default: () => new mongoose.Types.ObjectId().toString(),
  },
  name: { type: String, required: true },
  ownerId: { type: String, required: true },
  shareableLinkKey: { type: String, unique: true, required: true },
  drawings: { type: [DrawingSchema], default: [] }, // embedded drawings
  createdAt: { type: Date, default: Date.now },
  lastModifiedAt: { type: Date, default: Date.now },
  asOf: { type: Number }, 
});

// Create & export the model
export default mongoose.model('Room', RoomSchema);
