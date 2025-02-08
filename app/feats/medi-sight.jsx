import React, { useState } from "react";
import { View, Text, StyleSheet, Image, TouchableOpacity, Alert, ActivityIndicator, Platform } from "react-native";
import { Appbar, Card } from "react-native-paper";
import * as ImagePicker from "expo-image-picker";
import * as Location from "expo-location";
import axios from "axios";
import { router } from "expo-router";

export default function Medisight() {
    const [selectedImage, setSelectedImage] = useState(null);
    const [location, setLocation] = useState(null);
    const [visible, setVisible] = useState(false);
    const [uploading, setUploading] = useState(false);
    const [uploadSuccess, setUploadSuccess] = useState(false);
    const [errorMessage, setErrorMessage] = useState(null);

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
        setErrorMessage(null);

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
                const imageUri = Platform.OS === 'ios' ? selectedImage.replace('file://', '') : selectedImage;
                const fileExtension = selectedImage.split('.').pop();
                
                formData.append('image', {
                    uri: imageUri,
                    type: `image/${fileExtension}`,
                    name: `upload.${fileExtension}`
                });
            }

            formData.append('latitude', location.latitude.toString());
            formData.append('longitude', location.longitude.toString());

            for (let pair of formData.entries()) {
                console.log(pair[0], pair[1]);
            }

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
            Alert.alert("Success", "Image uploaded successfully!");
            setSelectedImage(null);
            setLocation(null);
        } catch (error) {
            console.error("Upload Error:", error);
            let errorMsg = "Failed to upload image. Please try again.";
            if (error.response?.data) {
                console.error("Server Error Details:", error.response.data);
                errorMsg = error.response.data.message || errorMsg;
            }
            setErrorMessage(errorMsg);
            Alert.alert("Error", errorMsg);
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

            <View style={styles.container}>
                <Card style={styles.infoCard}>
                    <Text style={styles.cardTitle}>What is Medi-Sight?</Text>
                    <Text style={styles.cardText}>
                        Medi-Sight is an intelligent tool that:
                        {"\n"}• Uses OCR to extract salt compositions and suggest PMJAY alternatives.
                        {"\n"}• Locates affordable medicine centers nearby via GPS.
                        {"\n"}• Helps track spending and savings using expense tools.
                        {"\n"}• Provides an easy way to witness and understand medical procedures.
                    </Text>
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
                        <Text style={styles.locationText}>
                            🌍 Location: {"\n"}
                            Latitude: {location.latitude.toFixed(6)}{"\n"}
                            Longitude: {location.longitude.toFixed(6)}
                        </Text>
                    </Card>
                )}

                {uploading && <ActivityIndicator size="large" color="#6200ea" />}
                {uploadSuccess && (
                    <Text style={styles.successText}>✅ Image uploaded successfully!</Text>
                )}
                {errorMessage && <Text style={styles.errorText}>{errorMessage}</Text>}

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
});