import { View, Text } from 'react-native'
import React from 'react'
import { Image as ExpoImage } from 'expo-image';

export default function CommentCard({ profileImg, username, date, rating, comment }) {
  // Render stars
  const renderStars = (rating) => {
    const stars = [];
    for (let i = 1; i <= 5; i++) {
      stars.push(
        <Text key={i} style={{ color: i <= rating ? '#FFD700' : '#ccc', fontSize: 16 }}>
          ★
        </Text>
      );
    }
    return <View style={{ flexDirection: 'row', marginBottom: 2 }}>{stars}</View>;
  };

  return (
    <View
      style={{
        marginBottom: 18,
        backgroundColor: '#fff',
        borderRadius: 12,
        padding: 16,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.08,
        shadowRadius: 6,
        elevation: 2,
        borderWidth: 1,
        borderColor: '#f0f0f0',
      }}
    >
      <View style={{ flexDirection: 'row', alignItems: 'center', marginBottom: 6 }}>
        {profileImg ? (
          <ExpoImage
            source={profileImg}
            style={{ width: 40, height: 40, borderRadius: 20, marginRight: 12, backgroundColor: '#eee', borderWidth: 1, borderColor: '#e0e0e0' }}
            contentFit="cover"
          />
        ) : (
          <View style={{ width: 40, height: 40, borderRadius: 20, marginRight: 12, backgroundColor: '#eee' }} />
        )}
        <View style={{ flex: 1 }}>
          <Text style={{ fontWeight: 'bold', color: '#43a047', fontSize: 15 }}>{username}</Text>
          <Text style={{ color: '#888', fontSize: 12 }}>{date}</Text>
        </View>
        <View style={{ alignItems: 'flex-end' }}>{renderStars(rating)}</View>
      </View>
      <Text style={{ color: '#333', fontSize: 15, lineHeight: 22, marginTop: 2 }}>{comment}</Text>
    </View>
  )
}