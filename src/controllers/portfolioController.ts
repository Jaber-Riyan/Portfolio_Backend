import { Request, Response } from 'express';
import Portfolio, { IPortfolio } from '../models/Portfolio';
import { createDefaultPortfolio } from '../services/portfolioService';

export const getPortfolio = async (req: Request, res: Response): Promise<void> => {
  try {
    let portfolio = await Portfolio.findOne();

    if (!portfolio) {
      portfolio = new Portfolio();
      await portfolio.save();
    }

    res.status(200).json({
      success: true,
      data: portfolio,
    });
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch portfolio' });
  }
};

export const updatePortfolio = async (req: Request, res: Response): Promise<void> => {
  try {
    const updates = req.body;

    let portfolio = await Portfolio.findOne();

    if (!portfolio) {
      portfolio = new Portfolio(updates);
    } else {
      Object.assign(portfolio, updates);
    }

    await portfolio.save();

    res.status(200).json({
      success: true,
      message: 'Portfolio updated successfully',
      data: portfolio,
    });
  } catch (error) {
    res.status(500).json({ error: 'Failed to update portfolio' });
  }
};

export const updatePortfolioSection = async (req: Request, res: Response): Promise<void> => {
  try {
    const { section } = req.params;
    const updates = req.body;

    const allowedSections = [
      'hero', 'about', 'skills', 'experience', 'projects',
      'education', 'reviews', 'blogs', 'contact', 'greeting', 'theme'
    ];

    if (!allowedSections.includes(section)) {
      res.status(400).json({ error: `Invalid section: ${section}` });
      return;
    }

    const updateQuery: any = {};
    updateQuery[section] = updates;

    let portfolio = await Portfolio.findOne();

    if (!portfolio) {
      portfolio = new Portfolio();
    }

    Object.assign(portfolio, updateQuery);
    await portfolio.save();

    res.status(200).json({
      success: true,
      message: `${section} section updated successfully`,
      data: portfolio,
    });
  } catch (error) {
    res.status(500).json({ error: `Failed to update ${req.params.section} section` });
  }
};

export const seedPortfolio = async (req: Request, res: Response): Promise<void> => {
  try {
    const portfolio = await createDefaultPortfolio();

    res.status(200).json({
      success: true,
      message: 'Portfolio seeded successfully',
      data: portfolio,
    });
  } catch (error) {
    res.status(500).json({ error: 'Failed to seed portfolio' });
  }
};
