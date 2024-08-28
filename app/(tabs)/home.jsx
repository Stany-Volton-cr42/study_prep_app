import React, { useState, useEffect } from 'react';
import { FlatList, Text, View, Image, RefreshControl } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { images } from '../../constants';
import EmptyState from '../../components/EmptyState';
import useAppwrite from '../../lib/useAppwrite';
import { getClasses } from '../../lib/appwrite';
import ClassList from '../../components/ClassList';
import { router } from 'expo-router';
import { useGlobalContext } from '../../context/GlobalProvider'; 

const Home = () => {
  const { user } = useGlobalContext(); // Access global user context
  const { data: classes, refetch, isLoading } = useAppwrite(getClasses); // Fetch classes

  const [refreshing, setRefreshing] = useState(false);
  const [selectedClass, setSelectedClass] = useState(null);

  useEffect(() => {
    // Load selected class from AsyncStorage on component mount
    const loadSelectedClass = async () => {
      try {
        const storedClass = await AsyncStorage.getItem('selectedClass');
        if (storedClass && storedClass.trim()) {
          setSelectedClass(storedClass);
        } else {
          setSelectedClass(null); // Handle case where no class is selected
        }
      } catch (error) {
        console.error('Failed to load selected class', error);
      }
    };

    loadSelectedClass();
  }, []);

  const onRefresh = async () => {
    setRefreshing(true);
    await refetch(); // Refresh class list
    setRefreshing(false);
  };

  const handleSelectClass = async (classId) => {
    // Store the selected class in AsyncStorage
    try {
      await AsyncStorage.setItem('selectedClass', classId);
      setSelectedClass(classId);
      // Navigate to the subjects page for the selected class
      router.push(`/classes/${classId}`);
    } catch (error) {
      console.error('Failed to store selected class', error);
    }
  };

  return (
    <SafeAreaView className="bg-primary h-full">
      <FlatList
        ListHeaderComponent={() => (
          <View className="my-6 px-4 space-y-6">
            <View className="justify-between items-start flex-row mb-6">
              <View>
                <Text className="font-pmedium text-sm text-gray-100">Welcome Back,</Text>
                <Text className="text-2xl font-psemibold text-white">{user?.username}</Text>
              </View>
              <View className="mt-1.5">
                <Image
                  source={images.logo}
                  className="w-[150px] -top-8"
                  resizeMode="contain"
                />
              </View>
            </View>
            <Text className="text-xl font-psemibold text-blue-400">Select Class</Text>
          </View>
        )}
        ListEmptyComponent={() => (
          <EmptyState
            title="No Classes Found"
            subtitle="There are no classes available at the moment."
          />
        )}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
        }
        data={classes}
        keyExtractor={(item) => item.$id}
        renderItem={({ item }) => (
          <ClassList classes={[item]} onSelectClass={handleSelectClass} />
        )}
        ListFooterComponent={isLoading ? <Text className="text-white pt-20 mx-5">Loading...</Text> : null}
      />
    </SafeAreaView>
  );
};

export default Home;
