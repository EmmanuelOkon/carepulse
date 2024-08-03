"use server";

import {
  BUCKET_ID,
  DATABASE_ID,
  databases,
  ENDPOINT,
  PATIENT_COLLECTION_ID,
  PROJECT_ID,
  storage,
  users,
} from "../appwrite.config";
import { ID, Query } from "node-appwrite";
import { InputFile } from "node-appwrite/file";
import { parseStringify } from "../utils";

// CREATE APPWRITE USER
export const createUser = async (user: CreateUserParams) => {
  try {
    // Create new user -> https://appwrite.io/docs/references/1.5.x/server-nodejs/users#create
    const newUser = await users.create(
      ID.unique(),
      user.email,
      user.phone,
      undefined,
      user.name
    );

    return parseStringify(newUser);
  } catch (error: any) {
    // Check existing user
    if (error && error?.code === 409) {
      const existingUser = await users.list([
        Query.equal("email", [user.email]),
      ]);

      return existingUser.users[0];
    }
    console.error("An error occurred while creating a new user:", error);
  }
};

// GET USER
export const getUser = async (userId: string) => {
  try {
    const user = await users.get(userId);

    return parseStringify(user);
  } catch (error) {
    console.error(
      "An error occurred while retrieving the user details:",
      error
    );
  }
};

// REGISTER PATIENT
export const registerPatient = async ({
  identificationDocument,
  ...patient
}: RegisterUserParams) => {
  try {
    // We need to upload the file to be able to access it later on using the URL and then store it. So we need to store the file before on Appwrite storage, not database
    let file;
    if (identificationDocument) {
      const inputFile =
        // identificationDocument &&
        InputFile.fromBuffer(
          identificationDocument?.get("blobFile") as Blob,
          identificationDocument?.get("fileName") as string
        );

      // So we store the file using a bucket ID, add a unique ID to the file and pass the input file itself.
      file = await storage.createFile(BUCKET_ID!, ID.unique(), inputFile);
    }

    // console.log(patient);

    // We now need to create a patient document using the uploaded file.
    const newPatient = await databases.createDocument(
      // We pass the Database ID, the patient collection ID and a unique ID for the patient we wish to create
      DATABASE_ID!,
      PATIENT_COLLECTION_ID!,
      ID.unique(),
      {
        // We pass the patient object, and if the file exists, we pass the file ID
        identificationDocumentId: file?.$id ? file.$id : null,
        identificationDocumentUrl: file?.$id
          ? `${ENDPOINT}/storage/buckets/${BUCKET_ID}/files/${file.$id}/view?project=${PROJECT_ID}`
          : null,
        ...patient,
      }
    );

    return parseStringify(newPatient);
  } catch (error: any) {
    console.error("An error occurred while creating a new patient:", error);
  }
};

// GET PATIENT
export const getPatient = async (userId: string) => {
  try {
    const patient = await databases.listDocuments(
      DATABASE_ID!,
      PATIENT_COLLECTION_ID!,
      [
        // We pass a query to filter the patient we wish to retrieve
        Query.equal("userId", userId),
      ]
    );

    return parseStringify(patient);
  } catch (error) {
    console.error(
      "An error occurred while retrieving the patient details:",
      error
    );
  }
};

// GET ALL PATIENTS
export const getAllPatients = async () => {
  try {
    const patients = await databases.listDocuments(
      DATABASE_ID!,
      PATIENT_COLLECTION_ID!
    );

    //  console.log(patients);

    return parseStringify(patients);
  } catch (error) {
    console.error(
      "An error occurred while retrieving all patient details:",
      error
    );
  }
};
