using OpenAI.Chat;

namespace QuizMaster.Infrastructure.Services;

public class ChatClientFactory(string apiKey)
{
    public ChatClient Create()
    {
        ChatClient client = new(model: "gpt-4o-mini", apiKey: apiKey);

        return client;
    }
}
