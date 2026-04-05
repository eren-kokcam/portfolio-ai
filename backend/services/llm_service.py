import anthropic
from core.config import settings

client = anthropic.Anthropic(api_key=settings.anthropic_api_key)

def analyze_portfolio(context: str) -> str:
    try:
        response = client.messages.create(
            model="claude-opus-4-5",
            max_tokens=1024,
            system="You are an experienced portfolio analyst and financial advisor. Analyze the user's portfolio and answer their questions. Always respond in Turkish.",
            messages=[
                {"role": "user", "content": context}
            ]
        )
        return response.content[0].text
    except Exception as e:
        print(f"Error analyzing portfolio: {e}")
        return None