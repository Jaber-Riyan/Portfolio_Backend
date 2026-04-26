import mongoose, { Document, Schema } from 'mongoose';

export interface IHero {
  title: string;
  subtitle: string;
  description: string;
  image: string;
  socialLinks: {
    github?: string;
    linkedin?: string;
    twitter?: string;
    instagram?: string;
  };
}

export interface IAbout {
  description: string;
  experience: number;
  clients: number;
  projects: number;
  years: number;
  avatar: string;
  email: string;
  phone: string;
  address: string;
}

export interface ISkill {
  name: string;
  level: number;
  category?: string;
}

export interface IExperience {
  title: string;
  company: string;
  duration: string;
  description: string;
  current?: boolean;
}

export interface IProject {
  title: string;
  description: string;
  technologies: string[];
  image: string;
  link?: string;
  github?: string;
  featured: boolean;
}

export interface IEducation {
  degree: string;
  institution: string;
  year: string;
  description?: string;
}

export interface IReview {
  name: string;
  role: string;
  content: string;
  avatar: string;
  rating: number;
}

export interface IBlog {
  title: string;
  slug: string;
  excerpt: string;
  content: string;
  image: string;
  date: string;
  tags: string[];
  published: boolean;
}

export interface IContact {
  email: string;
  phone: string;
  location: string;
  social: {
    github?: string;
    linkedin?: string;
    twitter?: string;
    youtube?: string;
  };
}

export interface IGreeting {
  title: string;
  description: string;
  ctaText: string;
  ctaLink: string;
}

export interface ITheme {
  primaryColor: string;
  secondaryColor: string;
  darkMode: boolean;
  font: string;
}

export interface IPortfolio extends Document {
  hero: IHero;
  about: IAbout;
  skills: ISkill[];
  experience: IExperience[];
  projects: IProject[];
  education: IEducation[];
  reviews: IReview[];
  blogs: IBlog[];
  contact: IContact;
  greeting: IGreeting;
  theme: ITheme;
  createdAt: Date;
  updatedAt: Date;
}

const HeroSchema = new Schema<IHero>({
  title: { type: String, default: '' },
  subtitle: { type: String, default: '' },
  description: { type: String, default: '' },
  image: { type: String, default: '' },
  socialLinks: {
    github: { type: String, default: '' },
    linkedin: { type: String, default: '' },
    twitter: { type: String, default: '' },
    instagram: { type: String, default: '' },
  },
});

const AboutSchema = new Schema<IAbout>({
  description: { type: String, default: '' },
  experience: { type: Number, default: 0 },
  clients: { type: Number, default: 0 },
  projects: { type: Number, default: 0 },
  years: { type: Number, default: 0 },
  avatar: { type: String, default: '' },
  email: { type: String, default: '' },
  phone: { type: String, default: '' },
  address: { type: String, default: '' },
});

const SkillSchema = new Schema<ISkill>({
  name: { type: String, required: true },
  level: { type: Number, required: true, min: 0, max: 100 },
  category: { type: String, default: '' },
});

const ExperienceSchema = new Schema<IExperience>({
  title: { type: String, required: true },
  company: { type: String, required: true },
  duration: { type: String, default: '' },
  description: { type: String, default: '' },
  current: { type: Boolean, default: false },
});

const ProjectSchema = new Schema<IProject>({
  title: { type: String, required: true },
  description: { type: String, default: '' },
  technologies: [{ type: String }],
  image: { type: String, default: '' },
  link: { type: String, default: '' },
  github: { type: String, default: '' },
  featured: { type: Boolean, default: false },
});

const EducationSchema = new Schema<IEducation>({
  degree: { type: String, required: true },
  institution: { type: String, required: true },
  year: { type: String, default: '' },
  description: { type: String, default: '' },
});

const ReviewSchema = new Schema<IReview>({
  name: { type: String, required: true },
  role: { type: String, default: '' },
  content: { type: String, required: true },
  avatar: { type: String, default: '' },
  rating: { type: Number, min: 1, max: 5, default: 5 },
});

const BlogSchema = new Schema<IBlog>({
  title: { type: String, required: true },
  slug: { type: String, required: true, unique: true },
  excerpt: { type: String, default: '' },
  content: { type: String, required: true },
  image: { type: String, default: '' },
  date: { type: String, default: '' },
  tags: [{ type: String }],
  published: { type: Boolean, default: false },
});

const ContactSchema = new Schema<IContact>({
  email: { type: String, default: '' },
  phone: { type: String, default: '' },
  location: { type: String, default: '' },
  social: {
    github: { type: String, default: '' },
    linkedin: { type: String, default: '' },
    twitter: { type: String, default: '' },
    youtube: { type: String, default: '' },
  },
});

const GreetingSchema = new Schema<IGreeting>({
  title: { type: String, default: '' },
  description: { type: String, default: '' },
  ctaText: { type: String, default: '' },
  ctaLink: { type: String, default: '' },
});

const ThemeSchema = new Schema<ITheme>({
  primaryColor: { type: String, default: '#007bff' },
  secondaryColor: { type: String, default: '#6c757d' },
  darkMode: { type: Boolean, default: false },
  font: { type: String, default: 'Inter' },
});

const PortfolioSchema = new Schema<IPortfolio>({
  hero: HeroSchema,
  about: AboutSchema,
  skills: [SkillSchema],
  experience: [ExperienceSchema],
  projects: [ProjectSchema],
  education: [EducationSchema],
  reviews: [ReviewSchema],
  blogs: [BlogSchema],
  contact: ContactSchema,
  greeting: GreetingSchema,
  theme: ThemeSchema,
}, {
  timestamps: true,
});

PortfolioSchema.index({ 'hero.title': 1 });
PortfolioSchema.index({ projects: 1 });
PortfolioSchema.index({ skills: 1 });

export default mongoose.model<IPortfolio>('Portfolio', PortfolioSchema);
