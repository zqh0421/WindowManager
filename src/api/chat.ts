import { ChatOpenAI } from '@langchain/openai';

// 创建ChatOpenAI模型实例
const chatModel = new ChatOpenAI({
  // 在这里配置模型参数，如温度和其他选项
  openAIApiKey: import.meta.env.VITE_PUBLIC_OPENAI_API_KEY,
  modelName: 'gpt-4'
  // temperature: 0.7,
});

// 使用LangChain来调用ChatOpenAI模型并获得回答
export async function getAnswer(message: string) {
  try {
    // 调用模型并等待回答
    const answerMessage = await await chatModel.invoke(message);

    // 确保返回的消息是来自AI
    if (answerMessage) {
      // 获取回答内容
      const answer = answerMessage.content;

      // 在这里使用回答，比如在界面上显示给用户
      console.log('Answer:', answer);
      return answer;
    } else {
      console.error('Unexpected response from model.');
    }
  } catch (error) {
    console.error('Error:', error);
  }
}
