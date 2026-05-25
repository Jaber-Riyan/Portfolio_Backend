import 'dotenv/config';
import mongoose from 'mongoose';
import { env } from '../config/env';
import { HeroModel } from '../modules/hero/hero.model';
import { AboutModel } from '../modules/about/about.model';
import { SkillCategoryModel } from '../modules/skills/skills.model';
import { ExperienceModel } from '../modules/experience/experience.model';
import { ProjectModel } from '../modules/projects/projects.model';
import { EducationModel } from '../modules/education/education.model';
import { CertificateModel } from '../modules/certificates/certificates.model';
import { ReviewModel } from '../modules/reviews/reviews.model';
import { BlogModel } from '../modules/blogs/blogs.model';
import { ContactModel } from '../modules/contact/contact.model';
import { GreetingModel } from '../modules/greeting/greeting.model';
import { ThemeModel } from '../modules/theme/theme.model';
import { DEFAULT_THEME } from '../modules/theme/theme.constant';

const clearAll = async () => {
  await Promise.all([
    HeroModel.deleteMany({}),
    AboutModel.deleteMany({}),
    SkillCategoryModel.deleteMany({}),
    ExperienceModel.deleteMany({}),
    ProjectModel.deleteMany({}),
    EducationModel.deleteMany({}),
    CertificateModel.deleteMany({}),
    ReviewModel.deleteMany({}),
    BlogModel.deleteMany({}),
    ContactModel.deleteMany({}),
    GreetingModel.deleteMany({}),
    ThemeModel.deleteMany({}),
  ]);
  console.log('All collections cleared');
};

const seedPortfolio = async () => {
  await mongoose.connect(env.mongoUri);
  console.log('Connected to MongoDB');

  await clearAll();

  await HeroModel.create({
    name: 'Jaber Riyan',
    role: 'Full-Stack Developer',
    description: 'I build modern, scalable web applications with a focus on clean architecture and exceptional user experiences. Passionate about TypeScript, Node.js, and React.',
    profileImage: '',
    primaryCta: { label: 'View Projects', href: '#projects' },
    secondaryCta: { label: 'Contact Me', href: '#contact' },
    socialLinks: {
      github: 'https://github.com/Jaber-Riyan',
      linkedin: 'https://linkedin.com/in/jaber-ahmed-riyan',
      twitter: 'https://x.com/jaber_riyan',
    },
  });
  console.log('Hero seeded');

  await AboutModel.create({
    intro: 'Hello! I\'m Jaber Riyan, a passionate full-stack developer with 3+ years of experience building robust web applications.',
    journey: 'My journey in software development began during university where I fell in love with problem-solving through code. I started with HTML/CSS, progressed to JavaScript, and eventually mastered TypeScript and modern backend frameworks.',
    work: 'I specialize in building RESTful APIs with Node.js and Express, crafting responsive frontends with React and Next.js, and architecting scalable systems with MongoDB and PostgreSQL.',
    hobbies: 'When I\'m not coding, you\'ll find me exploring open-source projects, reading tech blogs, playing chess, or hiking on weekends.',
    belief: 'I believe in writing clean, maintainable code that solves real problems. Every line of code should add value and every system should be built to scale.',
  });
  console.log('About seeded');

  await SkillCategoryModel.insertMany([
    {
      title: 'Frontend',
      sortOrder: 0,
      items: [
        { name: 'React', icon: 'react' },
        { name: 'Next.js', icon: 'nextjs' },
        { name: 'TypeScript', icon: 'typescript' },
        { name: 'Tailwind CSS', icon: 'tailwind' },
      ],
    },
    {
      title: 'Backend',
      sortOrder: 1,
      items: [
        { name: 'Node.js', icon: 'nodejs' },
        { name: 'Express.js', icon: 'express' },
        { name: 'REST APIs', icon: 'api' },
        { name: 'GraphQL', icon: 'graphql' },
      ],
    },
    {
      title: 'Database',
      sortOrder: 2,
      items: [
        { name: 'MongoDB', icon: 'mongodb' },
        { name: 'PostgreSQL', icon: 'postgresql' },
        { name: 'Redis', icon: 'redis' },
        { name: 'Mongoose', icon: 'mongoose' },
      ],
    },
    {
      title: 'DevOps & Tools',
      sortOrder: 3,
      items: [
        { name: 'Git', icon: 'git' },
        { name: 'Docker', icon: 'docker' },
        { name: 'AWS', icon: 'aws' },
        { name: 'Linux', icon: 'linux' },
      ],
    },
  ]);
  console.log('Skills seeded');

  await ExperienceModel.insertMany([
    {
      role: 'Full-Stack Developer',
      company: 'TechFlow Solutions',
      companyUrl: 'https://techflow.io',
      period: 'Jan 2023 – Present',
      location: 'Remote',
      description: 'Lead developer for a SaaS platform serving 10,000+ users. Built microservices architecture with Node.js, designed React dashboards, and optimized database queries.',
      impact: [
        'Reduced API response time by 40% through query optimization',
        'Built CI/CD pipeline cutting deployment time from 45 to 5 minutes',
        'Mentored 2 junior developers',
      ],
      sortOrder: 0,
    },
    {
      role: 'Backend Developer',
      company: 'StartupHub BD',
      companyUrl: 'https://startuphub.com.bd',
      period: 'Jun 2022 – Dec 2022',
      location: 'Dhaka, Bangladesh',
      description: 'Developed and maintained RESTful APIs for an e-commerce platform. Integrated payment gateways and built real-time notification systems.',
      impact: [
        'Integrated 3 payment gateways (SSLCommerz, bKash, Nagad)',
        'Built real-time order tracking with WebSockets',
        'Improved test coverage from 20% to 75%',
      ],
      sortOrder: 1,
    },
  ]);
  console.log('Experience seeded');

  await ProjectModel.insertMany([
    {
      title: 'Portfolio CMS Backend',
      image: '',
      techStack: ['Node.js', 'TypeScript', 'Express', 'MongoDB', 'JWT'],
      summary: 'A production-ready CMS backend for personal portfolio websites.',
      description: 'A fully-featured headless CMS built with Node.js and TypeScript following clean architecture principles. Features JWT authentication, file uploads, and comprehensive API documentation.',
      githubLinks: [{ label: 'Backend', url: 'https://github.com/Jaber-Riyan/portfolio-backend' }],
      live: '',
      featured: true,
      sortOrder: 0,
    },
    {
      title: 'E-Commerce API Platform',
      image: '',
      techStack: ['Node.js', 'Express', 'MongoDB', 'Redis', 'Stripe'],
      summary: 'Scalable e-commerce backend with payment processing and real-time inventory.',
      description: 'A comprehensive e-commerce API supporting product catalog management, cart operations, payment processing with Stripe, real-time inventory updates, and order management.',
      githubLinks: [{ label: 'GitHub', url: 'https://github.com/Jaber-Riyan/ecommerce-api' }],
      live: 'https://ecommerce-api-demo.vercel.app',
      featured: true,
      sortOrder: 1,
    },
    {
      title: 'Real-Time Chat Application',
      image: '',
      techStack: ['React', 'Socket.io', 'Node.js', 'MongoDB'],
      summary: 'Full-stack real-time chat with rooms, DMs, and file sharing.',
      description: 'A real-time chat application with private messaging, group rooms, file sharing, and message history. Built with Socket.io for real-time communication.',
      githubLinks: [{ label: 'GitHub', url: 'https://github.com/Jaber-Riyan/realtime-chat' }],
      live: '',
      featured: false,
      sortOrder: 2,
    },
  ]);
  console.log('Projects seeded');

  await EducationModel.insertMany([
    {
      degree: 'B.Sc. in Computer Science & Engineering',
      school: 'University of Dhaka',
      period: '2019 – 2023',
      summary: 'Graduated with distinction. Focused on software engineering, algorithms, and database systems. Led the university programming club.',
      sortOrder: 0,
    },
    {
      degree: 'Higher Secondary Certificate (HSC)',
      school: 'Dhaka College',
      period: '2017 – 2019',
      summary: 'Science group with GPA 5.00. Active participant in math and science olympiads.',
      sortOrder: 1,
    },
  ]);
  console.log('Education seeded');

  await CertificateModel.insertMany([
    {
      title: 'AWS Certified Developer – Associate',
      issuer: 'Amazon Web Services',
      date: 'March 2024',
      link: 'https://aws.amazon.com/certification',
      learned: 'Cloud architecture, Lambda, S3, DynamoDB, CloudFormation, and deploying scalable Node.js applications on AWS.',
      sortOrder: 0,
    },
    {
      title: 'MongoDB for JavaScript Developers',
      issuer: 'MongoDB University',
      date: 'January 2023',
      link: 'https://university.mongodb.com',
      learned: 'Advanced aggregation pipelines, indexing strategies, schema design patterns, and performance optimization.',
      sortOrder: 1,
    },
    {
      title: 'Node.js Application Development',
      issuer: 'OpenJS Foundation',
      date: 'August 2022',
      link: 'https://openjsf.org',
      learned: 'Advanced Node.js patterns, streams, event loops, performance tuning, and production deployment strategies.',
      sortOrder: 2,
    },
  ]);
  console.log('Certificates seeded');

  await ReviewModel.insertMany([
    {
      quote: 'Jaber delivered outstanding work on our backend API. His code is clean, well-documented, and highly performant. I would hire him again without hesitation.',
      author: 'Sarah Johnson',
      role: 'CTO, TechFlow Solutions',
      avatar: '',
      featured: true,
      sortOrder: 0,
    },
    {
      quote: 'Exceptional developer! Jaber built our entire e-commerce backend from scratch in 6 weeks. The architecture he designed has scaled flawlessly as we grew.',
      author: 'Ahmed Hassan',
      role: 'Founder, StartupHub BD',
      avatar: '',
      featured: true,
      sortOrder: 1,
    },
    {
      quote: 'Professional, responsive, and technically brilliant. Jaber tackled complex challenges with elegant solutions. Our platform performance improved dramatically.',
      author: 'Priya Sharma',
      role: 'Product Manager, DevMatrix',
      avatar: '',
      featured: false,
      sortOrder: 2,
    },
  ]);
  console.log('Reviews seeded');

  await BlogModel.insertMany([
    {
      title: 'Building Production-Ready REST APIs with Node.js and TypeScript',
      slug: 'building-production-ready-rest-apis-nodejs-typescript',
      excerpt: 'A comprehensive guide to building scalable, maintainable REST APIs using Node.js, TypeScript, and clean architecture principles.',
      body: '## Introduction\n\nBuilding production-ready APIs requires more than just making endpoints work. This guide covers clean architecture, error handling, validation, authentication, and testing strategies.\n\n## Architecture\n\nWe use a feature-based folder structure with clear separation of concerns: controllers, services, and repositories...',
      tags: ['Node.js', 'TypeScript', 'REST API', 'Architecture'],
      readTime: 12,
      published: true,
      draft: false,
      sortOrder: 0,
    },
    {
      title: 'MongoDB Aggregation Pipeline: Advanced Patterns',
      slug: 'mongodb-aggregation-pipeline-advanced-patterns',
      excerpt: 'Deep dive into MongoDB aggregation pipelines with real-world examples for complex data transformations.',
      body: '## What is the Aggregation Pipeline?\n\nMongoDB\'s aggregation pipeline is a powerful framework for data transformation and analysis...',
      tags: ['MongoDB', 'Database', 'Performance'],
      readTime: 8,
      published: true,
      draft: false,
      sortOrder: 1,
    },
    {
      title: 'JWT Authentication Best Practices in 2024',
      slug: 'jwt-authentication-best-practices-2024',
      excerpt: 'Secure your Node.js applications with JWT using modern best practices including httpOnly cookies, refresh tokens, and token rotation.',
      body: '## Why JWT?\n\nJSON Web Tokens provide a stateless authentication mechanism that works well with modern distributed systems...',
      tags: ['Security', 'JWT', 'Authentication', 'Node.js'],
      readTime: 10,
      published: false,
      draft: true,
      sortOrder: 2,
    },
  ]);
  console.log('Blogs seeded');

  await ContactModel.create({
    headline: "Let's Work Together",
    description: "I'm currently open to new opportunities. Whether you have a project in mind, want to collaborate, or just want to say hi — my inbox is always open!",
    email: 'jaber.riyan@gmail.com',
    github: 'https://github.com/Jaber-Riyan',
    linkedin: 'https://linkedin.com/in/jaber-riyan',
    twitter: 'https://twitter.com/jaber_riyan',
  });
  console.log('Contact seeded');

  await GreetingModel.create({
    enabled: true,
    title: 'Welcome to My Portfolio!',
    message: "Hi! I'm Jaber Riyan, a full-stack developer. Take a look around and feel free to reach out.",
    bgColor: '#0f172a',
    textColor: '#f1f5f9',
    ctaLabel: "Let's Explore",
    ctaHref: '#hero',
  });
  console.log('Greeting seeded');

  await ThemeModel.create(DEFAULT_THEME);
  console.log('Theme seeded');

  console.log('\n✅ Portfolio data seeded successfully!');
  await mongoose.disconnect();
};

seedPortfolio().catch((err) => {
  console.error('Seed portfolio failed:', err);
  process.exit(1);
});
