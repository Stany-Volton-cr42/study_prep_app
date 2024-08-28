import React from 'react';
import { View, Text, TouchableOpacity } from 'react-native';
import { router } from 'expo-router';

const SubjectList = ({ subject }) => {
    const handlePress = () => {
        router.push(`/subjects/${subject.$id}`);
      };

  return (
    <View className="px-4 my-2">
      <TouchableOpacity
        onPress={handlePress}
        className="p-4 mb-4 bg-gray-800 rounded-lg"
      >
        <Text className="text-xl text-secondary">{subject.name}</Text>
        {/* Add more details if needed */}
        <Text className="text-sm text-gray-100">{subject.description}</Text>
      </TouchableOpacity>
    </View>
  );
};

export default SubjectList;
