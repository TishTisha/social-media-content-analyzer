// analyzeEngagement.js
import natural from "natural";

// Tone dictionaries
const toneWords = {
  positive: [
    "good", "great", "excellent", "happy", "love", "amazing",
    "fantastic", "awesome", "brilliant", "win", "success", "wonderful"
  ],
  negative: [
    "bad", "sad", "angry", "poor", "hate", "terrible",
    "horrible", "worst", "awful", "failure", "disappointing"
  ],
  funny: [
    "lol", "lmao", "rofl", "haha", "hehe", "funny", "joke",
    "meme", "comic", "banter", "clown", "sarcasm"
  ],
  flirty: [
    "cute", "handsome", "beautiful", "hot", "sexy", "date",
    "kiss", "crush", "darling", "babe", "sweetheart"
  ],
  genz: [
    "bruh", "sus", "lit", "yeet", "vibe", "slay", "cap",
    "based", "fr", "lowkey", "highkey", "aesthetic"
  ],
  informational: [
    "news", "report", "update", "fact", "information",
    "study", "analysis", "data", "research", "insight"
  ],
  sad: [
    "cry", "tears", "lonely", "heartbroken", "grief",
    "miss", "pain", "sorrow", "broken", "depressed"
  ],
  angry: [
    "rage", "furious", "mad", "fight", "annoyed", "irritated",
    "yell", "hate", "frustrated", "pissed"
  ],
  abusive: [
    "idiot", "stupid", "dumb", "loser", "trash", "moron",
    "shut up", "clown", "nonsense", "toxic"
  ],
  adult: [
    "sex", "nude", "porn", "xxx", "nsfw", "adult", "onlyfans",
    "erotic", "kinky", "fetish", "intimate"
  ]
};

// -------------------- Keyword → Hashtag extractor --------------------
function extractKeywords(text) {
  const stopwords = [
    "the","and","is","of","in","a","to","for","with","on","at",
    "this","that","it","we","you","he","she","they","as","by","from","was"
  ];

  const words = text.split(/\s+/)
    .map(w => w.replace(/[^a-zA-Z]/g, "")) // remove punctuation/numbers
    .filter(Boolean)
    .map(w => w.toLowerCase());

  // Filter out stopwords + short words
  const keywords = words.filter(
    w => !stopwords.includes(w) && w.length > 3
  );

  // Pick top 5 unique words (first occurrences)
  return [...new Set(keywords.slice(0, 5))].map(
    w => "#" + w.charAt(0).toUpperCase() + w.slice(1)
  );
}

// -------------------- Engagement Analyzer --------------------
export function analyzeEngagement(text) {
  if (!text || text.trim().length === 0) {
    return {
      wordCount: 0,
      avgSentenceLength: 0,
      sentiment: "neutral",
      tone: "neutral",
      hashtags: [],
      suggestedHashtags: [],
      emojiCount: 0
    };
  }

  // Split text into words & sentences
  const words = text.split(/\s+/).filter(Boolean);
  const sentences = text.split(/[.!?]/).filter((s) => s.trim().length > 0);

  const wordCount = words.length;
  const avgSentenceLength = sentences.length
    ? Math.round(wordCount / sentences.length)
    : wordCount;

  // Sentiment (naive)
  let pos = 0, neg = 0;
  for (const w of words) {
    const lw = w.toLowerCase();
    if (toneWords.positive.includes(lw)) pos++;
    if (toneWords.negative.includes(lw)) neg++;
  }
  let sentiment = "neutral";
  if (pos > neg) sentiment = "positive";
  else if (neg > pos) sentiment = "negative";

  // Tone detection
  const scores = {};
  for (const [tone, list] of Object.entries(toneWords)) {
    scores[tone] = words.filter((w) =>
      list.includes(w.toLowerCase())
    ).length;
  }
  const dominantTone = Object.keys(scores).reduce((a, b) =>
    scores[a] > scores[b] ? a : b
  , "neutral");

  // Hashtags
  const hashtags = words.filter((w) => w.startsWith("#"));
  let suggestedHashtags = [];

  if (hashtags.length === 0) {
    suggestedHashtags = extractKeywords(text);

    // Fallback if keyword extraction yields nothing
    if (suggestedHashtags.length === 0) {
      suggestedHashtags = ["#Trending", "#Viral", "#InTheNews"];
    }
  }

  // Emoji count
  const emojiCount = (text.match(
    /([\u231A-\u231B]|\u23E9|\u23EA|\u23EB|\u23EC|[\u23F0\u23F3]|\u25FD|\u25FE|\u2600-\u27BF|\u2B50|\u2B06|\u2B07|\u2934|\u2935|\u3030|\u303D|\u3297|\u3299|\uD83C[\uDC00-\uDFFF]|\uD83D[\uDC00-\uDFFF]|\uD83E[\uDD00-\uDDFF])/g
  ) || []).length;

  return {
    wordCount,
    avgSentenceLength,
    sentiment,
    tone: dominantTone,
    hashtags,
    suggestedHashtags,
    emojiCount
  };
}
