from textblob import TextBlob
import pandas as pd

# 10 Mock Financial Headlines
headlines = [
    "Apple reports record-breaking quarterly revenue, surpassing expectations.",
    "Tesla stock plummets amid safety recall concerns.",
    "Markets rally as inflation data shows signs of cooling.",
    "Tech sector faces headwinds due to rising interest rates.",
    "Bitcoin surges past $45k in sudden buying spree.",
    "Company X files for bankruptcy after failed merger talks.",
    "New product launch receives mixed reviews from analysts.",
    "Earnings report shows steady growth but warns of future risks.",
    "CEO steps down unexpectedly, causing investor panic.",
    "Strategic partnership expected to boost market share significantly."
]

# Analyze Polarity
data = []
for headline in headlines:
    analysis = TextBlob(headline)
    score = analysis.sentiment.polarity
    data.append({'Headline': headline, 'Score': score})

# Create DataFrame
df = pd.DataFrame(data)

# Trade Signal Logic
def get_signal(score):
    if score > 0.5:
        return 'Buy'
    elif score < -0.5:
        return 'Sell'
    else:
        return 'Hold' # Or 'Neutral'

df['Trade Signal'] = df['Score'].apply(get_signal)

# Display Results
print(df)

# Optional: Save to CSV
df.to_csv('sentiment_results.csv', index=False)
print("\nResults saved to sentiment_results.csv")
