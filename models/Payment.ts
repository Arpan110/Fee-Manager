    import mongoose, { Schema, Document, Model } from "mongoose";

    export interface IPayment extends Document {
    studentId: mongoose.Types.ObjectId;
    month: string;
    year: number;
    status: "PAID" | "UNPAID";
    amount: number;
    paidAt?: Date;
    createdAt: Date;
    updatedAt: Date;
    }

    const PaymentSchema: Schema<IPayment> = new Schema(
    {
        studentId: { type: Schema.Types.ObjectId, ref: "Student", required: true },
        month: { type: String, required: true },
        year: { type: Number, required: true },
        status: { type: String, enum: ["PAID", "UNPAID"], default: "UNPAID" },
        amount: { type: Number, required: true },
        paidAt: { type: Date }
    },
    { timestamps: true }
    );

    const Payment: Model<IPayment> =
    mongoose.models.Payment || mongoose.model<IPayment>("Payment", PaymentSchema);

    export default Payment;
