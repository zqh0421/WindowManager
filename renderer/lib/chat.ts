import { ChatOpenAI } from "langchain/chat_models/openai";
import { ChatPromptTemplate } from "langchain/prompts";
import { AIMessage, HumanMessage, SystemMessage } from "langchain/schema";
import dotenv from "dotenv";

export interface IMessage {
  role: "AI" | "HUMAN" | "SYSTEM" | "AI_ANSWER";
  content: string;
  word?: string;
  context?: string;
}

dotenv.config();

// 创建ChatOpenAI模型实例
const chatModel = new ChatOpenAI({
  // 在这里配置模型参数，如温度和其他选项
  openAIApiKey: process.env.NEXT_PUBLIC_OPENAI_API_KEY,
  modelName: "gpt-4",
  // temperature: 0.7,
});

function formatChat(chat: Array<{ role: string; content: string }>) {
  const messages: Array<AIMessage | HumanMessage | SystemMessage> = [];
  chat.forEach((item, index) => {
    if (item.role === "AI" || item.role === "AI_ANSWER") {
      messages.push(new AIMessage(item.content));
    } else if (item.role === "HUMAN") {
      messages.push(new HumanMessage(item.content));
    } else if (item.role === "SYSTEM") {
      messages.push(new SystemMessage(item.content));
    } else {
      console.error("Incorrect role type.");
    }
  });
  return messages;
}

// 使用LangChain来调用ChatOpenAI模型并获得回答
export async function getAnswer(chat: IMessage[]) {
  // 消息列表
  const messages = formatChat(chat);

  // 创建ChatPromptTemplate，包含系统和用户消息
  const chatPrompt = ChatPromptTemplate.fromMessages(messages);
  try {
    // 使用 await 等待 chatPrompt.formatMessages({}) 的结果
    const formattedMessages = await chatPrompt.formatMessages({});

    // 调用模型并等待回答
    const answerMessage = await chatModel.predictMessages(formattedMessages);

    // 确保返回的消息是来自AI
    if (answerMessage instanceof AIMessage) {
      // 获取回答内容
      const answer = answerMessage.content;

      // 在这里使用回答，比如在界面上显示给用户
      console.log("Answer:", answer);
      return answer;
    } else {
      console.error("Unexpected response from model.");
    }
  } catch (error) {
    console.error("Error:", error);
  }
}