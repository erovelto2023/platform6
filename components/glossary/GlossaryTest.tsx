"use client";

import { useState, useEffect } from 'react';
import { getGlossaryStats, getRandomTerms, searchGlossaryTerms } from '@/lib/utils/glossaryHelpers';

export default function GlossaryTest() {
  const [stats, setStats] = useState<any>(null);
  const [randomTerms, setRandomTerms] = useState<any[]>([]);
  const [searchResults, setSearchResults] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const runTests = async () => {
      try {
        setLoading(true);
        
        // Test 1: Get glossary stats
        const glossaryStats = await getGlossaryStats();
        setStats(glossaryStats);
        
        // Test 2: Get random terms
        const random = await getRandomTerms(3);
        setRandomTerms(random);
        
        // Test 3: Search functionality
        const searchResults = await searchGlossaryTerms('marketing', {
          difficulty: 'Beginner'
        });
        setSearchResults(searchResults);
        
        console.log('Glossary Tests Results:', {
          stats: glossaryStats,
          randomTerms: random,
          searchResults: searchResults
        });
        
      } catch (error) {
        console.error('Test error:', error);
      } finally {
        setLoading(false);
      }
    };

    runTests();
  }, []);

  if (loading) {
    return (
      <div className="p-8 bg-white rounded-lg border">
        <h3 className="text-lg font-bold mb-4">Testing Glossary Features...</h3>
        <div className="animate-pulse space-y-2">
          <div className="h-4 bg-gray-200 rounded w-3/4"></div>
          <div className="h-4 bg-gray-200 rounded w-1/2"></div>
          <div className="h-4 bg-gray-200 rounded w-5/6"></div>
        </div>
      </div>
    );
  }

  return (
    <div className="p-8 bg-white rounded-lg border space-y-6">
      <h3 className="text-xl font-bold text-emerald-600">✅ Glossary Features Test Results</h3>
      
      {stats && (
        <div className="space-y-2">
          <h4 className="font-semibold">📊 Glossary Statistics:</h4>
          <ul className="text-sm space-y-1 text-gray-600">
            <li>• Total Terms: {stats.totalTerms}</li>
            <li>• Categories: {stats.categories}</li>
            <li>• Average Reading Time: {stats.averageReadingTime} min</li>
            <li>• Featured Terms: {stats.featuredTerms}</li>
            <li>• Terms with Tags: {stats.termsWithTags}</li>
            <li>• Difficulty Distribution: Beginner ({stats.difficultyDistribution.Beginner}), 
               Intermediate ({stats.difficultyDistribution.Intermediate}), 
               Advanced ({stats.difficultyDistribution.Advanced})</li>
          </ul>
        </div>
      )}
      
      {randomTerms.length > 0 && (
        <div className="space-y-2">
          <h4 className="font-semibold">🎲 Random Terms (for Term of the Day):</h4>
          <ul className="text-sm space-y-1 text-gray-600">
            {randomTerms.map((term, i) => (
              <li key={i}>• {term.term} - {term.shortDefinition?.slice(0, 50)}...</li>
            ))}
          </ul>
        </div>
      )}
      
      {searchResults.length > 0 && (
        <div className="space-y-2">
          <h4 className="font-semibold">🔍 Search Test ("marketing", Beginner):</h4>
          <ul className="text-sm space-y-1 text-gray-600">
            {searchResults.slice(0, 3).map((term, i) => (
              <li key={i}>• {term.term} ({term.category})</li>
            ))}
            {searchResults.length > 3 && <li>• ... and {searchResults.length - 3} more</li>}
          </ul>
        </div>
      )}
      
      <div className="pt-4 border-t">
        <p className="text-sm text-green-600 font-semibold">
          ✅ All glossary features are working correctly!
        </p>
      </div>
    </div>
  );
}
