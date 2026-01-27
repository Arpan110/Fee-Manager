import mongoose, { Schema, Document, Model } from "mongoose";

export interface IStudent extends Document {
  name: string;
  studentId: string;
  className: string;
  village: string;
  phone: string;
  guardian: string;
  monthlyFee: number;
  isDeleted: boolean;
  createdAt: Date;
  updatedAt: Date;
}

const StudentSchema: Schema<IStudent> = new Schema(
  {
    name: { type: String, required: true },
    studentId: { type: String, required: true },
    className: { type: String, required: true },
    village: { type: String, required: true },
    phone: { type: String, required: true },
    guardian: { type: String, required: true },
    monthlyFee: { type: Number, required: true },
    isDeleted: { type: Boolean, default: false }
  },
  { timestamps: true }
);

const Student: Model<IStudent> =
  mongoose.models.Student || mongoose.model<IStudent>("Student", StudentSchema);

export default Student;
