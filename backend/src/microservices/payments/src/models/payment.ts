import { Schema, model, Model, Document } from 'mongoose';

interface FlightUserPayment extends Document {
  userId: string;
  flightId: string;
  isPaid: boolean;
}
export interface FlightUserPaymentMethods {
}
type PaymentModel = Model<FlightUserPayment, {}, FlightUserPaymentMethods>;


const FlightUserPaymentSchema = new Schema({
  userId: { type: Schema.Types.ObjectId, ref: 'User', required: true },
  flightId: { type: Schema.Types.ObjectId, ref: 'Flight', required: true, unique: true},
  isPaid: { type: Boolean, default: false },
});


export const FlightUserPaymentModel = model<FlightUserPayment, PaymentModel>('FlightUserPayment', FlightUserPaymentSchema);