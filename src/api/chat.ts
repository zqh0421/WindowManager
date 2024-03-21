import { ChatOpenAI } from '@langchain/openai';
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
