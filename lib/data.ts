import { Question } from './types';

// Generate 1000+ questions using placeholder data
export function generateQuestions(): Question[] {
    const categories = [
        'Technology', 'Science', 'Health', 'Education', 'Business',
        'Arts', 'Sports', 'Travel', 'Food', 'Environment', 'Politics',
        'Psychology', 'Philosophy', 'History', 'Mathematics'
    ];

    const questionTemplates = [
        'How does {topic} work?',
        'What are the benefits of {topic}?',
        'Why is {topic} important?',
        'What are the challenges with {topic}?',
        'How can I learn {topic}?',
        'What is the future of {topic}?',
        'How does {topic} affect {topic2}?',
        'What are the best practices for {topic}?',
        'How to implement {topic}?',
        'What are the risks of {topic}?',
        'How to optimize {topic}?',
        'What are the alternatives to {topic}?',
        'How to troubleshoot {topic}?',
        'What are the trends in {topic}?',
        'How to measure {topic}?'
    ];

    const topics = [
        'artificial intelligence', 'machine learning', 'blockchain', 'cloud computing',
        'data science', 'cybersecurity', 'web development', 'mobile development',
        'quantum computing', 'robotics', 'virtual reality', 'augmented reality',
        'internet of things', 'edge computing', 'microservices', 'devops',
        'agile methodology', 'user experience', 'digital marketing', 'e-commerce',
        'sustainable energy', 'climate change', 'renewable resources', 'biodiversity',
        'mental health', 'nutrition', 'fitness', 'meditation', 'sleep optimization',
        'financial planning', 'investment strategies', 'entrepreneurship', 'leadership',
        'creative writing', 'music production', 'photography', 'graphic design',
        'language learning', 'online education', 'critical thinking', 'problem solving'
    ];

    const questions: Question[] = [];

    for (let i = 0; i < 1000; i++) {
        const category = categories[Math.floor(Math.random() * categories.length)];
        const template = questionTemplates[Math.floor(Math.random() * questionTemplates.length)];
        const topic1 = topics[Math.floor(Math.random() * topics.length)];
        const topic2 = topics[Math.floor(Math.random() * topics.length)];

        const title = template
            .replace('{topic}', topic1)
            .replace('{topic2}', topic2);

        const content = generateAnswer(topic1, category);

        questions.push({
            id: `q-${i + 1}`,
            title,
            content,
            category,
            tags: generateTags(topic1, category),
            createdAt: new Date(Date.now() - Math.random() * 365 * 24 * 60 * 60 * 1000).toISOString()
        });
    }

    return questions;
}

function generateAnswer(topic: string, category: string): string {
    const answers = {
        'Technology': `This is a comprehensive explanation about ${topic} in the technology sector. ${topic} has revolutionized how we approach modern challenges and continues to evolve rapidly. The key principles involve understanding the underlying mechanisms, implementation strategies, and best practices that have been developed through extensive research and practical application.`,
        'Science': `From a scientific perspective, ${topic} represents a fascinating area of study that combines theoretical knowledge with practical applications. Research in this field has shown significant progress in understanding the fundamental principles that govern ${topic} and its various applications across different domains.`,
        'Health': `In the context of health and wellness, ${topic} plays a crucial role in maintaining and improving overall well-being. Studies have demonstrated the positive effects of ${topic} on various aspects of health, including physical, mental, and emotional well-being.`,
        'Education': `Educational approaches to ${topic} focus on creating effective learning experiences that help individuals understand and apply concepts effectively. The pedagogy surrounding ${topic} emphasizes hands-on learning, critical thinking, and practical application of knowledge.`,
        'Business': `From a business perspective, ${topic} represents both opportunities and challenges for organizations. Companies that successfully implement ${topic} strategies often see improved efficiency, customer satisfaction, and competitive advantage in their respective markets.`
    };

    return answers[category as keyof typeof answers] || `This is a detailed explanation about ${topic} in the ${category} domain. The topic encompasses various aspects that are important for understanding its practical applications and theoretical foundations.`;
}

function generateTags(topic: string, category: string): string[] {
    const baseTags = [category.toLowerCase(), topic.toLowerCase()];
    const additionalTags = [
        'beginner', 'intermediate', 'advanced', 'tutorial', 'guide',
        'tips', 'best-practices', 'troubleshooting', 'optimization'
    ];

    const randomTags = additionalTags
        .sort(() => Math.random() - 0.5)
        .slice(0, Math.floor(Math.random() * 3) + 1);

    return [...baseTags, ...randomTags];
}

// Export the questions data
export const questions = generateQuestions();
