import anthropic
from core.config import settings

client = anthropic.Anthropic(api_key=settings.anthropic_api_key)

def analyze_portfolio(context: str) -> str:
    try:
        response = client.messages.create(
            model="claude-sonnet-4-5",
            max_tokens=800,
            system="""You are an experienced portfolio analyst and financial advisor. 
                    Analyze the user's portfolio and answer their questions. 
                    Always respond in Turkish.

                    Always structure your response in these exact sections:
                    ## 📊 Portföy Özeti
                    Brief 1-2 sentence overview of the portfolio.

                    ## 💰 Varlık Analizi
                    Analyze each asset briefly.
                    One line per asset maximum.

                    ## ⚠️ Riskler
                    Key risks, max 2 bullet points.

                    ## 💡 Öneriler  
                    Actionable recommendations, max 2 bullet points.

                    ## ❓ Sorular
                    Ask max 2 follow-up questions to continue the conversation.

                    Keep each section concise. No unnecessary padding.
                    Keep each section concise. No unnecessary padding.

                    Maximum 2-3 sentences per section. Be direct and brief.
                    Maximum 400-500 words total. Be concise but complete.
                    Each section should cover the essentials without padding.""",
            messages=[
                {"role": "user", "content": context}
            ]
        )
        return response.content[0].text
    except Exception as e:
        print(f"Error analyzing portfolio: {e}")
        return None