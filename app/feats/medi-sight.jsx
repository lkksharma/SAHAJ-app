import React, { useState, useEffect } from "react";
import { View, Text, StyleSheet, Image, TouchableOpacity, Alert, ActivityIndicator, Platform, ScrollView, Modal } from "react-native";
import { Appbar, Card } from "react-native-paper";
import * as ImagePicker from "expo-image-picker";
import * as Location from "expo-location";
import axios from "axios";
import { router } from "expo-router";
import { getApp, getApps, initializeApp } from 'firebase/app';
import { getFirestore, collection, getDocs, query, orderBy, limit } from 'firebase/firestore';

const firebaseConfig = {
    apiKey: "AIzaSyDaOcZkNv98Qw3lYc5m8X71T4Hq_mUj0lM",
    authDomain: "sahaj-9abf5.firebaseapp.com",
    projectId: "sahaj-9abf5",
    storageBucket: "sahaj-9abf5.appspot.com",
    messagingSenderId: "275913171338",
    appId: "1:275913171338:web:fe69a15fa0ba8fff4d9d5c",
    measurementId: "G-1HVNHZ1YQE"
};

const app = !getApps().length ? initializeApp(firebaseConfig) : getApp();
const db = getFirestore(app);

export default function Medisight() {
    const [selectedImage, setSelectedImage] = useState(null);
    const [location, setLocation] = useState(null);
    const [visible, setVisible] = useState(false);
    const [uploading, setUploading] = useState(false);
    const [modalVisible, setModalVisible] = useState(false);
    const [predictions, setPredictions] = useState([]);
    const [uploadSuccess, setUploadSuccess] = useState(false);
    const [latestDocId, setLatestDocId] = useState(null);

    const fetchPredictions = async () => {
        try {
            const medisightRef = collection(db, 'medisight');
            
            // Get all documents without ordering
            const querySnapshot = await getDocs(medisightRef);
    
            if (!querySnapshot.empty) {
                const allData = [];
                
                // Loop through each document
                querySnapshot.forEach((doc) => {
                    const docData = doc.data();
                    
                    // Add alternatives if they exist
                    if (docData.alternatives) {
                        Object.entries(docData.alternatives).forEach(([key, value]) => {
                            allData.push({
                                id: `${doc.id}_${key}`, // Combine doc ID and key for unique identifier
                                docId: doc.id,
                                ...value
                            });
                        });
                    }
                });
    
                if (allData.length > 0) {
                    console.log("All data found:", allData); // Debug log
                    setPredictions(allData);
                    setModalVisible(true);
                } else {
                    Alert.alert("No Data", "No medicine data found.");
                }
            } else {
                Alert.alert("No Entries", "No entries found in the database.");
            }
        } catch (error) {
            console.error("Error fetching data:", error);
            Alert.alert("Error", "Failed to fetch medicine data");
        }
    };
    const getLocation = async () => {
        setVisible(true);
        handleLocationPermission();
    };

    const handleLocationPermission = async () => {
        setVisible(false);
        try {
            let { status } = await Location.requestForegroundPermissionsAsync();
            if (status !== "granted") {
                Alert.alert("Permission Denied", "Location access is needed to find affordable medicine centers.");
                return;
            }
            let userLocation = await Location.getCurrentPositionAsync({});
            setLocation(userLocation.coords);
        } catch (error) {
            Alert.alert("Error", "Failed to get location. Please try again.");
        }
    };

    const pickImage = async () => {
        try {
            let result = await ImagePicker.launchImageLibraryAsync({
                mediaTypes: ImagePicker.MediaTypeOptions.Images,
                allowsEditing: true,
                aspect: [4, 3],
                quality: 1,
            });

            if (!result.canceled) {
                setSelectedImage(result.assets[0].uri);
            }
        } catch (error) {
            Alert.alert("Error", "Failed to pick image. Please try again.");
        }
    };

    const takePhoto = async () => {
        try {
            let result = await ImagePicker.launchCameraAsync({
                allowsEditing: true,
                aspect: [4, 3],
                quality: 1,
            });

            if (!result.canceled) {
                setSelectedImage(result.assets[0].uri);
            }
        } catch (error) {
            Alert.alert("Error", "Failed to take photo. Please try again.");
        }
    };

    const uploadImage = async () => {
        if (!selectedImage) {
            Alert.alert("No Image", "Please select or capture an image before uploading.");
            return;
        }
        if (!location) {
            Alert.alert("Location Required", "Please allow location access before uploading.");
            return;
        }

        setUploading(true);

        try {
            const formData = new FormData();
            
            if (Platform.OS === 'web') {
                try {
                    const response = await fetch(selectedImage);
                    const blob = await response.blob();
                    const imageFile = new File([blob], 'image.jpg', { type: blob.type });
                    formData.append('image', imageFile);
                } catch (error) {
                    console.error("Error processing image:", error);
                    throw new Error("Failed to process image");
                }
            } else {
                const imageUri = Platform.OS === 'ios' ? selectedImage.replace("file://", "") : selectedImage;
                const fileExtension = selectedImage.split('.').pop();
                formData.append('image', {
                    uri: imageUri,
                    type: `image/${fileExtension}`,
                    name: `upload.${fileExtension}`
                });
            }

            formData.append('latitude', location.latitude.toString());
            formData.append('longitude', location.longitude.toString());

            const response = await axios({
                method: 'post',
                url: 'http://127.0.0.1:8000/api/images/upload/',
                data: formData,
                headers: {
                    'Accept': 'application/json',
                    'Content-Type': 'multipart/form-data',
                },
            });

            console.log("Upload Success:", response.data);
            setUploadSuccess(true);
            
            // Add slight delay to ensure Firestore document is created
            setTimeout(async () => {
                await fetchPredictions();
            }, 2000);
            
            Alert.alert("Success", "Image uploaded successfully!");
        } catch (error) {
            console.error("Upload Error:", error);
            Alert.alert("Error", "Failed to upload image. Please try again.");
        } finally {
            setUploading(false);
        }
    };

    return (
        <>
            <Appbar.Header>
                <Appbar.BackAction onPress={() => router.push("(tabs)")} />
                <Appbar.Content title="Medi-Sight" />
            </Appbar.Header>
            
            <ScrollView>
                <View style={styles.container}>
                    <Card style={styles.infoCard}>
                        <Card.Content>
                            <Text style={styles.cardTitle}>What is Medi-Sight?</Text>
                            <Text style={styles.cardText}>
                                Medi-Sight is an intelligent tool that:
                                {"\n"}• Uses OCR to extract salt compositions and suggest PMJAY alternatives.
                                {"\n"}• Locates affordable medicine centers nearby via GPS.
                                {"\n"}• Helps track spending and savings using expense tools.
                                {"\n"}• Provides an easy way to witness and understand medical procedures.
                            </Text>
                        </Card.Content>
                    </Card>

                    {selectedImage ? (
                        <View style={styles.imageContainer}>
                            <Image source={{ uri: selectedImage }} style={styles.image} />
                            <TouchableOpacity 
                                style={styles.removeButton} 
                                onPress={() => setSelectedImage(null)}
                            >
                                <Text style={styles.removeButtonText}>❌</Text>
                            </TouchableOpacity>
                        </View>
                    ) : (
                        <Text style={styles.placeholder}>No image selected</Text>
                    )}

                    <TouchableOpacity style={styles.button} onPress={pickImage}>
                        <Text style={styles.buttonText}>📂 Pick from Gallery</Text>
                    </TouchableOpacity>

                    <TouchableOpacity style={styles.button} onPress={takePhoto}>
                        <Text style={styles.buttonText}>📷 Take a Photo</Text>
                    </TouchableOpacity>

                    <TouchableOpacity style={styles.locationButton} onPress={getLocation}>
                        <Text style={styles.buttonText}>📍 Get Location</Text>
                    </TouchableOpacity>

                    {location && (
                        <Card style={styles.locationCard}>
                            <Card.Content>
                                <Text style={styles.locationText}>
                                    🌍 Location: {"\n"}
                                    Latitude: {location.latitude.toFixed(6)}{"\n"}
                                    Longitude: {location.longitude.toFixed(6)}
                                </Text>
                            </Card.Content>
                        </Card>
                    )}

                    {uploading && <ActivityIndicator size="large" color="#6200ea" />}

                    <TouchableOpacity 
                        style={[
                            styles.uploadButton,
                            (!selectedImage || !location) && styles.disabledButton
                        ]}
                        onPress={uploadImage}
                        disabled={!selectedImage || !location}
                    >
                        <Text style={styles.buttonText}>
                            🚀 {uploading ? 'Uploading...' : 'Upload Image'}
                        </Text>
                    </TouchableOpacity>
                </View>
            </ScrollView>
            
            <Modal
    animationType="slide"
    transparent={true}
    visible={modalVisible}
    onRequestClose={() => setModalVisible(false)}
>
    <View style={styles.modalContainer}>
        <View style={styles.modalContent}>
            <Text style={styles.modalTitle}>All Available Medicines</Text>
            {predictions.length > 0 ? (
                <ScrollView style={styles.scrollView}>
                    {predictions.map((item, index) => (
                        <Card 
                            key={item.id} 
                            style={styles.predictionCard}
                        >
                            <Card.Content>
                                <Text style={styles.cardTitle}>
                                    Medicine {index + 1}
                                </Text>
                                
                                {/* Display all available fields */}
                                {item.Name_of_Product && (
                                    <Text style={styles.itemText}>Name: {item.Name_of_Product}</Text>
                                )}
                                {item.MRP && (
                                    <Text style={styles.itemText}>MRP: ₹{item.MRP}</Text>
                                )}
                                {item.Drug_Code && (
                                    <Text style={styles.itemText}>Drug Code: {item.Drug_Code}</Text>
                                )}
                                {item.Unit_Size && (
                                    <Text style={styles.itemText}>Unit Size: {item.Unit_Size}</Text>
                                )}
                                {item.Therapeutic_Group && (
                                    <Text style={styles.itemText}>Group: {item.Therapeutic_Group}</Text>
                                )}
                                {item.Salt_Composition && (
                                    <Text style={styles.itemText}>Salt: {item.Salt_Composition}</Text>
                                )}
                                {item.Manufacturer && (
                                    <Text style={styles.itemText}>Manufacturer: {item.Manufacturer}</Text>
                                )}
                            </Card.Content>
                        </Card>
                    ))}
                </ScrollView>
            ) : (
                <Text style={styles.noPredictionsText}>No data available</Text>
            )}
            <TouchableOpacity 
                style={styles.closeButton}
                onPress={() => setModalVisible(false)}
            >
                <Text style={styles.closeButtonText}>Close</Text>
            </TouchableOpacity>
        </View>
    </View>
</Modal>
        </>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        padding: 20,
        backgroundColor: "#f9f9f9",
        alignItems: "center",
    },
    infoCard: {
        margin: 20,
        padding: 15,
        width: '90%',
    },
    cardTitle: {
        fontSize: 18,
        fontWeight: "bold",
        marginBottom: 10,
    },
    cardText: {
        fontSize: 14,
        lineHeight: 20,
    },
    imageContainer: {
        position: 'relative',
        marginVertical: 20,
    },
    image: {
        width: 300,
        height: 300,
        borderRadius: 10,
    },
    removeButton: {
        position: 'absolute',
        top: -10,
        right: -10,
        backgroundColor: 'white',
        borderRadius: 15,
        width: 30,
        height: 30,
        justifyContent: 'center',
        alignItems: 'center',
        elevation: 3,
        shadowColor: "#000",
        shadowOffset: {
            width: 0,
            height: 2,
        },
        shadowOpacity: 0.25,
        shadowRadius: 3.84,
    },
    removeButtonText: {
        fontSize: 16,
    },
    placeholder: {
        marginVertical: 20,
        color: '#666',
        fontSize: 16,
    },
    button: {
        backgroundColor: "#6200ea",
        padding: 12,
        borderRadius: 8,
        alignItems: "center",
        marginVertical: 10,
        width: "80%",
    },
    locationButton: {
        backgroundColor: "#ff9800",
        padding: 12,
        borderRadius: 8,
        alignItems: "center",
        marginVertical: 10,
        width: "80%",
    },
    uploadButton: {
        backgroundColor: "#28a745",
        padding: 12,
        borderRadius: 8,
        alignItems: "center",
        marginVertical: 20,
        width: "80%",
    },
    disabledButton: {
        backgroundColor: "#cccccc",
    },
    buttonText: {
        color: "#fff",
        fontSize: 16,
        fontWeight: "bold",
    },
    locationCard: {
        padding: 10,
        marginVertical: 10,
        width: "80%",
    },
    locationText: {
        fontSize: 14,
        lineHeight: 20,
    },
    successText: {
        color: "#28a745",
        fontSize: 16,
        marginVertical: 10,
    },
    errorText: {
        color: "#dc3545",
        fontSize: 16,
        marginVertical: 10,
    },
    modalContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: 'rgba(0, 0, 0, 0.5)',
    },
    modalContent: {
        width: '90%',
        maxHeight: '80%',
        backgroundColor: 'white',
        borderRadius: 15,
        padding: 20,
        elevation: 5,
    },
    modalTitle: {
        fontSize: 24,
        fontWeight: 'bold',
        textAlign: 'center',
        marginBottom: 20,
    },
    scrollView: {
        maxHeight: '80%',
    },
    predictionCard: {
        marginBottom: 10,
    },
    closeButton: {
        backgroundColor: '#6200ea',
        padding: 15,
        borderRadius: 8,
        alignItems: 'center',
        marginTop: 15,
    },
    closeButtonText: {
        color: 'white',
        fontSize: 16,
        fontWeight: 'bold',
    },
    noPredictionsText: {
        textAlign: 'center',
        padding: 20,
        fontSize: 16,
        color: '#666',
    },
});

const additionalStyles = StyleSheet.create({
    originalCard: {
        backgroundColor: '#e8f5e9',
        borderWidth: 1,
        borderColor: '#43a047'
    },
    alternativeCard: {
        backgroundColor: '#fff'
    },
    originalTitle: {
        color: '#2e7d32',
        fontSize: 20
    },
    alternativeTitle: {
        color: '#1976d2'
    },
    itemText: {
        fontSize: 15,
        marginVertical: 2
    },
    storeCard: {
        marginTop: 15,
        backgroundColor: '#fff3e0'
    },
    storeTitle: {
        fontSize: 18,
        fontWeight: 'bold',
        color: '#e65100'
    },
    storeText: {
        fontSize: 15,
        marginTop: 5
    }
});