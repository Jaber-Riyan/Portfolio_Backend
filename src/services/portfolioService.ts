import Portfolio, { IPortfolio, IHero, IAbout, ISkill, IExperience, IProject, IEducation, IReview, IBlog, IContact, IGreeting, ITheme } from '../models/Portfolio';

const defaultHero: IHero = {
  title: 'Hello, I\'m',
  subtitle: 'John Doe',
  description: 'A Full Stack Developer passionate about building exceptional digital experiences.',
  image: '',
  socialLinks: {
    github: '',
    linkedin: '',
    twitter: '',
    instagram: '',
  },
};

const defaultAbout: IAbout = {
  description: 'I am a passionate developer with over 5 years of experience in web development. I specialize in building modern, responsive, and user-friendly applications.',
  experience: 5,
  clients: 50,
  projects: 100,
  years: 5,
  avatar: '',
  email: 'john@example.com',
  phone: '+1 234 567 890',
  address: 'New York, USA',
};

const defaultSkills: ISkill[] = [
  { name: 'JavaScript', level: 90, category: 'Frontend' },
  { name: 'TypeScript', level: 85, category: 'Frontend' },
  { name: 'React', level: 90, category: 'Frontend' },
  { name: 'Node.js', level: 85, category: 'Backend' },
  { name: 'Express', level: 85, category: 'Backend' },
  { name: 'MongoDB', level: 80, category: 'Database' },
  { name: 'PostgreSQL', level: 75, category: 'Database' },
  { name: 'Tailwind CSS', level: 90, category: 'Frontend' },
];

const defaultExperience: IExperience[] = [
  {
    title: 'Senior Full Stack Developer',
    company: 'Tech Corp',
    duration: '2021 - Present',
    description: 'Leading development of enterprise applications',
    current: true,
  },
  {
    title: 'Full Stack Developer',
    company: 'StartUp Inc',
    duration: '2019 - 2021',
    description: 'Built scalable web applications',
  },
];

const defaultProjects: IProject[] = [
  {
    title: 'E-Commerce Platform',
    description: 'A full-featured e-commerce solution with React and Node.js',
    technologies: ['React', 'Node.js', 'MongoDB', 'Stripe'],
    image: '',
    link: 'https://example.com',
    featured: true,
  },
  {
    title: 'Task Management App',
    description: 'A collaborative task management tool',
    technologies: ['Vue.js', 'Express', 'PostgreSQL'],
    image: '',
    github: 'https://github.com/example/task-app',
    featured: true,
  },
];

const defaultEducation: IEducation[] = [
  {
    degree: 'B.S. Computer Science',
    institution: 'University of Technology',
    year: '2015 - 2019',
    description: 'Graduated with honors',
  },
];

const defaultReviews: IReview[] = [
  {
    name: 'Sarah Johnson',
    role: 'CEO, TechStart',
    content: 'Outstanding developer! Delivered our project ahead of schedule.',
    avatar: '',
    rating: 5,
  },
];

const defaultBlogs: IBlog[] = [
  {
    title: 'Getting Started with TypeScript',
    slug: 'getting-started-typescript',
    excerpt: 'Learn the basics of TypeScript and why you should use it',
    content: 'Full blog content here...',
    image: '',
    date: '2024-01-15',
    tags: ['TypeScript', 'JavaScript', 'Tutorial'],
    published: true,
  },
];

const defaultContact: IContact = {
  email: 'john@example.com',
  phone: '+1 234 567 890',
  location: 'New York, USA',
  social: {
    github: 'https://github.com/johndoe',
    linkedin: 'https://linkedin.com/in/johndoe',
    twitter: 'https://twitter.com/johndoe',
    youtube: '',
  },
};

const defaultGreeting: IGreeting = {
  title: 'Welcome to My Portfolio',
  description: 'I create beautiful, functional websites and applications.',
  ctaText: 'View My Work',
  ctaLink: '#projects',
};

const defaultTheme: ITheme = {
  primaryColor: '#007bff',
  secondaryColor: '#6c757d',
  darkMode: false,
  font: 'Inter',
};

export const createDefaultPortfolio = async (): Promise<IPortfolio> => {
  const existing = await Portfolio.findOne();
  if (existing) {
    return existing;
  }

  const portfolio = new Portfolio({
    hero: defaultHero,
    about: defaultAbout,
    skills: defaultSkills,
    experience: defaultExperience,
    projects: defaultProjects,
    education: defaultEducation,
    reviews: defaultReviews,
    blogs: defaultBlogs,
    contact: defaultContact,
    greeting: defaultGreeting,
    theme: defaultTheme,
  });

  await portfolio.save();
  return portfolio;
};
