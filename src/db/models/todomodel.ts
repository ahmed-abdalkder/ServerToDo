import mongoose, { Document, Schema, model } from "mongoose";

export interface ITask {
   id?: string; 
  text?: string;
  completed?: boolean;
  date?: Date | null;
}

export interface ITodo extends Document {
  user?: mongoose.Types.ObjectId;
  title?: string;
  image: string;
  tasks: ITask[];
  createdAt: Date;
  updatedAt: Date;
}

const TaskSchema = new Schema<ITask>({
  text: { type: String },
  completed: { type: Boolean, default: false },
  date: { type: Date, default: null },
});

const todoSchema = new Schema<ITodo>({
  user: {
    type: Schema.Types.ObjectId,
    ref: "User",
  },
  title: { type: String },
   image: {
    secure_url: { type: String, required: true },
    public_id: { type: String, required: true },
  },
  tasks: [TaskSchema],
}, {
  versionKey: false,
  timestamps: true,
});

const todoModel = model<ITodo>("Todo", todoSchema);

export default todoModel;

