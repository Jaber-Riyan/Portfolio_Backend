import { Types } from 'mongoose';
import { getEmbedding } from '../ai/embed';
import { knowledgeRepository, VectorSearchResult } from './knowledge.repository';
import { KnowledgeSourceType } from './knowledge.interface';
import { HeroModel } from '../hero/hero.model';
import { AboutModel } from '../about/about.model';
import { ProjectModel } from '../projects/projects.model';
import { ExperienceModel } from '../experience/experience.model';
import { EducationModel } from '../education/education.model';
import { CertificateModel } from '../certificates/certificates.model';
import { ReviewModel } from '../reviews/reviews.model';
import { BlogModel } from '../blogs/blogs.model';
import { ContactModel } from '../contact/contact.model';
import { SkillCategoryModel } from '../skills/skills.model';
import { logger } from '../../shared/logger/logger';

// ---------------------------------------------------------------------------
// Content serializers — convert raw MongoDB documents into searchable text.
// Richer text = better embedding quality = more accurate retrieval.
// ---------------------------------------------------------------------------

function serializeHero(doc: Record<string, any>): string {
  const social: string[] = [];
  if (doc.socialLinks?.github) social.push(`GitHub: ${doc.socialLinks.github}`);
  if (doc.socialLinks?.linkedin) social.push(`LinkedIn: ${doc.socialLinks.linkedin}`);
  if (doc.socialLinks?.twitter) social.push(`Twitter: ${doc.socialLinks.twitter}`);
  if (doc.socialLinks?.facebook) social.push(`Facebook: ${doc.socialLinks.facebook}`);

  return [
    `Name: ${doc.name}`,
    `Role: ${doc.role}`,
    `Description: ${doc.description}`,
    social.length ? `Social Links: ${social.join(', ')}` : '',
    doc.primaryCta?.label ? `Primary CTA: ${doc.primaryCta.label} (${doc.primaryCta.href})` : '',
    doc.secondaryCta?.label ? `Secondary CTA: ${doc.secondaryCta.label} (${doc.secondaryCta.href})` : '',
  ]
    .filter(Boolean)
    .join('\n');
}

function serializeAbout(doc: Record<string, any>): string {
  return [
    `Introduction: ${doc.intro}`,
    `Journey: ${doc.journey}`,
    `Work Approach: ${doc.work}`,
    `Hobbies & Interests: ${doc.hobbies}`,
    `Belief: ${doc.belief}`,
  ]
    .filter(Boolean)
    .join('\n');
}

function serializeProject(doc: Record<string, any>): string {
  const links = doc.githubLinks
    ?.map((l: { label: string; url: string }) => `${l.label}: ${l.url}`)
    .join(', ');

  return [
    `Project: ${doc.title}`,
    doc.techStack?.length ? `Technologies: ${doc.techStack.join(', ')}` : '',
    `Summary: ${doc.summary}`,
    `Description: ${doc.description}`,
    doc.live ? `Live URL: ${doc.live}` : '',
    links ? `GitHub: ${links}` : '',
    doc.featured ? 'This is a featured project.' : '',
  ]
    .filter(Boolean)
    .join('\n');
}

function serializeExperience(doc: Record<string, any>): string {
  return [
    `Role: ${doc.role} at ${doc.company}`,
    `Period: ${doc.period}`,
    `Location: ${doc.location}`,
    `Description: ${doc.description}`,
    doc.impact?.length ? `Key Achievements: ${(doc.impact as string[]).join('; ')}` : '',
    doc.companyUrl ? `Company Website: ${doc.companyUrl}` : '',
  ]
    .filter(Boolean)
    .join('\n');
}

function serializeEducation(doc: Record<string, any>): string {
  return [
    `Degree: ${doc.degree}`,
    `School / Institution: ${doc.school}`,
    `Period: ${doc.period}`,
    `Summary: ${doc.summary}`,
  ]
    .filter(Boolean)
    .join('\n');
}

function serializeCertificate(doc: Record<string, any>): string {
  return [
    `Certificate: ${doc.title}`,
    `Issued by: ${doc.issuer}`,
    `Date: ${doc.date}`,
    `Skills Learned: ${doc.learned}`,
    doc.link ? `Certificate Link: ${doc.link}` : '',
  ]
    .filter(Boolean)
    .join('\n');
}

function serializeReview(doc: Record<string, any>): string {
  return [
    `Review by: ${doc.author} (${doc.role})`,
    `Quote: "${doc.quote}"`,
    doc.featured ? 'This is a featured testimonial.' : '',
  ]
    .filter(Boolean)
    .join('\n');
}

function serializeBlog(doc: Record<string, any>): string {
  return [
    `Blog Post: ${doc.title}`,
    `Excerpt: ${doc.excerpt}`,
    doc.tags?.length ? `Tags: ${(doc.tags as string[]).join(', ')}` : '',
    doc.readTime ? `Read Time: ${doc.readTime} minutes` : '',
    doc.link ? `External Link: ${doc.link}` : '',
  ]
    .filter(Boolean)
    .join('\n');
}

function serializeContact(doc: Record<string, any>): string {
  return [
    `Contact Headline: ${doc.headline}`,
    `Description: ${doc.description}`,
    `Email: ${doc.email}`,
    doc.github ? `GitHub: ${doc.github}` : '',
    doc.linkedin ? `LinkedIn: ${doc.linkedin}` : '',
    doc.twitter ? `Twitter: ${doc.twitter}` : '',
  ]
    .filter(Boolean)
    .join('\n');
}

function serializeSkillCategory(doc: Record<string, any>): string {
  const skillNames = doc.items?.map((i: { name: string }) => i.name).join(', ');
  return [
    `Skill Category: ${doc.title}`,
    skillNames ? `Skills: ${skillNames}` : '',
  ]
    .filter(Boolean)
    .join('\n');
}

// ---------------------------------------------------------------------------
// Core indexing helper — embed text and upsert into knowledge_chunks.
// ---------------------------------------------------------------------------

async function indexDoc(
  sourceType: KnowledgeSourceType,
  sourceId: Types.ObjectId,
  title: string,
  content: string,
): Promise<void> {
  const embedding = await getEmbedding(content);
  await knowledgeRepository.upsertChunk(sourceType, sourceId, title, content, embedding);
}

// ---------------------------------------------------------------------------
// KnowledgeService — orchestrates all indexing and retrieval operations.
// ---------------------------------------------------------------------------

class KnowledgeService {
  /**
   * Full re-index of all portfolio data. Called on server startup and
   * available as an admin endpoint for manual triggering.
   */
  async syncAll(): Promise<void> {
    logger.info('[Knowledge] Starting full portfolio sync...');
    await Promise.all([
      this.syncHero(),
      this.syncAbout(),
      this.syncProjects(),
      this.syncExperience(),
      this.syncEducation(),
      this.syncCertificates(),
      this.syncReviews(),
      this.syncBlogs(),
      this.syncContact(),
      this.syncSkills(),
    ]);
    logger.info('[Knowledge] Full portfolio sync complete');
  }

  async syncHero(): Promise<void> {
    const docs = await HeroModel.find().lean();
    for (const doc of docs) {
      await indexDoc(
        'hero',
        doc._id as Types.ObjectId,
        `${doc.name} — Portfolio Overview`,
        serializeHero(doc),
      );
    }
  }

  async syncAbout(): Promise<void> {
    const docs = await AboutModel.find().lean();
    for (const doc of docs) {
      await indexDoc(
        'about',
        doc._id as Types.ObjectId,
        'About Jaber Ahmed Riyan',
        serializeAbout(doc),
      );
    }
  }

  async syncProjects(): Promise<void> {
    const docs = await ProjectModel.find().lean();
    for (const doc of docs) {
      await indexDoc('project', doc._id as Types.ObjectId, doc.title, serializeProject(doc));
    }
  }

  async syncExperience(): Promise<void> {
    const docs = await ExperienceModel.find().lean();
    for (const doc of docs) {
      await indexDoc(
        'experience',
        doc._id as Types.ObjectId,
        `${doc.role} at ${doc.company}`,
        serializeExperience(doc),
      );
    }
  }

  async syncEducation(): Promise<void> {
    const docs = await EducationModel.find().lean();
    for (const doc of docs) {
      await indexDoc(
        'education',
        doc._id as Types.ObjectId,
        `${doc.degree} — ${doc.school}`,
        serializeEducation(doc),
      );
    }
  }

  async syncCertificates(): Promise<void> {
    const docs = await CertificateModel.find().lean();
    for (const doc of docs) {
      await indexDoc('certificate', doc._id as Types.ObjectId, doc.title, serializeCertificate(doc));
    }
  }

  async syncReviews(): Promise<void> {
    const docs = await ReviewModel.find().lean();
    for (const doc of docs) {
      await indexDoc(
        'review',
        doc._id as Types.ObjectId,
        `Review by ${doc.author}`,
        serializeReview(doc),
      );
    }
  }

  async syncBlogs(): Promise<void> {
    // Only index published blog posts into the knowledge base
    const docs = await BlogModel.find({ published: true }).lean();
    for (const doc of docs) {
      await indexDoc('blog', doc._id as Types.ObjectId, doc.title, serializeBlog(doc));
    }
  }

  async syncContact(): Promise<void> {
    const docs = await ContactModel.find().lean();
    for (const doc of docs) {
      await indexDoc(
        'contact',
        doc._id as Types.ObjectId,
        'Contact Information',
        serializeContact(doc),
      );
    }
  }

  async syncSkills(): Promise<void> {
    const docs = await SkillCategoryModel.find().lean();
    for (const doc of docs) {
      await indexDoc(
        'skill',
        doc._id as Types.ObjectId,
        `Skills — ${doc.title}`,
        serializeSkillCategory(doc),
      );
    }
  }

  // ---------------------------------------------------------------------------
  // Granular re-index methods — called after individual document mutations.
  // ---------------------------------------------------------------------------

  async indexProjectById(id: Types.ObjectId): Promise<void> {
    const doc = await ProjectModel.findById(id).lean();
    if (!doc) return;
    await indexDoc('project', doc._id as Types.ObjectId, doc.title, serializeProject(doc));
  }

  async indexBlogById(id: Types.ObjectId): Promise<void> {
    const doc = await BlogModel.findById(id).lean();
    if (!doc) return;
    if (!doc.published) {
      // Remove unpublished blog from knowledge base
      await knowledgeRepository.deleteBySource('blog', id);
      return;
    }
    await indexDoc('blog', doc._id as Types.ObjectId, doc.title, serializeBlog(doc));
  }

  async indexExperienceById(id: Types.ObjectId): Promise<void> {
    const doc = await ExperienceModel.findById(id).lean();
    if (!doc) return;
    await indexDoc(
      'experience',
      doc._id as Types.ObjectId,
      `${doc.role} at ${doc.company}`,
      serializeExperience(doc),
    );
  }

  async indexCertificateById(id: Types.ObjectId): Promise<void> {
    const doc = await CertificateModel.findById(id).lean();
    if (!doc) return;
    await indexDoc('certificate', doc._id as Types.ObjectId, doc.title, serializeCertificate(doc));
  }

  async deleteChunks(sourceType: KnowledgeSourceType, sourceId: Types.ObjectId): Promise<void> {
    await knowledgeRepository.deleteBySource(sourceType, sourceId);
  }

  async getStats(): Promise<Record<string, number>> {
    return knowledgeRepository.getStats();
  }

  async vectorSearch(queryEmbedding: number[], limit = 5): Promise<VectorSearchResult[]> {
    return knowledgeRepository.vectorSearch(queryEmbedding, limit);
  }
}

export const knowledgeService = new KnowledgeService();
