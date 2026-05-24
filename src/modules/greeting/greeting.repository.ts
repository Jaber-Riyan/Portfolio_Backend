import { GreetingModel } from './greeting.model';
import { IGreetingDocument } from './greeting.interface';
import { BaseRepository } from '../../shared/helpers/baseRepository';

export class GreetingRepository extends BaseRepository<IGreetingDocument> {
  constructor() { super(GreetingModel); }
}

export const greetingRepository = new GreetingRepository();
