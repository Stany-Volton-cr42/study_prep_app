import React from 'react';
import { View, Text, TouchableOpacity } from 'react-native';

const ClassList = ({ classes, onSelectClass }) => {
  return (
    <View className="px-4 my-1">
      {classes.map((classItem) => (
        <TouchableOpacity
          key={classItem.$id}
          onPress={() => onSelectClass(classItem.$id)}
          className="p-4 mb-4 bg-gray-800 rounded-lg"
        >
          <Text className="text-xl text-secondary pb-2">{classItem.name}</Text>
          <Text className="text-sm text-gray-100">{classItem.description}</Text>
        </TouchableOpacity>
      ))}
    </View>
  );
};

export default ClassList;
