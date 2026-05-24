import { HeroModel } from '../hero/hero.model';
import { AboutModel } from '../about/about.model';
import { SkillCategoryModel } from '../skills/skills.model';
import { ExperienceModel } from '../experience/experience.model';
import { ProjectModel } from '../projects/projects.model';
import { EducationModel } from '../education/education.model';
import { CertificateModel } from '../certificates/certificates.model';
import { ReviewModel } from '../reviews/reviews.model';
import { BlogModel } from '../blogs/blogs.model';
import { ContactModel } from '../contact/contact.model';
import { GreetingModel } from '../greeting/greeting.model';
import { ThemeModel } from '../theme/theme.model';
import { DEFAULT_THEME } from '../theme/theme.constant';

class PublicService {
  async getAllData() {
    const [
      hero,
      about,
      skills,
      experience,
      projects,
      education,
      certificates,
      reviews,
      blogs,
      contact,
      greeting,
      theme,
    ] = await Promise.all([
      HeroModel.findOne().lean(),
      AboutModel.findOne().lean(),
      SkillCategoryModel.find().sort({ sortOrder: 1 }).lean(),
      ExperienceModel.find().sort({ sortOrder: 1 }).lean(),
      ProjectModel.find().sort({ sortOrder: 1 }).lean(),
      EducationModel.find().sort({ sortOrder: 1 }).lean(),
      CertificateModel.find().sort({ sortOrder: 1 }).lean(),
      ReviewModel.find().sort({ sortOrder: 1 }).lean(),
      BlogModel.find({ published: true }).sort({ sortOrder: 1 }).lean(),
      ContactModel.findOne().lean(),
      GreetingModel.findOne().lean(),
      ThemeModel.findOne().lean(),
    ]);

    return {
      hero: hero ?? null,
      about: about ?? null,
      skills,
      experience,
      projects,
      education,
      certificates,
      reviews,
      blogs,
      contact: contact ?? null,
      greeting: greeting ?? null,
      theme: theme ?? DEFAULT_THEME,
    };
  }

  async getHero() { return HeroModel.findOne().lean(); }
  async getAbout() { return AboutModel.findOne().lean(); }
  async getProjects() { return ProjectModel.find().sort({ sortOrder: 1 }).lean(); }
  async getTheme() { return ThemeModel.findOne().lean() ?? DEFAULT_THEME; }
}

export const publicService = new PublicService();
