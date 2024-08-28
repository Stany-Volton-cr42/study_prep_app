import React, { useEffect, useState } from 'react';
import { View, Text, ScrollView, Image, Linking, TouchableOpacity } from 'react-native';
import { useLocalSearchParams } from 'expo-router';
import { getSubjectById } from '../../lib/appwrite'; // Function to fetch subject details

const SubjectDetail = () => {
  const { subjectId } = useLocalSearchParams(); // Access query parameters from the router
  const [subject, setSubject] = useState(null);

  useEffect(() => {
    const loadSubject = async () => {
      try {
        const subjectData = await getSubjectById(subjectId); // Fetch subject details
        setSubject(subjectData);
      } catch (error) {
        console.error('Failed to load subject details', error);
      }
    };

    loadSubject();
  }, [subjectId]);

  if (!subject) {
    return (
      <View className="flex-1 justify-center items-center bg-primary p-4">
        <Text className="text-lg text-gray-100">Loading...</Text>
      </View>
    );
  }

  return (
    <ScrollView contentContainerStyle={{ padding: 20 }} className="bg-primary">
      <View className="mb-4 mt-6">
        <Text className="text-2xl font-psemibold text-secondary">{subject.name}</Text>
        <Text className="text-lg text-gray-100 mt-4">{subject.description}</Text>
      </View>

      {/* Display books related to the subject */}
      {subject.books && subject.books.length > 0 && (
        <View className="mt-6">
          <Text className="text-xl font-psemibold text-white">Books</Text>
          {subject.books.map((book, index) => (
            <View key={index} className="flex-row items-center mt-4">
              {book.image && (
                <Image
                  source={{ uri: book.image }}
                  style={{ width: 100, height: 150, marginRight: 10 }}
                />
              )}
              <View className="pr-2">
                <Text className="text-lg text-blue-400">{book.title }</Text>
                <Text className="text-sm text-gray-100">{book.author}</Text>
                {book.url && (
                  <TouchableOpacity
                    onPress={() => Linking.openURL(book.url)}
                    className="mt-2"
                  >
                    <Text className="text-sm text-blue-400 underline">More Info</Text>
                  </TouchableOpacity>
                )}
              </View>
            </View>
          ))}
        </View>
      )}

      {subject.assignments && subject.assignments.length > 0 && (
        <View className="mt-6">
          <Text className="text-xl font-psemibold text-white">Assignments</Text>
          {subject.assignments.map((assignment, index) => (
            <View key={index} className="mt-2">
              <Text className="text-lg text-gray-100">{assignment}</Text>
            </View>
          ))}
        </View>
      )}

      {subject.instructor && (
        <View className="mt-6">
          <Text className="text-xl font-psemibold text-white">Instructor</Text>
          <Text className="text-lg text-gray-100 mt-2">Name: {subject.instructor[0]}</Text>
          <Text className="text-lg text-gray-100 mt-1">Email: {subject.instructor[1]}</Text>
        </View>
      )}

      {subject.notes && (
        <View className="mt-6">
          <Text className="text-xl font-psemibold text-white">Notes</Text>
          <Text className="text-lg text-gray-100 mt-2">{subject.notes}</Text>
        </View>
      )}
    </ScrollView>
  );
};

export default SubjectDetail;
