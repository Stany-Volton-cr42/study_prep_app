import { router } from "expo-router";
import { SafeAreaView } from "react-native-safe-area-context";
import { View, Image, FlatList, TouchableOpacity, Text, ActivityIndicator } from "react-native";
import { icons } from "../../constants";
import { getClasses, getSubjectsByClass, signOut } from "../../lib/appwrite";
import { useGlobalContext } from "../../context/GlobalProvider";
import EmptyState from "../../components/EmptyState";
import InfoBox from "../../components/InfoBox.jsx";
import { useState, useEffect } from "react";

const Profile = () => {
  const { user, setUser, setIsLogged } = useGlobalContext();
  const [classes, setClasses] = useState([]);
  const [subjectsByClass, setSubjectsByClass] = useState({});
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchClassesAndSubjects = async () => {
      try {
        setLoading(true); // Set loading state to true when starting fetch
        const classesData = await getClasses();
        setClasses(classesData);

        const subjectsData = {};
        for (const cls of classesData) {
          const subjects = await getSubjectsByClass(cls.$id);
          subjectsData[cls.$id] = subjects;
        }
        setSubjectsByClass(subjectsData);
      } catch (error) {
        console.error("Error fetching classes or subjects:", error);
      } finally {
        setLoading(false); // Set loading state to false after fetch is complete
      }
    };

    fetchClassesAndSubjects();
  }, []);

  const logout = async () => {
    await signOut();
    setUser(null);
    setIsLogged(false);
    router.replace("/sign-in");
  };

  const renderSubject = ({ item }) => (
    <View className="p-4 bg-gray-800 rounded-lg shadow-md mb-2">
      <Text className="text-lg font-semibold text-white">{item.name}</Text>
    </View>
  );

  const renderClassItem = ({ item }) => (
    <View className="mb-4 px-4">
      <Text className="text-xl font-semibold text-secondary mb-2">{item.name}</Text>
      <FlatList
        data={subjectsByClass[item.$id]}
        keyExtractor={(item) => item.$id}
        renderItem={renderSubject}
        ListEmptyComponent={() => (
          <Text className="text-gray-300">No subjects found for this class.</Text>
        )}
      />
    </View>
  );

  return (
    <SafeAreaView className="bg-primary h-full">
      {loading ? (
        <View className="flex-1 justify-center items-center">
          <ActivityIndicator size="large" color="#ffffff" />
        </View>
      ) : (
        <FlatList
          data={classes}
          keyExtractor={(item) => item.$id}
          ListEmptyComponent={() => (
            <EmptyState
              title="No Classes Found"
            />
          )}
          ListHeaderComponent={() => (
            <View className="w-full flex justify-center items-center mt-6 mb-12 px-4">
              <TouchableOpacity
                onPress={logout}
                className="flex w-full items-end mb-10"
              >
                <Image
                  source={icons.logout}
                  resizeMode="contain"
                  className="w-6 h-6"
                />
              </TouchableOpacity>

              <View className="w-16 h-16 border border-secondary rounded-lg flex justify-center items-center">
                <Image
                  source={{ uri: user?.avatar }}
                  className="w-[90%] h-[90%] rounded-lg"
                  resizeMode="cover"
                />
              </View>

              <InfoBox
                title={user?.username}
                containerStyles="mt-5"
                titleStyles="text-lg"
              />
              <View className="my-6 px-4 space-y-6">
                <Text className="text-xl font-psemibold text-blue-400" >Enrolled Classes</Text>
              </View>
            </View> 
          )}
          renderItem={renderClassItem}
        />
      )}
    </SafeAreaView>
  );
};

export default Profile;
