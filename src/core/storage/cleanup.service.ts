import fs from 'fs/promises';
import path from 'path';
import { logger } from '../../shared/logger/logger';
import { env } from '../../config/env';

export class CleanupService {
  /**
   * Scans uploads directory and deletes files not in the provided referenced paths list.
   */
  static async cleanOrphans(referencedPaths: string[]): Promise<number> {
    const uploadRoot = path.join(process.cwd(), env.uploadDir);
    const normalised = new Set(
      referencedPaths
        .filter(Boolean)
        .map((p) => path.normalize(path.isAbsolute(p) ? p : path.join(process.cwd(), p))),
    );

    let deleted = 0;

    const scanDir = async (dir: string): Promise<void> => {
      let names: string[];
      try {
        names = await fs.readdir(dir);
      } catch {
        return;
      }

      for (const name of names) {
        const full = path.join(dir, name);
        let stat: Awaited<ReturnType<typeof fs.stat>>;
        try { stat = await fs.stat(full); } catch { continue; }

        if (stat.isDirectory()) {
          await scanDir(full);
        } else if (stat.isFile() && name !== '.gitkeep') {
          if (!normalised.has(path.normalize(full))) {
            try {
              await fs.unlink(full);
              deleted++;
              logger.debug(`Cleanup: deleted orphan ${full}`);
            } catch (err) {
              logger.warn(`Cleanup: could not delete ${full}`, err);
            }
          }
        }
      }
    };

    await scanDir(uploadRoot);
    logger.info(`Cleanup complete: ${deleted} orphaned files deleted`);
    return deleted;
  }
}
