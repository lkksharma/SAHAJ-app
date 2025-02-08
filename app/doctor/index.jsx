import { FlatList, StyleSheet, View, Text, Alert, TouchableOpacity } from 'react-native';
import React, { useEffect, useState } from 'react';
import { signOut, onAuthStateChanged } from 'firebase/auth';  
import { auth, db } from './../../config/FirebaseConfig.jsx';  
import { Button } from 'react-native-paper';
import Header from '../../components/Header.jsx';
import { collection, query, where, getDocs } from 'firebase/firestore';
import { MaterialCommunityIcons } from '@expo/vector-icons';
git 
export default function DoctorHome() {
    const [currentUser, setCurrentUser] = useState(null);
    const [clients, setClients] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const unsubscribe = onAuthStateChanged(auth, (user) => {
            if (user) {
                setCurrentUser(user);
                fetchClients(user.email);  
            } else {
                setCurrentUser(null);
                setClients([]); 
            }
        });

        return () => unsubscribe();  
    }, []);

    const fetchClients = async (username) => {
        try {
            if (!username) return;
            
            const q = query(collection(db, "users"), where("dvit", "==", username));
            const querySnapshot = await getDocs(q);
            const clientsList = [];
            querySnapshot.forEach((doc) => {
                clientsList.push({ id: doc.id, ...doc.data() });
            });
            setClients(clientsList);
        } catch (error) {
            console.error("Error fetching clients:", error);
            Alert.alert("Error", "Failed to load clients");
        } finally {
            setLoading(false);
        }
    };

    const renderClientItem = ({ item }) => (
        <TouchableOpacity style={styles.clientCard}>
            <MaterialCommunityIcons name="account" size={24} color="#4f46e5" />
            <View style={styles.clientInfo}>
                <Text style={styles.clientName}>{item.username}</Text>
                <Text style={styles.clientEmail}>{item.email}</Text>
            </View>
            <MaterialCommunityIcons name="chevron-right" size={24} color="#94a3b8" />
        </TouchableOpacity>
    );

    return (
        <View style={styles.container}>
            <Header />
            {loading ? (
                <Text style={styles.loadingText}>Loading...</Text>
            ) : (
                <FlatList
                    data={clients}
                    renderItem={renderClientItem}
                    keyExtractor={(item) => item.id}
                    contentContainerStyle={styles.listContainer}
                    ListEmptyComponent={<Text style={styles.emptyText}>No clients found</Text>}
                />
            )}
            <Button mode="contained" onPress={() => signOut(auth)} style={styles.logoutButton}>
                Logout
            </Button>
        </View>
    );
}

const styles = StyleSheet.create({
    container: { padding: 25, backgroundColor: 'white', height: '100%' },
    listContainer: { paddingBottom: 20 },
    loadingText: { textAlign: 'center', marginTop: 20, fontSize: 16 },
    emptyText: { textAlign: 'center', marginTop: 20, fontSize: 16, color: 'gray' },
    clientCard: { flexDirection: 'row', padding: 10, borderBottomWidth: 1, borderBottomColor: '#ddd' },
    clientInfo: { marginLeft: 10 },
    clientName: { fontWeight: 'bold', fontSize: 16 },
    clientEmail: { fontSize: 14, color: 'gray' },
    logoutButton: { marginTop: 20 },
});
