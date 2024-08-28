import { Client, Account, ID, Avatars, Databases, Query, Storage } from 'react-native-appwrite';

export const config = {
    endpoint: 'https://cloud.appwrite.io/v1',
    platform: 'com.daddycoders.study_prep',
    projectId: '669a597a000404acedf5',
    databaseId: '669a5b2d0036599d877c',
    userCollectionId: '669a5b54001d89ddc975',
    classesCollectionId: '66a0c625003d12f5dcca', 
    subjectsCollectionId: '66a0bfab001d14b9b579', 
    booksCollectionId: '66a0c0690032052fbdc0', 
    tipsCollectionId: '66a0ffa9001257ab9538',
    storageId: '669a5c7f001cf7336450'
};

const client = new Client();
client
  .setEndpoint(config.endpoint)
  .setProject(config.projectId)
  .setPlatform(config.platform);

const account = new Account(client);
const avatars = new Avatars(client);
const databases = new Databases(client);
const storage = new Storage(client);

// User Management Functions

export async function createUser(email, password, username) {
  try {
    const newAccount = await account.create(
      ID.unique(),
      email,
      password,
      username
    );

    if (!newAccount) throw Error;

    const avatarUrl = avatars.getInitials(username);

    await signIn(email, password);

    const newUser = await databases.createDocument(
      config.databaseId,
      config.userCollectionId,
      ID.unique(),
      {
        accountId: newAccount.$id,
        email: email,
        username: username,
        avatar: avatarUrl,
      }
    );

    return newUser;
  } catch (error) {
    throw new Error(error);
  }
}

export async function signIn(email, password) {
  try {
    const session = await account.createEmailPasswordSession(email, password);

    return session;
  } catch (error) {
    console.log(error);
    throw new Error(error);
  }
}

export const getCurrentUser = async () => {
  try {
    const currentAccount = await account.get();

    if (!currentAccount) throw Error;

    const createUser = await databases.listDocuments(
      config.databaseId,
      config.userCollectionId,
      [Query.equal('accountId', currentAccount.$id)]
    );

    if (!createUser) throw Error;

    return createUser.documents[0];
  } catch (error) {
    console.log(error);
    return null;
  }
};

export const signOut = async () => {
  try {
    const session = await account.deleteSession('current');

    return session;
  } catch (error) {
    throw new Error(error);
  }
};

// Data Fetching Functions

// Fetch all classes
export const getClasses = async () => {
  try {
    const classes = await databases.listDocuments(config.databaseId, config.classesCollectionId);
    return classes.documents;
  } catch (error) {
    console.error('Error fetching Classes:', error);
    throw new Error(error);
  }
};

// Fetch a class
export const getItemById = async (itemId) => {
  try {
    const response = await databases.getDocument(config.databaseId, config.classesCollectionId, itemId);
    return response;
  } catch (error) {
    console.error('Error fetching class by ID:', error);
    throw new Error(error);
  }
};


// Fetch subjects for a specific class
export const getSubjectsByClass = async (classId) => {
  try {
    const subjects = await databases.listDocuments(
      config.databaseId,
      config.subjectsCollectionId,
      [Query.equal('class', classId)]
    );
    return subjects.documents;
  } catch (error) {
    console.error('Error fetching Subjects for Class:', error);
    throw new Error(error);
  }
};

// Fetch a subject
export const getSubjectById = async (itemId) => {
  try {
    const response = await databases.getDocument(config.databaseId, config.subjectsCollectionId, itemId);
    return response;
  } catch (error) {
    console.error('Error fetching class by ID:', error);
    throw new Error(error);
  }
};

// Fetch study tips from Appwrite
export const getStudyTips = async () => {
  try {
    const tips = await databases.listDocuments(config.databaseId, config.tipsCollectionId);
    return tips.documents;
  } catch (error) {
    console.error('Error fetching Study Tips:', error);
    throw new Error(error);
  }
};


// // Fetch books for a specific subject
// export const getBooksBySubject = async (subjectId) => {
//   try {
//     const books = await databases.listDocuments(
//       config.databaseId,
//       config.booksCollectionId,
//       [Query.equal('subject_id', subjectId)]
//     );
//     return books.documents;
//   } catch (error) {
//     console.error('Error fetching Books for Subject:', error);
//     throw new Error(error);
//   }
// };

// // Fetch links for a specific subject
// export const getLinksBySubject = async (subjectId) => {
//   try {
//     const links = await databases.listDocuments(
//       config.databaseId,
//       config.linksCollectionId,
//       [Query.equal('subject_id', subjectId)]
//     );
//     return links.documents;
//   } catch (error) {
//     console.error('Error fetching Links for Subject:', error);
//     throw new Error(error);
//   }
// };
