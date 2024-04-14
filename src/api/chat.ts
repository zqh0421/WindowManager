import { ChatOpenAI } from '@langchain/openai';
import { JsonOutputFunctionsParser } from 'langchain/output_parsers';
import { z } from 'zod';
import { zodToJsonSchema } from 'zod-to-json-schema';
import OpenAI from 'openai';

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
) {
  const parser = new JsonOutputFunctionsParser({ diff: true });
  const layoutSchema = z
    .object({
      task: z.string().describe('The name of the task'),
      layout: z
        .array(
          z
            .object({
              appName: z.string().describe('The name of the application.'),
              windowTitle: z.string().describe('The title of the window.'),
              windowManagement: z
                .enum([
                  'full screen',
                  'left half',
                  'right half',
                  'top half',
                  'bottom half',
                  'first fourth',
                  'last fourth',
                  'first three fourths',
                  'last three fourths'
                ])
                .describe('Where the window should be displayed on the screen.'),
              description: z.string()
            })
            .describe(
              'A window that should be displayed in a whole screen or part of the screen for a specific task. ONLY <left half + right half>, <top half + bottom half>, <first fourth + last three fourths>, <first three fourths + last fourths>, or <full screen> are supported, since windows in the same layout SHOULD NOT overlap.'
            )
        )
        .describe(
          'NO MORE THAN TWO windows that should be displayed together in a whole screen for a specific task.'
        )
    })
    .describe('One type of layout for a specific task');

  const layoutsSchema = z.object({
    layouts: z
      .array(layoutSchema)
      .describe("A list of data showing the recommended layouts for the user's task."),
    status: z.enum(['success', 'error']).describe('The status of the layout planning process')
  });

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

  return result;
}
