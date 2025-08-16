import React from 'react';
import { ArrowLeft, BookOpen, Clock, Eye } from 'lucide-react';
import { Button } from './ui/button';
import { Card, CardContent } from './ui/card';
import { Badge } from './ui/badge';

interface HealthEducationProps {
  onNavigate: (screen: string, data?: any) => void;
  onBack: () => void;
}

export default function HealthEducation({ onNavigate, onBack }: HealthEducationProps) {
  const articles = [
    {
      id: 1,
      title: 'Preventing Common Infections',
      summary: 'Learn about basic hygiene practices and vaccination to prevent common infections in rural areas.',
      category: 'Prevention',
      readTime: '5 min read',
      views: 1243,
      image: 'https://images.unsplash.com/photo-1559757148-5c350d0d3c56?w=400&h=200&fit=crop',
      content: 'Complete article content about preventing infections...'
    },
    {
      id: 2,
      title: 'Managing Diabetes at Home',
      summary: 'Essential tips for diabetes management, diet planning, and blood sugar monitoring.',
      category: 'Chronic Care',
      readTime: '8 min read',
      views: 892,
      image: 'https://images.unsplash.com/photo-1504813184591-01572f98c85f?w=400&h=200&fit=crop',
      content: 'Complete article content about diabetes management...'
    },
    {
      id: 3,
      title: 'Maternal Health Care Basics',
      summary: 'Important information for expectant mothers about prenatal care and nutrition.',
      category: 'Women\'s Health',
      readTime: '6 min read',
      views: 654,
      image: 'https://images.unsplash.com/photo-1555252333-9f8e92e65df9?w=400&h=200&fit=crop',
      content: 'Complete article content about maternal health...'
    },
    {
      id: 4,
      title: 'Child Vaccination Schedule',
      summary: 'Complete guide to childhood immunizations and their importance for rural children.',
      category: 'Pediatrics',
      readTime: '4 min read',
      views: 976,
      image: 'https://images.unsplash.com/photo-1542736705-53f0131d1e98?w=400&h=200&fit=crop',
      content: 'Complete article content about child vaccination...'
    },
    {
      id: 5,
      title: 'Heart Health in Rural Areas',
      summary: 'Understanding cardiovascular health risks and prevention strategies for rural populations.',
      category: 'Cardiology',
      readTime: '7 min read',
      views: 534,
      image: 'https://images.unsplash.com/photo-1559757175-0eb30cd8c063?w=400&h=200&fit=crop',
      content: 'Complete article content about heart health...'
    },
    {
      id: 6,
      title: 'Mental Health Awareness',
      summary: 'Recognizing signs of mental health issues and finding support in rural communities.',
      category: 'Mental Health',
      readTime: '10 min read',
      views: 723,
      image: 'https://images.unsplash.com/photo-1472214103451-9374bd1c798e?w=400&h=200&fit=crop',
      content: 'Complete article content about mental health...'
    }
  ];

  const categories = ['All', 'Prevention', 'Chronic Care', 'Women\'s Health', 'Pediatrics', 'Cardiology', 'Mental Health'];

  const handleArticleClick = (article: any) => {
    onNavigate('article-view', { selectedArticle: article });
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="bg-white border-b border-gray-200 p-4">
        <div className="flex items-center gap-4">
          <Button variant="ghost" size="sm" onClick={onBack}>
            <ArrowLeft className="w-4 h-4" />
          </Button>
          <h1 className="text-xl font-medium">Health Education</h1>
        </div>
      </div>
      
      <div className="p-4 space-y-6">
        <div className="flex gap-2 overflow-x-auto pb-2">
          {categories.map((category) => (
            <Badge
              key={category}
              variant="outline"
              className="cursor-pointer whitespace-nowrap px-4 py-2 hover:bg-blue-50 hover:border-blue-300"
            >
              {category}
            </Badge>
          ))}
        </div>
        
        <div className="space-y-4">
          {articles.map((article) => (
            <Card key={article.id} className="cursor-pointer hover:shadow-md transition-shadow" onClick={() => handleArticleClick(article)}>
              <CardContent className="p-0">
                <div className="flex gap-4 p-4">
                  <div className="w-24 h-18 bg-gray-200 rounded-lg flex-shrink-0 overflow-hidden">
                    <img
                      src={article.image}
                      alt={article.title}
                      className="w-full h-full object-cover"
                    />
                  </div>
                  
                  <div className="flex-1 min-w-0">
                    <div className="flex items-start justify-between mb-2">
                      <h3 className="font-medium line-clamp-2">{article.title}</h3>
                      <Badge variant="outline" className="text-xs ml-2 flex-shrink-0">
                        {article.category}
                      </Badge>
                    </div>
                    
                    <p className="text-sm text-gray-600 line-clamp-2 mb-3">
                      {article.summary}
                    </p>
                    
                    <div className="flex items-center gap-4 text-xs text-gray-500">
                      <div className="flex items-center gap-1">
                        <Clock className="w-3 h-3" />
                        <span>{article.readTime}</span>
                      </div>
                      <div className="flex items-center gap-1">
                        <Eye className="w-3 h-3" />
                        <span>{article.views.toLocaleString()}</span>
                      </div>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
        
        <Card className="bg-gradient-to-r from-blue-50 to-green-50 border-blue-200">
          <CardContent className="p-6 text-center">
            <BookOpen className="w-12 h-12 text-blue-600 mx-auto mb-4" />
            <h3 className="font-medium mb-2">Want to contribute?</h3>
            <p className="text-sm text-gray-600 mb-4">
              Share your health knowledge with the rural community
            </p>
            <Button variant="outline" className="border-blue-300 text-blue-600 hover:bg-blue-50">
              Submit Article
            </Button>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}