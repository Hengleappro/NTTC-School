import type { ObjectId } from 'mongodb'

export interface User {
  _id: ObjectId
  email: string
  password: string
  username?: string
  role?: 'user' | 'admin'
  isVerified?: boolean
  createdAt?: Date
  updatedAt?: Date
}

export interface Course {
  _id: ObjectId
  title: string
  description: string
  thumbnailUrl: string
  instructorId: ObjectId
  duration: number // in minutes
  level: 'beginner' | 'intermediate' | 'advanced'
  lessons: Lesson[]
  createdAt: Date
  updatedAt: Date
}

export interface Lesson {
  _id: ObjectId
  title: string
  content: string
  duration: number // in minutes
  order: number
  videoUrl?: string
  resources: {
    name: string
    url: string
    type: 'pdf' | 'video' | 'link'
  }[]
}