
import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, FlatList } from 'react-native';
import * as FileSystem from 'expo-file-system';
import { Asset } from 'expo-asset';
import Papa from 'papaparse';

const LabReportHeader = () => {
  const [data, setData] = useState([]);

  useEffect(() => {
    const loadCsvData = async () => {
      try {
        const asset = Asset.fromModule(require('./assets/scraped_data2.csv'));
        await asset.downloadAsync();

        const fileContent = await FileSystem.readAsStringAsync(asset.localUri);

        const parsedData = Papa.parse(fileContent, { header: true });

        setData(parsedData.data); 
      } catch (error) {
        console.error('Error reading CSV:', error);
      }
    };

    loadCsvData();
  }, []);

  const renderItem = ({ item }) => (
    <View style={styles.row}>
      <Text style={styles.cell}>{item.Cost}</Text>
      <Text style={styles.cell}>{item.City}</Text>
    </View>
  );

  return (
    <>
      <View style={styles.container}>
        <Text style={styles.title}>Laboratory Investigation Report</Text>
        <View style={styles.gridContainer}>
          <View style={styles.leftColumn}>
            <InfoRow label="Patient Name" value="Miss. Sanoja" />
            <InfoRow label="Age/Gender" value="19Y 0M 2D /F" />
            <InfoRow label="Aabha. No." value="ML0193" />
            <InfoRow label="Diagnosis" value="Fever" />
          </View>
          <View style={styles.rightColumn}>
            <InfoRow label="Centre" value="Fortis Hospital, Gurgaon" />
            <InfoRow label="Updation Date" value="06/Feb/2025 05:08PM" />
            <InfoRow label="Doctor" value="Dr. Satya Prakash" />
            <InfoRow label="Treatment" value="Paracetamol course" />
          </View>
        </View>
      </View>

      <View style={styles.container}>
        <Text style={styles.welcomeText}>Data from CSV:</Text>
        <FlatList
          data={data}
          keyExtractor={(item, index) => index.toString()}
          renderItem={renderItem}
        />
      </View>
    </>
  );
};

const InfoRow = ({ label, value }) => (
  <View style={styles.infoRow}>
    <Text style={styles.label}>{label}</Text>
    <Text style={styles.separator}>: </Text>
    <Text style={styles.value}>{value}</Text>
  </View>
);

const styles = StyleSheet.create({
  container: {
    borderWidth: 1,
    borderColor: '#000',
    padding: 16,
    backgroundColor: '#fff',
    margin: 10,
    borderRadius: 10,
  },
  title: {
    fontSize: 18,
    fontWeight: 'bold',
    textAlign: 'center',
    marginBottom: 15,
  },
  gridContainer: {
    flexDirection: 'row',
  },
  leftColumn: {
    flex: 1,
  },
  rightColumn: {
    flex: 1,
  },
  infoRow: {
    flexDirection: 'row',
    paddingVertical: 4,
  },
  label: {
    fontWeight: '500',
    minWidth: 50,
    fontSize: 14,
  },
  separator: {
    paddingHorizontal: 4,
  },
  value: {
    flex: 1,
    fontSize: 9,
  },
  row: {
    flexDirection: 'row',
    borderBottomWidth: 1,
    padding: 10,
  },
  cell: {
    flex: 1,
    fontSize: 14,
  },
});

export default LabReportHeader;
