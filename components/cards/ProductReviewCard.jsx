import { View, Text } from 'react-native';
import React from 'react';

export default function ProductReviewCard({ comments = [] }) {
  if (!comments.length) return null;
  // Calculate average rating, total ratings, and star counts
  const totalRatings = comments.length;
  const starCounts = [0, 0, 0, 0, 0]; // index 0 = 1 star, 4 = 5 stars
  let sum = 0;
  comments.forEach(c => {
    const r = Math.round(c.rating);
    sum += c.rating;
    if (r >= 1 && r <= 5) starCounts[r - 1]++;
  });
  const avgRating = sum / totalRatings;

  return (
    <View style={{ flexDirection: 'row', marginBottom: 18, alignItems: 'center' }}>
      {/* Left: Average and stars */}
      <View style={{ alignItems: 'center', minWidth: 80, marginRight: 18 }}>
        <Text style={{ fontSize: 36, fontWeight: 'bold', color: '#222', lineHeight: 40 }}>{avgRating.toFixed(1)}</Text>
        <Text style={{ color: '#888', fontSize: 15, marginBottom: 2 }}>/5</Text>
        <View style={{ flexDirection: 'row', marginBottom: 2 }}>
          {[1,2,3,4,5].map(i => (
            <Text key={i} style={{ color: i <= Math.round(avgRating) ? '#FFD700' : '#e0e0e0', fontSize: 22, marginHorizontal: 1 }}>★</Text>
          ))}
        </View>
        <Text style={{ color: '#43a047', fontWeight: 'bold', fontSize: 13 }}>{totalRatings} Ratings</Text>
      </View>
      {/* Right: Distribution bars */}
      <View style={{ flex: 1, justifyContent: 'center' }}>
        {[5,4,3,2,1].map(star => {
          const count = starCounts[star-1];
          const percent = totalRatings ? count / totalRatings : 0;
          return (
            <View key={star} style={{ flexDirection: 'row', alignItems: 'center', marginBottom: 3 }}>
              <Text style={{ width: 18, color: '#888', fontSize: 14 }}>{star}</Text>
              <Text style={{ color: '#FFD700', fontSize: 15, marginRight: 2 }}>★</Text>
              <View style={{ flex: 1, height: 10, backgroundColor: '#f0f0f0', borderRadius: 5, overflow: 'hidden', marginHorizontal: 4 }}>
                <View style={{
                  width: `${percent * 100}%`,
                  height: '100%',
                  backgroundColor: percent > 0.7 ? '#43a047' : percent > 0.3 ? '#FFD700' : '#bdbdbd',
                  borderRadius: 5,
                }} />
              </View>
              <Text style={{ width: 28, color: '#888', fontSize: 13, textAlign: 'right' }}>{count}</Text>
            </View>
          );
        })}
      </View>
    </View>
  );
}