import React, { useState } from 'react';
import { View, Text, StyleSheet, Image, TouchableOpacity, Alert } from 'react-native';
import { Appbar, Button, Card, Dialog, Portal, Paragraph } from 'react-native-paper';
import * as ImagePicker from 'expo-image-picker';
import * as Location from 'expo-location';
import { router } from 'expo-router';

export default function Medisight() {
    const [selectedImage, setSelectedImage] = useState(null);
    const [location, setLocation] = useState(null);
    const [visible, setVisible] = useState(false);

    const getLocation = async () => {
        setVisible(true); 
    };

    const handleLocationPermission = async () => {
        setVisible(false); 
        let { status } = await Location.requestForegroundPermissionsAsync();
        if (status !== 'granted') {
            Alert.alert('Permission Denied', 'Location access is needed to find affordable medicine centers.');
            return;
        }
        let userLocation = await Location.getCurrentPositionAsync({});
        setLocation(userLocation.coords);
    };

    const pickImage = async () => {
        let result = await ImagePicker.launchImageLibraryAsync({
            mediaTypes: ImagePicker.MediaTypeOptions.Images,
            allowsEditing: true,
            aspect: [4, 3],
            quality: 1,
        });

        if (!result.canceled) {
            setSelectedImage(result.assets[0].uri);
        }
    };

    const takePhoto = async () => {
        let result = await ImagePicker.launchCameraAsync({
            allowsEditing: true,
            aspect: [4, 3],
            quality: 1,
        });

        if (!result.canceled) {
            setSelectedImage(result.assets[0].uri);
        }
    };

    return (
        <>
            <Appbar.Header>
                <Appbar.BackAction onPress={() => router.push('(tabs)')} />
                <Appbar.Content title="Medi-Sight" />
            </Appbar.Header>

            <View style={styles.container}>
                <Card style={{ margin: 20, padding: 15 }}>
                    <Text style={{ fontSize: 18, fontWeight: 'bold' }}>What is Medi-Sight?</Text>
                    <Text style={{ marginTop: 10 }}>
                        Medi-Sight is an intelligent tool that:
                        {'\n'}• Uses OCR to extract salt compositions and suggest PMJAY alternatives.
                        {'\n'}• Locates affordable medicine centers nearby via GPS.
                        {'\n'}• Helps track spending and savings using expense tools.
                        {'\n'}• Provides an easy way to witness and understand medical procedures.
                    </Text>
                </Card>

                {selectedImage ? (
                    <View style={styles.imageContainer}>
                        <Image source={{ uri: selectedImage }} style={styles.image} />
                        <TouchableOpacity style={styles.removeButton} onPress={() => setSelectedImage(null)}>
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
                            🌍 Location: {'\n'}
                            Latitude: {location.latitude}{'\n'}
                            Longitude: {location.longitude}
                        </Text>
                    </Card>
                )}
            </View>

            <Portal>
                <Dialog visible={visible} onDismiss={() => setVisible(false)}>
                    <Dialog.Title>Privacy Notice</Dialog.Title>
                    <Dialog.Content>
                        <Paragraph>
                            At Sahaj, we do not store your location. It is only used to guide you to the nearest affordable medicine center.
                        </Paragraph>
                    </Dialog.Content>
                    <Dialog.Actions>
                        <Button onPress={() => setVisible(false)}>Cancel</Button>
                        <Button onPress={handleLocationPermission}>Allow</Button>
                    </Dialog.Actions>
                </Dialog>
            </Portal>
        </>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        padding: 20,
        backgroundColor: '#f9f9f9',
        alignItems: 'center',
        justifyContent: 'center',
    },
    imageContainer: {
        position: 'relative',
        marginBottom: 20,
    },
    image: {
        width: 300,
        height: 300,
        borderRadius: 10,
    },
    removeButton: {
        position: 'absolute',
        top: 10,
        right: 10,
        backgroundColor: 'rgba(255, 255, 255, 0.8)',
        borderRadius: 15,
        padding: 5,
    },
    removeButtonText: {
        fontSize: 20,
        color: 'red',
    },
    placeholder: {
        fontSize: 16,
        color: 'gray',
        marginBottom: 20,
    },
    button: {
        backgroundColor: '#6200ea',
        padding: 12,
        borderRadius: 8,
        alignItems: 'center',
        marginVertical: 10,
        width: '80%',
    },
    locationButton: {
        backgroundColor: '#ff9800',
        padding: 12,
        borderRadius: 8,
        alignItems: 'center',
        marginVertical: 10,
        width: '80%',
    },
    buttonText: {
        color: '#fff',
        fontSize: 16,
        fontWeight: 'bold',
    },
    locationCard: {
        marginTop: 20,
        padding: 15,
        backgroundColor: 'white',
        borderRadius: 10,
        elevation: 3,
    },
    locationText: {
        fontSize: 16,
        fontWeight: 'bold',
        textAlign: 'center',
    },
});
