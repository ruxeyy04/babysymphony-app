import { Client, Account } from 'react-native-appwrite';

import { appwriteConfig } from '../config/appwrite';

// Init your React Native SDK
const client = new Client();

client
  .setEndpoint(appwriteConfig.endpoint) // Your Appwrite Endpoint
  .setProject(appwriteConfig.projectId) // Your project ID
  .setPlatform(appwriteConfig.platform) // Your application ID or bundle ID.
  ;

const account = new Account(client);

const create = () => {
  // Register User
  account.create(ID.unique(), 'me@example.com', 'password', 'Jane Doe')
    .then(function (response) {
      console.log(response);
    }, function (error) {
      console.log(error);
    });
}