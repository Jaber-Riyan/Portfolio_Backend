export const KNOWLEDGE_MESSAGES = {
  SYNCED: 'Knowledge base synced successfully',
  FETCHED: 'Knowledge stats fetched',
  SYNC_FAILED: 'Knowledge sync failed',
};

export const KNOWLEDGE_SOURCE_TYPES = [
  'hero',
  'about',
  'project',
  'experience',
  'education',
  'certificate',
  'review',
  'blog',
  'contact',
  'skill',
] as const;

export const VECTOR_INDEX_NAME = 'knowledge_vector_index';

export const VECTOR_DIMENSIONS = 384; // all-MiniLM-L6-v2 output dimension
