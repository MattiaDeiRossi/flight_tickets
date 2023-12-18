import { Schema, model, Document } from 'mongoose';

interface FlightUserPayment extends Document {
  userId: string;
  flightId: string;
  isPaid: boolean;
}

const FlightUserPaymentSchema = new Schema({
  userId: { type: Schema.Types.ObjectId, ref: 'User', required: true },
  flightId: { type: Schema.Types.ObjectId, ref: 'Flight', required: true },
  isPaid: { type: Boolean, default: false },
});

FlightUserPaymentSchema.methods.setPassword = function (req: boolean) {
  this.isPaid = req
}

const FlightUserPaymentModel = model<FlightUserPayment>('FlightUserPayment', FlightUserPaymentSchema);

export default FlightUserPaymentModel;
