import { ChatOpenAI } from '@langchain/openai';
import { JsonOutputFunctionsParser } from 'langchain/output_parsers';
import { z } from 'zod';
import { zodToJsonSchema } from 'zod-to-json-schema';
import OpenAI from 'openai';

export const layoutWindowSchema = z
  .object({
    type: z.enum(['Application', 'Window', 'Website', 'File']),
    appName: z
      .string()
      .describe('The name of the process/application, as is given in the dataset.'),
    windowTitle: z.string().describe('The title of the window/tab/websiteUrl.').optional(),
    description: z.string().describe('A simple utility description of the window.')
  })
  .describe(
    'A(n) window/application/tab/website/file that should be displayed in a whole screen or part of the screen for a specific task. ONLY <left half + right half>, <top half + bottom half>, <first fourth + last three fourths>, <first three fourths + last fourths>, or <full screen> are supported, since windows in the same layout SHOULD NOT overlap.'
  )
  .refine(
    (data) => {
      if (data.type === 'Application') {
        return data.appName !== '' && data.windowTitle === '';
      } else if (data.type === 'Window') {
        return data.windowTitle !== '' && data.appName !== '';
      } else if (data.type === 'Website') {
        return data.windowTitle !== '' && data.appName !== '';
      } else if (data.type === 'File') {
        return data.windowTitle !== '' && data.appName !== '';
      }
    },
    {
      message: `
      Apllication belongs to the available application list and is not the same as Window.
      Window must have a appName and a windowTitle.
      Website must specify a browser name (appName) and its url (windowTitle) to open it.
      The website url can be outside of defined data in the prompt.
      File must specify an appName to open the file and its file path (windowTitle).
      `
    }
  );

export const layoutWindowWithoutCommandSchema = z
  .object({
    appName: z.string().describe('The name of the process, as is given in the dataset.'),
    windowTitle: z.string().describe('The title of the window.'),
    description: z.string()
  })
  .describe(
    'A window that should be displayed in a whole screen or part of the screen for a specific task. ONLY <left half + right half>, <top half + bottom half>, <first fourth + last three fourths>, <first three fourths + last fourths>, or <full screen> are supported, since windows in the same layout SHOULD NOT overlap.'
  );
// .describe(
//   'NO MORE THAN TWO windows that should be displayed together in a whole screen for a specific task.'
// )

export const layoutWithoutCommandSchema = z
  .object({
    windows: z.array(layoutWindowWithoutCommandSchema),
    task: z.string().describe('The name of the task'),
    layoutType: z
      .enum([
        'Full Screen',
        'Left Half + Right Half',
        'Top Half + Bottom Half',
        'First Fourth + Last Three Fourth',
        'First Three Fourths + Last Fourth'
      ])
      .describe('Where the window should be displayed on the screen.')
  })
  .describe('One type of layout for a specific task');

export const layoutSchema = z
  .object({
    windows: z.array(layoutWindowSchema),
    task: z.string().describe('The name of the task'),
    layoutType: z
      .enum([
        'Full Screen',
        'Left Half + Right Half',
        'Top Half + Bottom Half',
        'First Fourth + Last Three Fourth',
        'First Three Fourths + Last Fourth'
      ])
      .describe('Where the window should be displayed on the screen.')
  })
  .describe('One type of layout for a specific task');

export const layoutsSchema = z
  .object({
    layouts: z.array(layoutSchema).describe('The recommended layouts for the user.'),
    status: z.enum(['success', 'error']).describe('The status of the layout planning process')
  })
  .describe("A list of data showing the recommended layouts for the user's task.");

export const layoutsWithoutCommandSchema = z
  .object({
    layouts: z.array(layoutWithoutCommandSchema).describe('The recommended layouts for the user.'),
    status: z.enum(['success', 'error']).describe('The status of the layout planning process')
  })
  .describe("A list of data showing the recommended layouts for the user's task.");

export type LayoutWindow = {
  type: 'Application' | 'Window' | 'Tab' | 'Website' | 'File';
  appName: string;
  windowTitle?: string;
  description?: string;
};

export type Layout = {
  task: string;
  layoutType: string;
  windows: LayoutWindow[];
};

export type LayoutWithoutCommandResponse = {
  layouts: Layout[];
  status: 'success' | 'error';
} | null;

export type LayoutBasedOnCommandResponse = {
  layouts: Layout[];
  status: 'success' | 'error';
} | null;

// 使用LangChain来调用ChatOpenAI模型并获得回答
export async function answerLayoutWithoutCommand(
  message: string,
  model: string = 'gpt-4-0125-preview'
): Promise<Layout[]> {
  const parser = new JsonOutputFunctionsParser({ diff: true });

  const modelParams = {
    functions: [
      {
        name: 'layoutWithoutCommand',
        description:
          'Generate recommended layouts based on given window information and user habits',
        parameters: zodToJsonSchema(layoutsWithoutCommandSchema)
      }
    ],
    function_call: { name: 'layoutWithoutCommand' }
  };

  // We will be using tool calling mode, which
  // requires a tool calling capable model.
  const chatModel = new ChatOpenAI({
    // Consider benchmarking with the best model you can to get
    // a sense of the best possible quality.
    openAIApiKey: import.meta.env.VITE_PUBLIC_OPENAI_API_KEY,
    modelName: model,
    temperature: 0
  }).bind(modelParams);

  const runnable = chatModel.bind(modelParams).pipe(parser);

  const result = await runnable.invoke(message);

  return (result as LayoutWithoutCommandResponse)?.layouts as Layout[];
}

const openai = new OpenAI({
  apiKey: import.meta.env.VITE_PUBLIC_OPENAI_API_KEY,
  dangerouslyAllowBrowser: true
});

export async function getAnswerAssistant(message: string) {
  try {
    const completion = await openai.chat.completions.create({
      messages: [{ role: 'system', content: message }],
      model: 'gpt-4'
    });
    return completion.choices[0];
  } catch (error) {
    console.error('Error:', error);
  }
}

export async function answerLayoutBasedOnCommand(
  message: string,
  model: string = 'gpt-4-0125-preview'
): Promise<Layout[]> {
  const parser = new JsonOutputFunctionsParser({ diff: true });

  const modelParams = {
    functions: [
      {
        name: 'layoutBasedOnCommand',
        description: "Generate recommended layouts based on the user's command",
        parameters: zodToJsonSchema(layoutsSchema)
      }
    ],
    function_call: { name: 'layoutBasedOnCommand' }
  };

  // We will be using tool calling mode, which
  // requires a tool calling capable model.
  const chatModel = new ChatOpenAI({
    // Consider benchmarking with the best model you can to get
    // a sense of the best possible quality.
    openAIApiKey: import.meta.env.VITE_PUBLIC_OPENAI_API_KEY,
    modelName: model,
    temperature: 0
  }).bind(modelParams);

  const runnable = chatModel.bind(modelParams).pipe(parser);

  // const examples = [
  //   {
  //     input: "",
  //     output: `
  //     "layouts":
  //     [{
  //       "Write my research paper": [
  //         {
  //           "appName": "Safari",
  //           "windowTitle": "XXX (arxiv)",
  //           "windowManagement": "left half",
  //           "description": "reference",
  //         },
  //         {
  //           "appName": "Microsoft Word",
  //           "windowTitle": "XXX (paper draft)",
  //           "windowManagement": "right half",
  //           "description": "paper writing",
  //         }
  //       ]
  //     }, {
  //       "Write my research paper": [
  //         {
  //           "appName": "Microsoft Word",
  //           "windowTitle": "XXX (paper draft)",
  //           "windowManagement": "left half",
  //           "description": "paper writing",
  //         },
  //         {
  //           "appName": "Safari",
  //           "windowTitle": "XXX (arxiv)",
  //           "windowManagement": "right half",
  //           "description": "reference",
  //         },
  //       ]
  //     }
  //   ]
  //     `,
  // },
  // ];
  // const examplePrompt = ChatPromptTemplate.fromTemplate(`Human: {input}
  // AI: {output}`);
  // const fewShotPrompt = new FewShotChatMessagePromptTemplate({
  //   prefix:
  //     "Rephrase the users query to be more general, using the following examples",
  //   suffix: "Human: {input}",
  //   examplePrompt,
  //   examples,
  //   inputVariables: ["input"],
  // });
  // const formattedPrompt = await fewShotPrompt.format({
  //   input: "What's France's main city?",
  // });

  const result = await runnable.invoke(message);

  return (result as LayoutBasedOnCommandResponse)?.layouts as Layout[];
}

// 使用LangChain来调用ChatOpenAI模型并获得回答
export async function getAnswer(message: string, model: string = 'gpt-4') {
  // 创建ChatOpenAI模型实例
  const chatModel = new ChatOpenAI({
    // 在这里配置模型参数，如温度和其他选项
    openAIApiKey: import.meta.env.VITE_PUBLIC_OPENAI_API_KEY,
    modelName: model,
    temperature: 0
  });

  try {
    // 调用模型并等待回答
    const answerMessage = await chatModel.invoke(message);

    // 确保返回的消息是来自AI
    if (answerMessage) {
      // 获取回答内容
      const answer = answerMessage.content;
      return answer;
    } else {
      console.error('Unexpected response from model.');
    }
  } catch (error) {
    console.error('Error:', error);
  }
}
