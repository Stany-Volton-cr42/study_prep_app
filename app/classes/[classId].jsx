import React, { useState, useEffect } from 'react';
import { FlatList, Text, View, RefreshControl, TouchableOpacity } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import AsyncStorage from '@react-native-async-storage/async-storage';
import useAppwrite from '../../lib/useAppwrite';
import { getSubjectsByClass, getItemById } from '../../lib/appwrite'; // Import your function for fetching subjects and class
import { useRouter, useLocalSearchParams } from 'expo-router';
import EmptyState from '../../components/EmptyState';
import SubjectList from '../../components/SubjectList'; // Component to render each subject

const Subjects = () => {
  const router = useRouter();
  const { classId } = useLocalSearchParams(); // Access query parameters from the router
  const { data: subjects, refetch, isLoading } = useAppwrite(() => getSubjectsByClass(classId)); // Fetch subjects based on classId
  const [className, setClassName] = useState(null);
  const [refreshing, setRefreshing] = useState(false);

  useEffect(() => {
    // Load class name from AsyncStorage or fetch it from the server
    const loadClassName = async () => {
      try {
        // Fetch class name from server if not found in AsyncStorage
        const classData = await getItemById(classId); // Function to get class data by ID
        setClassName(classData.name);
        // Store class name in AsyncStorage
        await AsyncStorage.setItem('selectedClassName', classData.name);
      } catch (error) {
        console.error('Failed to load class name', error);
      }
    };

    loadClassName();
  }, [classId]);

  const onRefresh = async () => {
    setRefreshing(true);
    await refetch();
    setRefreshing(false);
  };

  return (
    <SafeAreaView className="bg-primary h-full">
      <View className="my-6 px-4 space-y-6">
        <View className="justify-between items-start flex-row mb-6">
          <View>
            <Text className="font-pmedium text-sm text-gray-100">Selected Class:</Text>
            <Text className="text-2xl font-psemibold text-orange-500">{className || 'Loading...'}</Text>
          </View>
        </View>
        <Text className="text-xl font-psemibold text-white">Subjects</Text>
      </View>
      <FlatList
        data={subjects}
        keyExtractor={(item) => item.$id}
        refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} />}
        ListEmptyComponent={() => (
          <EmptyState
            title="No Subjects Found"
            subtitle="There are no subjects available for this class at the moment."
          />
        )}
        renderItem={({ item }) => (
          <SubjectList subject={item} />
        )}
        ListFooterComponent={isLoading ? <Text className="text-white pt-20 mx-5">Loading...</Text> : null}
      />
    </SafeAreaView>
  );
};

export default Subjects;
