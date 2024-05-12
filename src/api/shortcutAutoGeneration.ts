// import { ChatOpenAI } from '@langchain/openai';
// import { JsonOutputFunctionsParser } from 'langchain/output_parsers';
import { z } from 'zod';
// import { zodToJsonSchema } from 'zod-to-json-schema';

export const shortcutSchema = z
  .object({
    id: z.number(),
    combination: z.string(),
    globe: z.string(),
    type: z.enum(['Application', 'Website', 'Operation']),
    applicationName: z.string().optional(),
    browserName: z.string().optional(),
    websiteUrl: z.string().optional(),
    filePath: z.string().optional(),
    operationType: z.string().optional(),
    initialTime: z.string().optional()
  })
  .describe('A shortcut item that has a combination, globe, and title.')
  .refine((data) => {
    if (data.type === 'Application') {
      return (
        data.applicationName !== '' &&
        data.browserName === '' &&
        data.websiteUrl === '' &&
        data.filePath === '' &&
        data.operationType === ''
      );
    } else if (data.type === 'Website') {
      return (
        data.applicationName === '' &&
        data.browserName !== '' &&
        data.websiteUrl !== '' &&
        data.filePath === '' &&
        data.operationType === ''
      );
    } else if (data.type === 'Operation') {
      return (
        data.applicationName === '' &&
        data.browserName === '' &&
        data.websiteUrl === '' &&
        data.filePath === '' &&
        data.operationType !== ''
      );
    } else {
      throw new Error('Invalid type');
    }
  });
