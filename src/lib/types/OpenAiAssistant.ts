import OpenAI from "openai";

export class OpenAIAssistant {
  private client: OpenAI;
  private assistant: OpenAI.Beta.Assistants.Assistant | null = null;
  private thread: { id: string } | null = null;

  constructor(apiKey: string) {
    if (!apiKey) {
      throw new Error("OpenAI API key not configured");
    }
    this.client = new OpenAI({ apiKey, dangerouslyAllowBrowser: true });
  }

  async initialize(
    instructions: string = `You are an English tutor. Help students improve their language skills by:
    - Correcting mistakes in grammar and vocabulary
    - Explaining concepts with examples
    - Engaging in conversation practice
    - Providing learning suggestions
    Be friendly, adapt to student's level, and always give concise answers.`
  ): Promise<void> {
    try {
      this.assistant = await this.client.beta.assistants.create({
        name: "English Tutor Assistant",
        instructions,
        tools: [],
        model: "gpt-4o-mini",
      });

      this.thread = await this.client.beta.threads.create();
    } catch (error) {
      console.error("Error initializing assistant:", error);
      throw new Error("Failed to initialize assistant");
    }
  }

  async getResponse(userMessage: string): Promise<string> {
    if (!this.assistant || !this.thread || !this.client) {
      throw new Error("Assistant not initialized. Call initialize() first.");
    }

    try {
      await this.client.beta.threads.messages.create(this.thread.id, {
        role: "user",
        content: userMessage,
      });

      const run = await this.client.beta.threads.runs.createAndPoll(this.thread.id, { assistant_id: this.assistant.id });

      if (run.status === "completed") {
        const messages = await this.client.beta.threads.messages.list(this.thread.id);
        const lastMessage = messages.data.find((msg) => msg.role === "assistant");

        if (lastMessage && lastMessage.content[0].type === "text") {
          return lastMessage.content[0].text.value;
        }
      }

      return "Sorry, I couldn't process your request.";
    } catch (error) {
      console.error("Error getting response:", error);
      return "An error occurred while processing your request.";
    }
  }
}
