import React, { useEffect, useState } from "react";
import { SafeAreaView } from "react-native-safe-area-context";
import { ScrollView, Text, View, Alert } from "react-native";
import { useGlobalContext } from "../../context/GlobalProvider";
import { getStudyTips } from "../../lib/appwrite"; // Import the actual function for fetching study tips
import EmptyState from "../../components/EmptyState";

const StudyTips = () => {
  const { user } = useGlobalContext();
  const [tips, setTips] = useState([]);

  useEffect(() => {
    const fetchStudyTips = async () => {
      try {
        const tips = await getStudyTips(); // Fetch study tips from your API
        setTips(tips);
      } catch (error) {
        console.error("Error fetching study tips:", error);
        Alert.alert("Error", "Failed to fetch study tips.");
      }
    };

    fetchStudyTips();
  }, []);

  return (
    <SafeAreaView className="bg-primary h-full">
      <ScrollView contentContainerStyle={{ padding: 20 }}>
        <View className="my-6 px-4 space-y-6">
          <View className="justify-between items-start flex-row">
            <View>
              <Text className="font-pmedium text-sm text-gray-100">Study Tips</Text>
              <Text className="text-2xl font-psemibold text-secondary">Enhance Your Learning</Text>
            </View>
          </View>

          {tips.length > 0 ? (
            tips.map((tip, index) => (
              <View key={index} className="px-4 py-2 bg-gray-800 rounded-lg shadow-md mb-2">
                <Text className="text-lg font-semibold text-blue-400">{tip.title}</Text>
                <Text className="mt-2 text-gray-100">{tip.content}</Text>
              </View>
            ))
          ) : (
            <EmptyState
              title="No Tips Found"
              subtitle="Check back later for more study tips!"
            />
          )}
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

export default StudyTips;
