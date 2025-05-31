// server/models/Course.ts
import { Schema, model, Types } from 'mongoose';

interface IResource {
  name: string;
  url: string;
}

interface ILesson {
  _id: Types.ObjectId; // Explicitly use ObjectId for subdocuments
  title: string;
  duration?: string;
  content?: string;
  link?: string;
  image?: string;
  videoUrl?: string;
  resources?: IResource[];
  free?: boolean;
}

interface ICourse {
  title: string;
  description: string;
  image: string; // Cloudinary URL
  duration?: string;
  level?: 'Beginner' | 'Intermediate' | 'Advanced';
  lessons: ILesson[];
}

const ResourceSchema = new Schema<IResource>({
  name: { type: String, required: true },
  url: { type: String, required: true },
}, { _id: false }); // Do not create _id for resources if not needed, or true if they need unique IDs

const LessonSchema = new Schema<ILesson>({
  _id: { type: Schema.Types.ObjectId, default: () => new Types.ObjectId() }, // Mongoose will auto-generate if not provided
  title: { type: String, required: true },
  duration: { type: String },
  content: { type: String },
  link: { type: String },
  image: { type: String },
  videoUrl: { type: String },
  resources: [ResourceSchema],
  free: { type: Boolean, default: false },
});

const CourseSchema = new Schema<ICourse>({
  title: { type: String, required: true, trim: true },
  description: { type: String, required: true },
  image: { type: String, required: true },
  duration: { type: String },
  level: { type: String, enum: ['Beginner', 'Intermediate', 'Advanced'], default: 'Beginner' },
  lessons: [LessonSchema], // Array of lesson subdocuments
}, { timestamps: true });

const CourseModel = model<ICourse>('Course', CourseSchema);

export default CourseModel;