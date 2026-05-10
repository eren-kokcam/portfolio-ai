import anthropic
from core.config import settings

client = anthropic.Anthropic(api_key=settings.anthropic_api_key)

SYSTEM_PROMPT = """You are an experienced portfolio analyst and financial advisor. 
Always respond in Turkish. Be concise and direct. Maximum 400 words.

For the FIRST analysis (when no previous messages exist), structure your response exactly like this:
## 📊 Portföy Özeti
## 💰 Varlık Analizi  
## ⚠️ Riskler
## 💡 Öneriler
## ❓ Sorular

For FOLLOW-UP questions (when conversation history exists), respond naturally without forced sections.
Answer directly and ask 1-2 follow-up questions at the end."""

def analyze_portfolio(context: str, messages: list = []) -> str:
    try:
        if messages:
            chat_messages = [{"role": m["role"], "content": m["content"]} for m in messages]
            chat_messages.append({"role": "user", "content": context})
        else:
            chat_messages = [{"role": "user", "content": context}]

        response = client.messages.create(
            model="claude-sonnet-4-5",
            max_tokens=800,
            system=SYSTEM_PROMPT,
            messages=chat_messages
        )
        return response.content[0].text
    except Exception as e:
        print(f"Error analyzing portfolio: {e}")
        return None