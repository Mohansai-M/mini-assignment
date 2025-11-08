import faqs from "../../data/faqs.json";

const results = (searchWords) => {
  const stopwords = ["the", "a", "an", "on", "in", "of", "and", "to", "for", "by"];
  const filteredWords = searchWords.filter((w) => !stopwords.includes(w));
  const scoredResults = faqs.map((faq) => {
    let score = 0;
    const title = faq.title.toLowerCase();
    const body = faq.body.toLowerCase();

    for (let word of filteredWords) {
      if (title.includes(word)) score++;
      if (body.includes(word)) score++;
    }

    return { ...faq, score };
  });

  return scoredResults;
};

export default results;
