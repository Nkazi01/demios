import React from 'react';
import { ArrowLeft, Clock, Eye, Share, Bookmark, ThumbsUp } from 'lucide-react';
import { Button } from './ui/button';
import { Card, CardContent } from './ui/card';
import { Badge } from './ui/badge';

interface ArticleViewProps {
  article: any;
  onBack: () => void;
}

export default function ArticleView({ article, onBack }: ArticleViewProps) {
  if (!article) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <p>No article selected</p>
      </div>
    );
  }

  const articleContent = `
# ${article.title}

## Introduction

${article.summary}

## Key Points

### 1. Understanding the Basics
It's important to understand the fundamental concepts before diving into specific prevention strategies. The human body has natural defense mechanisms, but we can strengthen them through proper care and awareness.

### 2. Daily Practices
Implementing simple daily practices can make a significant difference in maintaining good health:

- Regular hand washing with soap and water
- Maintaining proper hygiene standards
- Following a balanced diet rich in nutrients
- Getting adequate sleep and rest
- Staying hydrated throughout the day

### 3. Prevention Strategies
Prevention is always better than cure. Here are some effective strategies:

- **Early detection**: Regular health check-ups can help identify issues early
- **Lifestyle modifications**: Small changes in daily routine can have big impacts
- **Community awareness**: Sharing knowledge with family and neighbors
- **Professional guidance**: Consulting healthcare providers when needed

### 4. When to Seek Help
It's crucial to know when to seek professional medical help:

- Persistent symptoms that don't improve
- Sudden onset of severe symptoms
- Any concerns about your health condition
- Regular check-ups as recommended by your doctor

## Conclusion

Taking care of your health is an ongoing process that requires commitment and awareness. By following these guidelines and staying informed, you can maintain better health and contribute to the well-being of your community.

Remember, this information is for educational purposes only and should not replace professional medical advice. Always consult with a healthcare provider for specific medical concerns.
  `;

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="bg-white border-b border-gray-200 p-4">
        <div className="flex items-center gap-4">
          <Button variant="ghost" size="sm" onClick={onBack}>
            <ArrowLeft className="w-4 h-4" />
          </Button>
          <h1 className="text-lg font-medium line-clamp-1">Article</h1>
        </div>
      </div>
      
      <div className="max-w-4xl mx-auto p-4 space-y-6">
        <Card>
          <CardContent className="p-0">
            <div className="h-48 bg-gray-200 overflow-hidden">
              <img
                src={article.image}
                alt={article.title}
                className="w-full h-full object-cover"
              />
            </div>
            
            <div className="p-6">
              <div className="flex items-center gap-2 mb-4">
                <Badge variant="outline">{article.category}</Badge>
                <div className="flex items-center gap-4 text-sm text-gray-500">
                  <div className="flex items-center gap-1">
                    <Clock className="w-4 h-4" />
                    <span>{article.readTime}</span>
                  </div>
                  <div className="flex items-center gap-1">
                    <Eye className="w-4 h-4" />
                    <span>{article.views.toLocaleString()}</span>
                  </div>
                </div>
              </div>
              
              <h1 className="text-2xl font-semibold mb-4">{article.title}</h1>
              
              <div className="flex gap-2 mb-6">
                <Button variant="outline" size="sm">
                  <ThumbsUp className="w-4 h-4 mr-2" />
                  Like
                </Button>
                <Button variant="outline" size="sm">
                  <Bookmark className="w-4 h-4 mr-2" />
                  Save
                </Button>
                <Button variant="outline" size="sm">
                  <Share className="w-4 h-4 mr-2" />
                  Share
                </Button>
              </div>
              
              <div className="prose prose-sm max-w-none">
                <div className="whitespace-pre-line text-gray-700 leading-relaxed">
                  {articleContent}
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="p-6">
            <h3 className="font-medium mb-4">Related Articles</h3>
            <div className="space-y-3">
              {[
                'Managing Chronic Conditions in Rural Areas',
                'Nutrition Guidelines for Rural Families',
                'Emergency Care When Medical Help is Far'
              ].map((title, index) => (
                <div key={index} className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg cursor-pointer hover:bg-gray-100 transition-colors">
                  <div className="w-12 h-8 bg-gray-300 rounded flex-shrink-0"></div>
                  <div className="flex-1 min-w-0">
                    <p className="font-medium text-sm line-clamp-1">{title}</p>
                    <p className="text-xs text-gray-500">5 min read</p>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
        
        <Card className="bg-blue-50 border-blue-200">
          <CardContent className="p-6 text-center">
            <h3 className="font-medium mb-2 text-blue-900">Need Medical Advice?</h3>
            <p className="text-sm text-blue-700 mb-4">
              This article is for educational purposes only. For personalized medical advice, consult with a healthcare professional.
            </p>
            <Button className="bg-blue-600 hover:bg-blue-700">
              Find a Doctor
            </Button>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}