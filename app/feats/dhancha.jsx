import React, { useState, useEffect } from 'react';
import {
  SafeAreaView,
  ScrollView,
  StyleSheet,
  Text,
  View,
  TouchableOpacity,
  Animated,
} from 'react-native';
import { Table, Row, Rows } from 'react-native-table-component';
import { Appbar, TextInput, Surface, Searchbar, Divider } from 'react-native-paper';
import { router } from 'expo-router';
import { MaterialCommunityIcons } from '@expo/vector-icons';
const InfoRow = ({ label, value }) => (
    <View style={styles.row}>
      <Text style={styles.label}>{label}:</Text>
      <Text style={styles.value}>{value}</Text>
    </View>
  );
  const AnimatedSearchBar = ({ value, onChangeText }) => {
    const [isFocused, setIsFocused] = useState(false);
    const animatedWidth = new Animated.Value(0);
  
    useEffect(() => {
      Animated.timing(animatedWidth, {
        toValue: isFocused ? 1 : 0,
        duration: 200,
        useNativeDriver: false,
      }).start();
    }, [isFocused]);
  
    return (
      <View style={styles.searchContainer}>
        <Searchbar
          placeholder="Search treatments..."
          onChangeText={onChangeText}
          value={value}
          style={[
            styles.searchBar,
            isFocused && styles.searchBarFocused
          ]}
          onFocus={() => setIsFocused(true)}
          onBlur={() => setIsFocused(false)}
          icon="magnify"
          iconColor="#6366f1"
          placeholderTextColor="#94a3b8"
          inputStyle={styles.searchInput}
        />
        <Animated.View 
          style={[
            styles.searchUnderline,
            {
              width: animatedWidth.interpolate({
                inputRange: [0, 1],
                outputRange: ['0%', '100%']
              })
            }
          ]} 
        />
      </View>
    );
  };
  
  const CustomTable = ({ headers, rows }) => (
    <View style={styles.tableWrapper}>
      <View style={styles.tableHeader}>
        {headers.map((header, index) => (
          <View key={index} style={styles.headerCell}>
            <Text style={styles.headerText}>{header}</Text>
          </View>
        ))}
      </View>
      <View style={styles.tableBody}>
        {rows.map((row, rowIndex) => (
          <View key={rowIndex} style={[
            styles.tableRow,
            rowIndex % 2 === 0 ? styles.evenRow : styles.oddRow
          ]}>
            {row.map((cell, cellIndex) => (
              <View key={cellIndex} style={styles.tableCell}>
                <Text style={styles.cellText}>{cell}</Text>
              </View>
            ))}
          </View>
        ))}
      </View>
    </View>
  );
  
  const PaginationControls = ({ currentPage, totalPages, onPrevious, onNext }) => (
    <View style={styles.paginationContainer}>
      <TouchableOpacity
        onPress={onPrevious}
        disabled={currentPage === 1}
        style={[styles.paginationButton, currentPage === 1 && styles.disabledButton]}
      >
        <MaterialCommunityIcons name="chevron-left" size={20} color="#6366f1" />
        <Text style={styles.paginationText}>Previous</Text>
      </TouchableOpacity>
  
      <View style={styles.pageIndicator}>
        <Text style={styles.pageNumber}>{currentPage}</Text>
        <Text style={styles.pageTotal}>of {totalPages}</Text>
      </View>
  
      <TouchableOpacity
        onPress={onNext}
        disabled={currentPage === totalPages}
        style={[styles.paginationButton, currentPage === totalPages && styles.disabledButton]}
      >
        <Text style={styles.paginationText}>Next</Text>
        <MaterialCommunityIcons name="chevron-right" size={20} color="#6366f1" />
      </TouchableOpacity>
    </View>
  );
  
const App = () => {
  const [searchText, setSearchText] = useState('');
  const [tableData, setTableData] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 30;

  const csvData = `
Surgery,Cost range (in INR)
Abdominoplasty cost in Hyderabad,Rs. 100000- Rs. 220000
Abdominoplasty cost in Raipur,Rs. 100000 - Rs. 200000
Abdominoplasty cost in Bhubaneshwar,Rs. 100000 - Rs. 182000
Abdominoplasty cost in Visakhapatnam,Rs. 100000 - Rs. 200000
Abdominoplasty cost in Nagpur,Rs. 100000 - Rs. 200000
Abdominoplasty cost in Indore,Rs. 100000- Rs. 170000
Abdominoplasty cost in Aurangabad,Rs. 100000 - Rs. 200000
Abdominoplasty cost in India,Rs. 100000 - Rs. 350000
Aortic valve replacement cost in Hyderabad,Rs. 200000 to Rs. 400000
Aortic valve replacement cost in Raipur,Rs. 200000 to Rs. 300000
Cost in Indore,Rs. 55000/-
Hysterolaparoscopy Cost in Aurangabad,Rs. 55000/-
Hysterolaparoscopy Cost in India,Rs. 45000/- - Rs. 60000/-
Aortic valve replacement cost in Bhubaneswar,Rs. 200000 to Rs. 400000
Aortic valve replacement cost in Visakhapatnam,Rs. 200000 to Rs. 400000
Aortic valve replacement cost in Nagpur,Rs. 200000 to Rs.400000
Aortic valve replacement cost in Indore,Rs. 200000 to Rs. 350000
Aortic valve replacement cost in Aurangabad,Rs. 200000 to Rs. 400000
Aortic valve replacement cost in India,Rs. 200000 to Rs. 500000
Ankle replacement surgery cost in Hyderabad,Rs. 150000 - Rs. 400000
Ankle replacement surgery cost in Raipur,Rs. 150000 - Rs. 250000
Ankle replacement surgery cost in Bhubaneshwar,Rs. 150000 - Rs. 400000
Ankle replacement surgery cost in Visakhapatnam,Rs. 150000 - Rs. 350000
Ankle replacement surgery cost in Nagpur,Rs. 150000 - Rs. 300000
Ankle replacement surgery cost in Indore,Rs. 150000 - Rs. 300000
Ankle replacement surgery cost in Aurangabad,Rs. 150000 - Rs. 350000
Ankle replacement surgery cost in India,Rs. 150000 - Rs. 450000
ACL surgery cost in Hyderabad,Rs. 120000 to Rs. 280000
ACL surgery cost in Raipur,Rs. 100000 to Rs. 200000
ACL surgery cost in Bhubaneswar,Rs. 120000  to Rs. 290000
ACL surgery cost in Visakhapatnam,Rs. 100000 to Rs. 250000
ACL surgery cost in Indore,Rs. 125000  to Rs. 200000
ACL surgery cost in Nagpur,Rs. 120000 to Rs. 265000
ACL surgery cost in Aurangabad,Rs. 110000 to Rs. 280000
ACL surgery cost in India,Rs. 100000 to Rs. 320000
Appendix surgery cost in Hyderabad,Rs. 35000 to Rs. 120000
Appendix surgery cost in Bangalore,Rs. 40000 to Rs. 150000
Appendix surgery cost in Mumbai,Rs. 30000 to Rs. 150000
Appendix surgery cost in Chennai,Rs. 30000 to Rs. 100000
Appendix surgery cost in Lucknow,Rs. 25000 to Rs. 90000
Appendix surgery cost in Faridabad,Rs. 25000 to Rs. 94000
Appendix surgery cost in India,Rs. 25000 to Rs. 150000
Balloon Angioplasty,Rs. 75000 to Rs. 125000
Stent Placement,Rs. 100000 to Rs. 175000
Drug-Eluting Stent (DES),Rs. 150000 to Rs. 250000
Rotational Atherectomy,Rs. 200000 to Rs. 300000
Directional Atherectomy,Rs. 250000 to Rs. 350000
Laser Angioplasty,Rs. 200000 to Rs. 300000
Cerebral Angioplasty,Rs. 30000 to Rs. 45000
Peripheral Angioplasty,Rs. 48000 to Rs. 60000
Coronary Artery Stent,Rs. 199000 to Rs. 245000
Renal Artery Angioplasty,Rs. 425000 to Rs. 500000
PTA for Femoral Artery,Rs. 100000 to Rs. 280000
Valvuloplasty,Rs. 275000 to Rs. 380000
Body contouring cost in Hyderabad,Rs. 70000 - Rs. 400000
Body contouring cost in Raipur,Rs. 70000 - Rs. 250000
Body contouring cost in Bhubaneswar,Rs. 70000 - Rs. 350000
Body contouring cost in Visakhapatnam,Rs. 70000 - Rs. 350000
Body contouring cost in Nagpur,Rs. 70000 - Rs. 250000
Body contouring cost in Indore,Rs. 70000 - Rs. 250000
Body contouring cost in Aurangabad,Rs. 70000 - Rs. 220000
Body contouring cost in India,Rs. 70000 - Rs. 350000
Biopsy cost in Hyderabad,Rs. 2000 to Rs. 12000
Biopsy cost in Raipur,Rs. 2000 to Rs. 5500
Biopsy cost in Bhubaneswar,Rs. 2000 to Rs. 6000
Biopsy cost in Visakhapatnam,Rs. 2000 to Rs. 5000
Biopsy cost in Nagpur,Rs. 2000 to Rs. 9000
Biopsy cost in Pune,Rs. 2000 to Rs. 10000
Biopsy cost in Indore,Rs. 2000 to Rs. 8000
Biopsy cost in Aurangabad,Rs. 2000 to Rs. 5000
Biopsy cost in India,Rs. 2000 to Rs. 12000
Bone scan cost in Hyderabad,Rs. 3000 to Rs. 9000
Bone scan cost in Raipur,Rs. 3000 to Rs. 7000
Bone scan cost in Bhubaneswar,Rs. 3000 to Rs. 7000
Bone scan cost in Visakhapatnam,Rs. 3000 to Rs. 6000
Bone scan cost in Nagpur,Rs. 3000 to Rs. 8500
Bone scan cost in Indore,Rs. 3000 to Rs. 8000
Bone scan cost in Aurangabad,Rs. 3000 to Rs. 6000
Bone scan cost in India,Rs. 3000 to Rs. 10000
Brain tumour surgery cost in Hyderabad,Rs. 150000 to Rs. 4.75000
Brain tumour surgery cost in Raipur,Rs. 150000 to Rs. 380000
Brain tumour surgery cost in Bhubaneswar,Rs. 150000 to Rs. 380000
Brain tumour surgery cost in Visakhapatnam,Rs. 150000 to Rs. 400000
Brain tumour surgery cost in Nagpur,Rs. 150000 to Rs. 420000
Brain tumour surgery cost in Indore,Rs. 150000 to Rs. 375000
Brain tumour surgery cost in Aurangabad,Rs. 150000 to Rs. 380000
Brain tumour surgery cost in India,Rs. 150000 to Rs. 500000
Breast reduction surgery cost in Hyderabad,Rs. 80000 to Rs. 250000
Breast reduction surgery cost in Raipur,Rs. 80000 to Rs. 150000
Breast reduction surgery cost in Bhubaneswar,Rs. 80000 to Rs. 200000
Breast reduction surgery cost in Visakhapatnam,Rs. 80000 to Rs. 200000
Breast reduction surgery cost in Nagpur,Rs. 80000 to Rs. 200000
Breast reduction surgery cost in Indore,Rs. 80000 to Rs. 225000
Breast reduction surgery cost in Aurangabad,Rs. 80000 to Rs. 180000
Breast reduction surgery cost in India,Rs. 80000 to Rs. 300000
Blood cancer treatment cost in Hyderabad,Rs. 38000 to Rs. 2000000
Blood cancer treatment cost in Raipur,Rs. 38000 to Rs. 1900000
Blood cancer treatment cost in Bhubaneswar,Rs. 38000 to Rs. 2200000
Blood cancer treatment cost in Visakhapatnam,Rs. 38000 to Rs. 1900000
Blood cancer treatment cost in Nagpur,Rs. 38000 to Rs. 2000000
Blood cancer treatment cost in Indore,Rs. 38000 to Rs. 2000000
Blood cancer treatment in Aurangabad,Rs. 38000 to Rs. 1900000
Blood cancer treatment cost In India,Rs. 38000 to Rs. 2200000
Breast cancer treatment cost in Hyderabad,Rs. 85000 to Rs. 550000
Breast cancer treatment cost in Raipur,Rs. 85000 to Rs. 400000
Breast cancer treatment cost in Bhubaneswar,Rs. 85000 to Rs. 350000
Breast cancer treatment cost in Visakhapatnam,Rs. 85000 to Rs. 350000
Breast cancer treatment cost in Nagpur,Rs. 85000 to Rs. 450000
Breast cancer treatment cost in Indore,Rs. 85000  to Rs. 425000
Breast cancer treatment cost in Aurangabad,Rs. 85000 to Rs. 300000
Breast cancer treatment cost in India,Rs. 85000 to Rs. 600000
Breast augmentation surgery cost in Hyderabad,Rs. 100000 to Rs. 250000
Breast augmentation surgery cost in Raipur,Rs. 100000 to Rs. 200000
Breast augmentation surgery cost in Bhubaneswar,Rs. 100000 to Rs. 250000
Breast augmentation surgery cost in Visakhapatnam,Rs. 100000 to Rs. 200000
Breast augmentation surgery cost in Nagpur,Rs. 100000 to Rs. 250000
Breast augmentation surgery cost in Indore,Rs. 100000 to Rs. 200000
Breast augmentation surgery cost in Aurangabad,Rs. 100000 to Rs. 200000
Breast augmentation surgery cost in India,Rs. 100000 to Rs. 350000
Blepharoplasty cost in Hyderabad,Rs. 40000 - Rs. 300000
Blepharoplasty cost in Raipur,Rs. 40000 - Rs. 250000
Blepharoplasty cost in Bhubaneswar,Rs. 40000 - Rs. 250000
Blepharoplasty cost in Visakhapatnam,Rs. 40000 - Rs. 300000
Blepharoplasty cost in Nagpur,Rs. 40000 - Rs. 250000
Blepharoplasty cost in Indore,Rs. 40000 – Rs. 200000
Blepharoplasty cost in Aurangabad,Rs. 40000 - Rs. 200000
Blepharoplasty cost in India,Rs. 40000 - Rs. 350000
Bone Marrow Transplant Cost in Hyderabad,Rs. 1250000 – Rs. 2000000
Bone Marrow Transplant Cost in Raipur,Rs. 1250000 – Rs. 2000000
Bone Marrow Transplant Cost in Bhubaneshwar,Rs. 1250000 – Rs. 2000000
Bone Marrow Transplant Cost in Visakhapatnam,Rs. 1250000 – Rs. 2000000
Bone Marrow Transplant Cost in Nagpur,Rs. 1000000 – Rs. 1800000
Bone Marrow Transplant Cost in Indore,Rs. 1250000 – Rs. 2000000
Bone Marrow Transplant Cost in Aurangabad,Rs. 1250000 – Rs. 2000000
Bone Marrow Transplant Cost in India,Rs. 1000000 – Rs. 2000000
Botox cost in Hyderabad,Rs. 7000 to Rs. 23000
Botox cost in Raipur,Rs. 7000 to Rs. 15000
Botox cost in Bhubaneswar,Rs. 8000 to Rs. 25000
Botox cost in Visakhapatnam,Rs. 7000 to Rs. 20000
Botox cost in Indore,Rs. 7000 to Rs. 15000
Botox cost in Nagpur,Rs. 8000 to Rs. 18000
Botox cost in Aurangabad,Rs. 7000 to Rs. 18000
Botox cost in IndiaRs. 5000 to Rs. 25000
Bronchoscopy Cost in DelhiRs. 15000Rs. 7000Rs. 25000
Bronchoscopy Cost in AhmedabadRs. 10000Rs. 5000Rs. 18000
Bronchoscopy Cost in BangaloreRs. 15000Rs. 7000Rs. 25000
Bronchoscopy Cost in MumbaiRs. 14000Rs. 6000Rs. 25000
Bronchoscopy Cost in ChennaiRs. 12000Rs. 6000Rs. 20000
Bronchoscopy Cost in HyderabadRs. 15000Rs. 7000Rs. 25000
Bronchoscopy Cost in KolkataRs. 15000Rs. 6000Rs. 25000
Bypass Surgery Cost in Hyderabad,Rs. 300000 to Rs. 550000
Bypass Surgery Cost in Raipur,Rs. 220000 to Rs. 350000
Bypass Surgery Cost in Bhubaneswar,Rs. 290000 to Rs. 500000
Bypass Surgery Cost in Visakhapatnam,Rs. 220000 to Rs. 380000
Bypass Surgery Cost in Nagpur,Rs. 250000 to Rs. 380000
Bypass Surgery Cost in Indore,Rs. 250000 to Rs. 380000
Bypass Surgery Cost in Aurangabad,Rs. 220000 to Rs. 400000
Bypass Surgery Cost in India,Rs. 200000 to Rs. 600000
Breast Lump Removal Surgery Cost in HyderabadRs. 75000 /-
Breast Lump Removal Surgery Cost in RaipurRs. 59000 /-
Breast Lump Removal Surgery Cost in BhubaneswarRs. 68000 /-
Breast Lump Removal Surgery Cost in VisakhapatnamRs. 57500 /-
Breast Lump Removal Surgery Cost in NagpurRs. 60000 /-
Breast Lump Removal Surgery Cost in IndoreRs. 74000 /-
Breast Lump Removal Surgery Cost in AurangabadRs. 85000/-
Breast Lump Removal Surgery Cost in IndiaRs. 55000 /-  - Rs. 85000 /-
Deep brain stimulation cost in Hyderabad,Rs. 500000 to Rs. 1400000
Deep brain stimulation cost in Raipur,Rs. 500000 to Rs. 1000000
Deep brain stimulation cost in Bhubaneswar,Rs. 500000 to Rs. 1000000
Deep brain stimulation cost in Visakhapatnam,Rs. 500000 to Rs. 1000000
Deep brain stimulation cost in Nagpur,Rs. 500000 to Rs. 1000000
Deep brain stimulation cost in Indore,Rs. 500000 to Rs. 1000000
Deep brain stimulation cost in Aurangabad,Rs. 500000 to Rs. 1000000
Deep brain stimulation cost in India,Rs. 500000 to Rs. 1500000
Dental Implants Cost in Hyderabad,Rs. 300000/-
Dental Implants Cost in Raipur,Rs. 240000/-
Dental Implants Cost in Bhubaneswar,Rs. 260000/-
Dental Implants Cost in Visakhapatnam,Rs. 260000/-
Dental Implants Cost in Nagpur,Rs. 245000/-
Dental Implants Cost in Indore,Rs. 265000/-
Dental Implants Cost in Aurangabad,Rs. 300000/-
Dental Implants Cost in India,Rs. 220000/-  - Rs. 350000/-
Echocardiography cost in Hyderabad,Rs. 700 to Rs. 5000
Echocardiography cost in Raipur,Rs. 700 to Rs. 4500
Echocardiography cost in Bhubaneswar,Rs. 700 to Rs. 4500
Echocardiography cost in Visakhapatnam,Rs. 700 to Rs. 4500
Echocardiography cost in Nagpur,Rs. 700 to Rs. 3500
Echocardiography cost in Indore,Rs. 700 to Rs. 3000
Echocardiography cost in Aurangabad,Rs. 700 to Rs. 2500
Echocardiography cost in India,Rs. 700 to Rs. 5000
Endoscopy cost in Hyderabad,Rs. 1500 to Rs. 8000
Endoscopy cost in Raipur,Rs. 1500 to Rs. 8000
Endoscopy cost in Bhubaneswar,Rs. 1500 to Rs. 9000
Endoscopy cost in Visakhapatnam,Rs. 1500 to Rs. 9500
Endoscopy cost in Indore,Rs. 1500 to Rs. 8000
Endoscopy cost in Nagpur,Rs. 1500 to Rs. 9000
Endoscopy cost in Aurangabad,Rs. 1500 to Rs. 8000
Endoscopy Cost in India,Rs. 1500 to Rs. 10000
Enteroscopy cost in Hyderabad,Rs. 15000 to Rs. 35000
Enteroscopy cost in Raipur,Rs. 15000 to Rs. 25000
Enteroscopy cost in Bhubaneswar,Rs. 15000 to Rs. 30000
Enteroscopy cost in Visakhapatnam,Rs. 15000 to Rs. 30000
Enteroscopy cost in Nagpur,Rs. 15000 to Rs. 35000
Enteroscopy cost in Indore,Rs. 15000 to Rs. 20000
Enteroscopy cost in Aurangabad,Rs. 15000 to Rs. 35000
Enteroscopy cost in India,Rs. 15000 to Rs. 40000
Colposcopy cost in Hyderabad,Rs. 12000 - Rs. 35000
Colposcopy cost in Raipur,Rs. 12000 - Rs. 40000
Colposcopy cost in Bhubaneswar,Rs. 12000 - Rs. 35000
Colposcopy cost in Visakhapatnam,Rs. 12000 - Rs. 40000
Colposcopy cost in Nagpur,Rs. 12000 - Rs. 40000
Colposcopy cost in Indore,Rs. 12000 - Rs. 35000
Colposcopy cost in Aurangabad,Rs. 12000 - Rs. 35000
Colposcopy cost in India (average),Rs. 12000 - Rs. 50000
Chemical peel cost in Hyderabad,Rs. 2500 to Rs. 15000
Chemical peel cost in Raipur,Rs. 2500 to Rs. 10000
Chemical peel cost in Bhubaneswar,Rs. 2500 to Rs. 10000
Chemical peel cost in Visakhapatnam,Rs. 2500 to Rs. 12000
Chemical peel cost in Nagpur,Rs. 2500 to Rs. 8000
Chemical peel cost in Indore,Rs. 2500 to Rs. 12000
Chemical peel cost in Aurangabad,Rs. 2500 to Rs. 8500
Chemical peel cost in India,Rs. 2500 to Rs. 20000
Cochlear implant cost in Hyderabad,Rs. 500000 to Rs. 950000
Cochlear implant cost in Raipur,Rs. 500000 to Rs. 750000
Cochlear implant cost in Bhubaneswar,Rs. 500000 to Rs. 900000
Cochlear implant cost in Visakhapatnam,Rs. 500000 to Rs. 850000
Cochlear implant cost in Nagpur,Rs. 500000 to Rs. 900000
Cochlear implant cost in Indore,Rs. 500000 to Rs. 925000
Cochlear implant cost in Aurangabad,Rs. 500000 to Rs. 800000
Cochlear implant cost in India,Rs. 500000 to Rs.1200000
Coronary angiography cost in Hyderabad,Rs. 12000 to Rs. 40000
Coronary angiography cost in Raipur,Rs. 12000 to Rs. 20000
Coronary angiography cost in Bhubaneswar,Rs. 12000 to Rs. 20000
Coronary angiography cost in Visakhapatnam,Rs. 12000 to Rs. 22000
Coronary angiography cost in Nagpur,Rs. 12000 to Rs. 35000
Coronary angiography cost in Indore,Rs. 12000 to Rs. 25000
Coronary angiography cost in Aurangabad,Rs. 12000 to Rs. 25000
Coronary angiography cost in India,Rs. 12000 to Rs. 50000
Chemotherapy Cost in Hyderabad,Rs. 15000 to Rs. 500000.
Chemotherapy Cost in Raipur,Rs. 15000 to Rs. 500000
Chemotherapy cost in Bhubaneswar,Rs. 15000 to Rs. 500000
Chemotherapy cost in Visakhapatnam,Rs. 15000 to Rs. 500000
Chemotherapy cost in Nagpur,Rs. 15000 to Rs. 500000
Chemotherapy cost in Indore,Rs. 15000 to Rs. 500000
Chemotherapy cost in Aurangabad,Rs.15000 to Rs. 500000
Chemotherapy cost in India,Rs. 15000 to Rs. 500000
C-section in Hyderabad,Rs. 50000 – Rs. 200000
C-section in Raipur,Rs. 50000 – Rs. 150000
C-section in Bhubaneshwar,Rs. 50000 – Rs. 150000
C-section in Visakhapatnam,Rs. 50000 – Rs. 180000
C-section in Nagpur,Rs. 50000 – Rs. 180000
C-section in Indore,Rs. 50000 – Rs. 180000
C-section in Aurangabad,Rs. 50000 – Rs. 180000
C-section in India,Rs. 50000 - Rs. 200000
Phacoemulsification Surgery,Rs. 30000 - Rs. 215000
Phacoemulsification Cataract Surgery,Rs. 32000 - Rs. 65000
Femtosecond Laser Assisted Cataract Surgery- FLACS,Rs. 50000 - Rs. 160000
Manual Small Incision Cataract Surgery- MSICS,Rs. 15000 - Rs. 30000
Microincision Cataract Surgery,Rs. 60000 - Rs. 70000
Colonoscopy  cost in Hyderabad,Rs. 3000 to Rs. 15000
Colonoscopy  cost in Raipur,Rs. 2500 to Rs. 10000
Colonoscopy  cost in Bhubaneswar,Rs. 4000 to Rs. 12000
Colonoscopy cost in Visakhapatnam,Rs. 2200 to Rs. 10000
Colonoscopy cost in Indore,Rs. 3000 to Rs. 9000
Colonoscopy cost in Nagpur,Rs. 2000 to Rs. 8000
Colonoscopy cost in Aurangabad,Rs. 2500 to Rs. 10000
Colonoscopy cost in India,Rs. 3000 to Rs. 25000
Cost of Craniotomy in Hyderabad,Rs. 200000 – Rs. 450000
Cystoscopy Cost in Hyderabad,Rs. 15000 - Rs. 65000
Cystoscopy  Cost in Raipur,Rs. 15000 - Rs. 70000
Cystoscopy Cost in Bhubaneshwar,Rs. 12000 - Rs. 80000
Cystoscopy Cost in Visakhapatnam,Rs. 20000 - Rs. 55000
Cystoscopy Cost in Nagpur,Rs. 15000 - Rs. 60000
Cystoscopy Cost in Indore,Rs. 15000 - Rs. 80000
Cystoscopy Cost in Aurangabad,Rs. 20000 - Rs. 70000
Cystoscopy Cost in India,Rs. 15000 - Rs. 80000
Capsule Endoscopy Cost in Hyderabad,Rs. 70000 to Rs. 180000
Capsule Endoscopy Cost in Raipur,Rs. 60000 to Rs. 150000
Capsule Endoscopy Cost in Bhubaneswar,Rs. 60000 to Rs. 150000
Capsule Endoscopy Cost in Visakhapatnam,Rs. 60000 to Rs. 150000
Capsule Endoscopy Cost in Nagpur,Rs. 50000 to Rs. 140000
Capsule Endoscopy Cost in Indore,Rs. 50000 to Rs. 130000
Capsule Endoscopy Cost in Aurangabad,Rs. 60000 – Rs. 130000
Capsule Endoscopy Cost in India,Rs. 50000 to Rs. 180000
Coronary Angioplasty Cost in HyderabadRs. 199000/-
Coronary Angioplasty Cost in RaipurRs. 179000/-
Coronary Angioplasty Cost in BhubaneswarRs. 180000/-
Coronary Angioplasty Cost in VisakhapatnamRs. 178000/-
Coronary Angioplasty Cost in NagpurRs. 160000/-
Coronary Angioplasty Cost in Indore,Rs. 180000/-
Coronary Angioplasty Cost in AurangabadRs. 200000/-
Coronary Angioplasty Cost in IndiaRs. 150000 /- - Rs. 220000/-
Foetal echocardiography cost in Hyderabad,Rs. 1300 - Rs. 5000
Foetal echocardiography cost in Raipur,Rs. 1300 - Rs. 4500
Foetal echocardiography cost in Bhubaneswar,Rs. 1300 - Rs. 5000
Foetal echocardiography cost in Visakhapatnam,Rs. 1300 - Rs. 5500
Foetal echocardiography cost in Nagpur,Rs. 1300 - Rs. 3500
Foetal echocardiography cost in Indore,Rs. 1300 - Rs. 3500
Foetal echocardiography cost in Aurangabad,Rs. 1300 - Rs. 3500
Foetal echocardiography cost in India,Rs. 1300 - Rs. 5500
FESS cost in Hyderabad,Rs. 38000 - Rs. 150000
FESS cost in Raipur,Rs. 38000 - Rs. 70000
FESS cost in Bhubaneswar,Rs. 38000 - Rs. 70000
FESS cost in Visakhapatnam,Rs. 38000 - Rs. 70000
FESS cost in Nagpur,Rs. 38000 - Rs. 90000
FESS cost in Indore,Rs. 38000 - Rs. 65000
FESS cost in Aurangabad,Rs. 38000 - Rs. 90000
FESS cost in India,Rs. 38000 - Rs. 150000
Kidney transplant cost in Hyderabad,Rs. 620000 to Rs.1000000
Kidney transplant cost in Raipur,Rs. 620000 to Rs. 900000
Kidney transplant cost in Bhubaneswar,Rs. 620000 to Rs. 800000
Kidney transplant cost in Visakhapatnam,Rs. 620000 to Rs. 975000
Kidney transplant cost in Nagpur,Rs. 620000 to Rs. 1000000
Kidney transplant cost in Indore,Rs.620000 to Rs. 900000
Kidney transplant cost in Aurangabad,Rs.620000 to Rs. 900000
Kidney transplant cost in India,Rs. 620000 to Rs. 1200000
Laser hair removal cost in Hyderabad,Rs. 2000 to Rs. 45000
Laser hair removal cost in Raipur,Rs. 2000 to Rs. 10000
Laser hair removal cost in Bhubaneswar,Rs. 2000 to Rs. 25000
Laser hair removal cost in Visakhapatnam,Rs. 2000 to Rs. 12000
Laser hair removal cost in Nagpur,Rs. 2000 to Rs. 20000
Laser hair removal cost in Indore,Rs. 2000 to Rs. 25000
Laser hair removal cost in Aurangabad,Rs. 2000 to Rs. 10000
Laser hair removal cost in India,Rs. 2000 to Rs. 50000
Knee replacement cost in Hyderabad,Rs. 150000 to Rs. 550000
Knee replacement cost in Raipur,Rs. 150000 to Rs. 400000
Knee replacement cost in Bhubaneswar,Rs. 150000 to Rs. 400000
Knee replacement cost in Visakhapatnam,Rs. 150000 to Rs. 400000
Knee replacement cost in Nagpur,Rs. 150000 to Rs. 550000
Knee replacement cost in Indore,Rs. 150000 to Rs. 525000
Knee replacement cost in Aurangabad,Rs. 150000 to Rs. 350000
Knee replacement cost in India,Rs. 150000 to Rs. 600000
Liposuction cost in Hyderabad,Rs. 50000 to Rs. 250000
Liposuction cost in Raipur,Rs. 50000 to Rs. 150000
Liposuction cost in Bhubaneswar,Rs. 50000 to Rs. 150000
Liposuction cost in Visakhapatnam,Rs. 50000 to Rs. 250000
Liposuction cost in Nagpur,Rs. 50000 to Rs. 200000
Liposuction cost in Indore,Rs. 50000 to Rs. 200000
Liposuction cost in Aurangabad,Rs. 50000 to Rs. 180000
Liposuction cost in India,Rs. 50000 to Rs. 250000
Myomectomy cost in Hyderabad,Rs. 40000 - Rs. 180000
Myomectomy cost in Raipur,Rs. 40000 -  Rs. 100000
Myomectomy cost in Bhubaneshwar,Rs. 40000 - Rs. 180000
Myomectomy cost in Visakhapatnam,Rs. 40000 - Rs. 180000
Myomectomy cost in Nagpur,Rs. 40000 - Rs. 170000
Myomectomy cost in Indore,Rs. 40000 - Rs. 150000
Myomectomy cost in Aurangabad,Rs. 40000 - Rs. 150000
Myomectomy cost in India,Rs. 40000 - Rs. 200000
Kidney stone removal cost in Hyderabad,Rs. 50000 to Rs. 200000
Kidney stone removal cost in Raipur,Rs. 50000 to Rs. 150000
Kidney stone removal cost in Bhubaneswar,Rs. 50000 to Rs. 180000
Kidney stone removal cost in Visakhapatnam,Rs. 50000 to Rs. 180000
Kidney stone removal cost in Nagpur,Rs. 50000 to Rs. 180000
Kidney stone removal cost in Indore,Rs. 50000 to Rs. 200000
Kidney stone removal cost in Aurangabad,Rs. 50000 to Rs. 140000
Kidney stone removal cost in India,Rs. 50000 to Rs. 250000
Microlaryngeal surgery cost in Hyderabad,Rs. 50000 - Rs. 80000
Microlaryngeal surgery cost in India,Rs. 50000 - Rs. 90000
Kidney stone scan cost in Hyderabad,Rs. 1500 - Rs. 5000
Kidney stone scan cost in Raipur,Rs. 1500 - Rs. 5000
Kidney stone scan cost in Bhubaneswar,Rs. 1500 - Rs. 5000
Kidney stone scan cost in Visakhapatnam,Rs. 1500 - Rs. 5000
Kidney stone scan cost in Nagpur,Rs. 1500 - Rs. 5000
Kidney stone scan cost in Indore,Rs. 1500 - Rs. 5000
Kidney stone scan cost in Aurangabad,Rs. 1500 - Rs. 5000
Kidney stone scan cost in India,Rs. 1500 - Rs. 5000
Mitral valve replacement surgery  cost in Hyderabad,Rs. 200000 and Rs. 450000
Mitral valve replacement surgery  cost in Raipur,Rs. 200000 and Rs. 350000
Mitral valve replacement surgery cost in Bhubaneswar,Rs. 200000 and Rs. 400000
Mitral valve replacement surgery cost in Visakhapatnam,Rs. 200000 and Rs. 400000
Mitral valve replacement surgery cost in Indore,Rs. 200000 and Rs. 350000
Mitral valve replacement surgery cost in Nagpur,Rs. 200000 and Rs. 390000.
Mitral valve replacement surgery cost in Aurangabad,Rs. 200000 and Rs. 340000.
Mitral valve replacement surgery cost in India,Rs. 200000 and Rs. 500000.
Knee arthroscopy cost in Hyderabad,Rs. 70000 - Rs. 250000
Knee arthroscopy cost in Raipur,Rs. 70000 - Rs. 240000
Knee arthroscopy cost in Bhubaneswar,Rs. 70000 - Rs. 200000
Knee arthroscopy cost in Visakhapatnam,Rs. 70000 - Rs. 200000
Knee arthroscopy cost in Nagpur,Rs. 70000 - Rs. 180000
Knee arthroscopy cost in Indore,Rs. 70000 - Rs. 200000
Knee arthroscopy cost in Aurangabad,Rs. 70000 - Rs. 200000
Knee arthroscopy cost in India,Rs. 70000 - Rs. 250000
Kyphoplasty  cost in Hyderabad,Rs. 100000 to Rs. 300000
Kyphoplasty  cost in Raipur,Rs. 100000 to Rs. 200000
Kyphoplasty cost in Bhubaneswar,Rs. 110000 to Rs. 250000
Kyphoplasty cost in Visakhapatnam,Rs. 75000 to Rs. 200000
Kyphoplasty cost in Indore,Rs. 100000 to Rs. 200000
Kyphoplasty cost in Nagpur,Rs. 100000 to Rs. 300000
Kyphoplasty cost in Aurangabad,Rs. 100000 to Rs. 250000
Kyphoplasty cost in India,Rs. 100000 to Rs. 400000
Lip Reduction Surgery Cost in Hyderabad,Rs. 20000 - Rs. 80000
Lip Reduction Surgery Cost in Raipur,Rs. 20000 - Rs. 80000
Lip Reduction Surgery Cost in Bhubaneshwar,Rs. 18000 - Rs. 80000
Lip Reduction Surgery Cost in Visakhapatnam,Rs. 22000 - Rs. 60000
Lip Reduction Surgery Cost in Nagpur,Rs. 20000 - Rs. 50000
Lip Reduction Surgery Cost in Indore,Rs. 20000 - Rs. 80000
Lip Reduction Surgery Cost in Aurangabad,Rs. 30000 - Rs. 50000
Lip Reduction Surgery Cost in India,Rs. 18000 - Rs. 80000
Spine decompression surgery cost in Hyderabad,Rs. 250000 and Rs. 500000
Spine decompression surgery cost in Raipur,Rs. 250000 and Rs. 380000
Spine decompression surgery cost in Bhubaneswar,Rs. 250000 and Rs. 450000
Spine decompression surgery cost in Visakhapatnam,Rs. 200000 and Rs. 450000
Spine decompression surgery cost in Indore,Rs. 250000 and Rs. 400000
Spine decompression surgery cost in Nagpur,Rs. 250000 and Rs. 490000.
Spine decompression surgery cost in Aurangabad,Rs. 250000 and Rs. 400000.
Spine decompression surgery cost in India,Rs. 200000 and Rs. 500000.
Laparoscopy Surgery Cost in Hyderabad,Rs. 30000 to Rs. 190000
Laparoscopy Surgery Cost in Raipur,Rs. 30000 to Rs. 180000
Laparoscopy Surgery Cost in Bhubaneswar,Rs. 30000 to Rs. 190000
Laparoscopy Surgery Cost in Visakhapatnam,Rs. 30000 to Rs. 180000
Laparoscopy Surgery Cost in Nagpur,Rs 30000 to Rs. 150000
Laparoscopy Surgery Cost in Indore,Rs. 30000 to Rs. 190000
Laparoscopy Surgery Cost in Aurangabad,Rs. 30000 to Rs. 190000
Laparoscopy Surgery Cost in India,Rs. 30000 to Rs. 190000
LASIK Eye Surgery Cost in Hyderabad,Rs. 55000/-
LASIK Eye Surgery Cost in Raipur,Rs. 50000/-
LASIK Eye Surgery Cost in Bhubaneswar,Rs. 50000/-
LASIK Eye Surgery Cost in Visakhapatnam,Rs. 43000/-
LASIK Eye Surgery Cost in Nagpur,Rs. 45000/-
LASIK Eye Surgery Cost in Indore,Rs. 50000/-
LASIK Eye Surgery Cost in Aurangabad,Rs. 50000/-
LASIK Eye Surgery Cost in India,Rs. 40000/-  - Rs. 60000/-
Lithotripsy Cost in Hyderabad,Rs. 55000/-
Lithotripsy Cost in Raipur,Rs. 45000/-
Lithotripsy Cost in Bhubaneswar,Rs. 45000/-
Lithotripsy Cost in Visakhapatnam,Rs. 40000/-
Lithotripsy Cost in Nagpur,Rs. 40000/-
Lithotripsy Cost in Indore,Rs. 45000/-
Lithotripsy Cost in Aurangabad,Rs. 45000/-
Lithotripsy Cost in India,Rs. 40000/- - Rs. 55000/-
Neck surgery cost in Hyderabad,Rs. 200000 - Rs. 460000
Neck surgery cost in Raipur,Rs. 200000 - Rs. 400000
Neck surgery cost in Bhubaneswar,Rs. 200000 - Rs. 400000
Neck surgery cost in Visakhapatnam,Rs. 200000 - Rs. 460000
Neck surgery cost in Nagpur,Rs. 200000 - Rs. 460000
Neck surgery cost in Indore,Rs. 200000 - Rs. 400000
Neck surgery cost in Aurangabad,Rs. 200000 - Rs. 400000
Neck surgery cost in India,Rs. 200000 - Rs. 500000
Oral cancer treatment cost in Hyderabad,Rs. 100000 to Rs. 400000.
Oral cancer treatment cost in Raipur,Rs. 100000 to Rs. 350000
Oral cancer treatment cost in Bhubaneswar,Rs. 100000 to Rs. 400000
Oral cancer treatment cost in Visakhapatnam,Rs. 100000 to Rs. 300000
Oral cancer treatment cost in Nagpur,Rs. 100000 to Rs. 350000
Oral cancer treatment cost in Indore,Rs. 100000 to Rs. 300000
Oral cancer treatment cost in Aurangabad,Rs. 100000 to Rs. 300000
Oral cancer treatment cost in India,Rs. 100000 to Rs. 500000
Piles surgery cost in Hyderabad,Rs. 30000 to Rs. 120000
Piles surgery cost in Raipur,Rs. 30000 to Rs. 90000
Piles surgery cost in Bhubaneswar,Rs. 30000 to Rs. 120000
Piles surgery cost in Visakhapatnam,Rs. 30000 to Rs. 120000
Piles surgery cost in Nagpur,Rs. 30000 to Rs. 100000
Piles surgery cost in Indore,Rs. 30000 to Rs. 110000
Piles surgery cost in Aurangabad,Rs. 30000 to Rs. 120000
Piles surgery cost in India,Rs. 30000 to Rs. 150000
Otoplasty cost in Hyderabad,Rs. 40000 - Rs. 180000
Otoplasty cost in Raipur,Rs. 40000 - Rs. 150000
Otoplasty cost in Bhubaneswar,Rs. 40000 - Rs. 160000
Otoplasty cost in Visakhapatnam,Rs. 40000 - Rs. 160000
Otoplasty cost in Nagpur,Rs. 40000 - Rs. 175000
Otoplasty cost in Indore,Rs. 40000 - Rs. 150000
Otoplasty cost in Aurangabad,Rs. 40000 - Rs. 150000
Otoplasty cost in India,Rs. 40000 - Rs. 175000
Pulmonary function test cost In India,Rs. 1200 to Rs. 2500
Pulmonary function test cost in Hyderabad,Rs. 1200 to Rs. 1080
Pulmonary function test cost in Raipur,Rs. 1200 to Rs. 2000
Pulmonary function test cost in Bhubaneswar,Rs. 1200 to Rs. 800
Pulmonary function test cost in Visakhapatnam,Rs. 1200 to Rs. 2500
Pulmonary function test cost in Nagpur,Rs. 1200 to Rs. 900
Pulmonary function test cost in Indore,Rs. 1200 to Rs. 2000
Pulmonary function test cost in Aurangabad,Rs. 1200 to Rs. 2200
Osteotomy Surgery Cost in Hyderabad,Rs. 120000 – Rs. 250000
Osteotomy Surgery Cost in Raipur,Rs. 80000 – Rs. 180000
Osteotomy Surgery Cost in Bhubaneshwar,Rs. 100000 – Rs. 220000
Osteotomy Surgery Cost in Visakhapatnam,Rs. 100000 – Rs. 180000
Osteotomy Surgery Cost in Nagpur,Rs. 100000 – Rs. 180000
Osteotomy Surgery Cost in Indore,Rs. 80000 – Rs. 180000
Osteotomy Surgery Cost in Aurangabad,Rs. 80000 – Rs. 180000
Osteotomy Surgery Cost in India,Rs. 80000 – Rs. 250000
Cost of prostate cancer treatment in Hyderabad,Rs. 100000 – Rs. 500000
Cost of prostate cancer treatment in Raipur,Rs. 100000 – Rs. 400000
Cost of prostate cancer treatment in Bhubaneswar,Rs. 100000 – Rs. 500000
Cost of prostate cancer treatment in Visakhapatnam,Rs. 100000 – Rs. 600000
Cost of prostate cancer treatment in Nagpur,Rs. 100000 – Rs. 500000
Cost of prostate cancer treatment in Indore,Rs. 100000 – Rs. 600000
Cost of prostate cancer treatment in Aurangabad,Rs. 100000 – Rs. 600000
Cost of prostate cancer treatment in India (average),Rs. 100000 - Rs. 700000
Ovarian cyst treatment cost in Hyderabad,Rs. 60000 - Rs. 180000
Ovarian cyst treatment cost in Nagpur,Rs. 45000 - Rs. 180000
Ovarian cyst treatment cost in Indore,Rs. 35000 - Rs. 180000
Ovarian cyst treatment cost in India,Rs. 45000 - Rs. 190000
Pilonidal Sinus Surgery Cost in Hyderabad,Rs. 35000 - Rs. 80000
Pilonidal Sinus Surgery Cost in Raipur,Rs. 30000 - Rs. 80000
Pilonidal Sinus Surgery Cost in Bhubaneshwar,Rs. 35000 - Rs.  90000
Pilonidal Sinus Surgery Cost in Visakhapatnam,Rs. 30000 - Rs. 75000
Pilonidal Sinus Surgery Cost in Nagpur,Rs. 30000 - Rs. 80000
Pilonidal Sinus Surgery Cost in Indore,Rs. 35000 - Rs. 80000
Pilonidal Sinus Surgery Cost in Aurangabad,Rs. 35000 - Rs. 70000
Pilonidal Sinus Surgery Cost in India,Rs. 30000 - Rs. 90000
Rhinoplasty cost in Hyderabad,Rs. 45000 to Rs. 220000
Rhinoplasty cost in Raipur,Rs. 50000 to Rs. 200000
Rhinoplasty cost in Bhubaneswar,Rs. 45000 to Rs. 200000
Rhinoplasty cost in Visakhapatnam,Rs. 45000 to Rs. 180000
Rhinoplasty cost in Nagpur,Rs. 45000 to Rs. 220000
Rhinoplasty cost in Indore,Rs. 45000 to Rs. 200000
Rhinoplasty cost in Aurangabad,Rs. 45000 to Rs. 200000
Rhinoplasty cost in India,Rs. 45000 to Rs. 250000
Cost of sleep study in Hyderabad,Rs. 6000 – Rs. 30000
Cost of sleep study in Raipur,Rs. 6000 – Rs. 25000
Cost of sleep study in Bhubaneswar,Rs. 6000 – Rs. 30000
Cost of sleep study in Visakhapatnam,Rs. 6000 – Rs. 25000
Cost of sleep study in Nagpur,Rs. 6000 – Rs. 25000
Cost of sleep study in Indore,Rs. 6000 – Rs. 25000
Cost of sleep study in Aurangabad,Rs. 6000 – Rs. 25000
Cost of sleep study in India (average),Rs. 6000 – Rs. 35000
Radiation therapy cost in Hyderabad,Rs. 250000 to Rs. 2000000
Radiation therapy cost in Raipur,Rs. 250000 to Rs. 1400000
Radiation therapy cost in Bhubaneswar,Rs. 250000 to Rs. 1500000
Radiation therapy cost in Visakhapatnam,Rs. 250000 to Rs. 1500000
Radiation therapy cost in Nagpur,Rs. 250000 to Rs. 1300000
Radiation therapy cost in Indore,Rs. 250000 to Rs. 1400000
Radiation therapy cost in Aurangabad,Rs. 250000 to Rs. 1200000
Radiation therapy cost in India,Rs. 250000 to Rs. 2300000
Shoulder replacement surgery cost in Hyderabad,Rs. 150000 - Rs. 500000
Shoulder replacement surgery cost in Raipur,Rs. 150000 - Rs. 350000
Shoulder replacement surgery cost in Bhubaneshwar,Rs. 150000 - Rs. 450000
Shoulder replacement surgery cost in Visakhapatnam,Rs. 150000 - Rs. 450000
Shoulder replacement surgery cost in Nagpur,Rs. 150000 - Rs. 400000
Shoulder replacement surgery cost in Indore,Rs. 150000 - Rs. 350000
Shoulder replacement surgery cost in Aurangabad,Rs. 150000 - Rs. 450000
Shoulder replacement surgery cost in India,Rs. 150000 - Rs. 500000
TAVR cost in Hyderabad,Rs. 300000 - Rs. 500000
TAVR cost in Raipur,Rs. 300000 - Rs. 300000
TAVR cost in Bhubaneshwar,Rs. 300000 - Rs. 500000
TAVR cost in Visakhapatnam,Rs. 300000 - Rs. 500000
TAVR cost in Nagpur,Rs. 300000 - Rs. 400000
TAVR cost in Indore,Rs. 300000 - Rs. 400000
TAVR cost in Aurangabad,Rs. 300000 - Rs. 400000
TAVR cost in India,Rs. 300000 - Rs. 500000
Robotic surgery cost in Hyderabad,Rs. 180000 - Rs. 500000
Robotic surgery cost in Raipur,Rs. 180000 - Rs. 500000
Robotic surgery cost in Bhubaneswar,Rs. 180000 - Rs. 400000
Robotic surgery cost in Visakhapatnam,Rs. 180000 - Rs. 500000
Robotic surgery cost in Nagpur,Rs. 180000 - Rs. 500000
Robotic surgery cost in Indore,Rs. 180000 - Rs. 500000
Robotic surgery cost in Aurangabad,Rs. 180000 - Rs. 500000
Robotic surgery cost in India,Rs. 180000 - Rs. 500000
Sebaceous cyst removal cost in Hyderabad,Rs. 15000 - Rs. 100000
Sebaceous cyst removal cost in Bangalore,Rs. 17000 - Rs. 90000
Sebaceous cyst removal cost in Chennai,Rs. 20000 - Rs. 90000
Sebaceous cyst removal cost in Mumbai,Rs. 20000 - Rs. 120000
Sebaceous cyst removal cost in visakhapatnam,Rs. 15000 - Rs. 90000
Sebaceous cyst removal cost in Bhubaneswar,Rs. 20000 - Rs. 120000
Sebaceous cyst removal cost in India,Rs. 15000 - Rs.120000
Sigmoidoscopy Price in Hyderabad,Rs. 1500 - Rs. 8000
Sigmoidoscopy Price in Raipur,Rs. 1500 - Rs. 10000
Sigmoidoscopy Price in Bhubaneshwar,Rs. 2000 - Rs. 10000
Sigmoidoscopy Price in Visakhapatnam,Rs. 2000 - Rs. 10000
Sigmoidoscopy Price in Nagpur,Rs. 1500 - Rs. 8000
Sigmoidoscopy Price in Indore,Rs. 1500 - Rs. 8000
Sigmoidoscopy Price in Aurangabad,Rs. 2000 - Rs. 10000
Sigmoidoscopy Price in India,Rs. 1500 - Rs. 10000
Thyroidectomy in Hyderabad,Rs. 50000 – Rs. 180000
Thyroidectomy in Raipur,Rs. 50000 – Rs. 120000
Thyroidectomy in Bhubaneshwar,Rs. 50000 – Rs. 180000
Thyroidectomy in Visakhapatnam,Rs. 50000 – Rs. 180000
Thyroidectomy in Nagpur,Rs. 50000 – Rs. 150000
Thyroidectomy in Indore,Rs. 50000 – Rs. 150000
Thyroidectomy in Aurangabad,Rs. 50000 – Rs. 150000
Thyroidectomy in India,Rs. 50000 – Rs. 180000
Skin Laser Treatment Price in Hyderabad,Rs.3500 - Rs.30000
Skin Laser Treatment Price in Raipur,Rs.2000 - Rs.30000
Skin Laser Treatment Price in Bhubaneshwar,Rs.3500 - Rs.30000
Skin Laser Treatment Price in Visakhapatnam,Rs.2000 - Rs.30000
Skin Laser Treatment Price in Nagpur,Rs.2000 - Rs.20000
Skin Laser Treatment Price in Indore,Rs.2000 - Rs.20000
Skin Laser Treatment Price in Aurangabad,Rs.2000 - Rs.25000
Skin Laser Treatment Price in India,Rs.2000 - Rs.30000
Tympanoplasty Surgery Cost in Hyderabad,Rs.35000 - Rs.80000
Tympanoplasty Surgery Cost in Raipur,Rs.35000 - Rs.70000
Tympanoplasty Surgery Cost in Bhubaneshwar,Rs.35000 - Rs.80000
Tympanoplasty Surgery Cost in Visakhapatnam,Rs.30000 - Rs.60000
Tympanoplasty Surgery Cost in Nagpur,Rs.30000 - Rs.50000
Tympanoplasty Surgery Cost in Indore,Rs.30000 - Rs.80000
Tympanoplasty Surgery Cost in Aurangabad,Rs.30000 - Rs.50000
Tympanoplasty Surgery Cost in India,Rs.30000 - Rs.80000
Spine Surgery Cost in Hyderabad,Rs. 180000 to Rs. 600000
Spine Surgery Cost in Raipur,Rs. 150000 to Rs. 450000
Spine Surgery Cost in Bhubaneswar,Rs. 180000 to Rs. 500000
Spine Surgery Cost in Visakhapatnam,Rs. 180000 to Rs. 480000
Spine Surgery Cost in Nagpur,Rs. 150000 to Rs. 400000
Spine Surgery Cost in Indore,Rs. 180000 to Rs. 550000
Spine Surgery Cost in Aurangabad,Rs. 180000 to Rs. 500000
Spine Surgery Cost in India,Rs. 150000 to Rs. 600000
Squint Eye Surgery Cost in Hyderabad,Rs. 30000 to Rs. 100000
Squint Eye Surgery Cost in Raipur,Rs. 25000 to Rs. 80000
Squint Eye Surgery Cost in Bhubaneswar,Rs. 30000 to Rs. 100000
Squint Eye Surgery Cost in Visakhapatnam,Rs. 30000 to Rs. 90000
Squint Eye Surgery Cost in Nagpur,Rs. 25000 to Rs. 90000
Squint Eye Surgery Cost in Indore,Rs. 30000 to Rs. 100000
Squint Eye Surgery Cost in Aurangabad,Rs. 30000 to Rs. 100000
Squint Eye Surgery Cost in India,Rs. 25000 to Rs.  100000
Ureteroscopy cost in Hyderabad,Rs. 25000 to Rs. 120000.
Ureteroscopy cost in Raipur,Rs. 25000 to Rs. 100000
Ureteroscopy cost in Bhubaneswar,Rs. 25000 to Rs. 100000
Ureteroscopy cost in Visakhapatnam,Rs. 25000 to Rs. 100000
Ureteroscopy cost in Nagpur,Rs. 25000 to Rs. 95000
Ureteroscopy cost in Indore,Rs. 25000 to Rs. 100000
Ureteroscopy cost in Aurangabad,Rs. 25000 to Rs. 100000
Ureteroscopy cost in India,Rs. 25000 to Rs. 125000
Varicose veins cost in Hyderabad,Rs. 40000 to Rs. 250000
Varicose veins cost in Raipur,Rs. 40000 to Rs. 200000
Varicose veins cost in Bhubaneswar,Rs. 40000 to Rs. 250000
Varicose veins cost in Visakhapatnam,Rs. 40000 to Rs. 250000
Varicose veins cost in Nagpur,Rs. 40000 to Rs. 200000
Varicose veins cost in Indore,Rs. 40000 to Rs. 150000
Varicose veins cost in Aurangabad,Rs. 40000 to Rs. 180000
Varicose veins cost in India,Rs. 40000  to Rs. 250000
Whipple surgery cost in Hyderabad,Rs. 200000 to Rs. 800000
Whipple surgery cost in Raipur,Rs. 200000 to Rs. 500000
Whipple surgery cost in Bhubaneswar,Rs. 200000 to Rs. 700000
Whipple surgery cost in Visakhapatnam,Rs. 200000 to Rs. 700000
Whipple surgery cost in Nagpur,Rs. 200000 to Rs. 550000
Whipple surgery cost in Indore,Rs. 200000 to Rs. 600000
Whipple surgery cost in Aurangabad,Rs. 200000 to Rs. 600000
Whipple surgery cost in India,Rs. 200000 to Rs. 800000
Vaginoplasty cost in Hyderabad,Rs. 50000 to Rs. 120000
Vaginoplasty cost in Raipur,Rs. 50000 to Rs. 80000
Vaginoplasty cost in Bhubaneswar,Rs. 50000 to Rs. 120000
Vaginoplasty cost in Visakhapatnam,Rs. 50000 to Rs. 120000
Vaginoplasty cost in Nagpur,Rs. 50000 to Rs. 90000
Vaginoplasty cost in Indore,Rs. 50000 to Rs. 90000
Vaginoplasty cost in Aurangabad,Rs. 50000 to Rs. 90000
Vaginoplasty cost in India,Rs. 50000 to Rs. 120000
Varicocelectomy cost in Hyderabad,Rs. 35000 - Rs. 80000
Varicocelectomy cost in Raipur,Rs. 35000 - Rs. 80000
Varicocelectomy cost in Bhubaneshwar,Rs. 35000 - Rs. 90000
Varicocelectomy cost in Visakhapatnam,Rs. 35000 - Rs. 90000
Varicocelectomy cost in Nagpur,Rs. 35000 - Rs. 90000
Varicocelectomy cost in Indore,Rs. 35000 – Rs. 90000
Varicocelectomy cost in Aurangabad,Rs. 35000 – Rs. 90000
Varicocelectomy cost in India,Rs. 35000 – Rs. 120000
Vertebroplasty cost in Hyderabad,Rs. 250000 – Rs. 800000
Vertebroplasty cost in Raipur,Rs. 250000 – Rs. 800000
Vertebroplasty cost in Bhubaneshwar,Rs. 250000 – Rs. 800000
Vertebroplasty cost in Visakhapatnam,Rs. 250000 – Rs. 800000
Vertebroplasty cost in Nagpur,Rs. 250000 – Rs. 800000
Vertebroplasty cost in Indore,Rs. 250000 – Rs. 800000
Vertebroplasty cost in Aurangabad,Rs. 250000 – Rs. 800000
Vertebroplasty cost in India,Rs. 250000 – Rs. 800000
Vocal cord surgery cost in Hyderabad,Rs. 60000 - Rs. 150000
Vocal cord surgery cost in Raipur,Rs. 60000 - Rs. 150000
Vocal cord surgery cost in Bhubaneshwar,Rs. 60000 - Rs. 150000
Vocal cord surgery cost in Visakhapatnam,Rs. 60000 - Rs. 150000
Vocal cord surgery cost in Nagpur,Rs. 60000 - Rs. 120000
Vocal cord surgery cost in Indore,Rs. 60000 - Rs. 100000
Vocal cord surgery cost in Aurangabad,Rs. 60000 - Rs. 150000
Vocal cord surgery cost in India,Rs. 60000 - Rs. 150000
Vasectomy reversal cost in Hyderabad,Rs. 25000 – Rs. 100000
Vasectomy reversal cost in Raipur,Rs. 25000 – Rs. 80000
Vasectomy reversal cost in Bhubaneswar,Rs. 25000 – Rs. 100000
Vasectomy reversal cost in Visakhapatnam,Rs. 25000 – Rs. 100000
Vasectomy reversal cost in Nagpur,Rs. 25000 – Rs. 80000
Vasectomy reversal cost in Indore,Rs. 25000 – Rs. 80000
Vasectomy reversal cost in Aurangabad,Rs. 25000 – Rs. 80000
Vasectomy reversal cost in India,Rs. 25000 – Rs. 120000
Gastric bypass Surgery Cost in Hyderabad,Rs. 300000 to Rs. 600000
Gastric bypass Surgery Cost in Raipur,Rs. 250000 to Rs. 400000
Gastric bypass Surgery Cost in Bhubaneswar,Rs. 290000 to Rs. 550000
Gastric bypass Surgery Cost in Visakhapatnam,Rs. 250000 to Rs. 450000
Gastric bypass Surgery Cost in Nagpur,Rs. 250000 to Rs. 400000
Gastric bypass Surgery Cost in Indore,Rs. 280000 to Rs. 550000
Gastric bypass Surgery Cost in Aurangabad,Rs. 280000 to Rs. 550000
Gastric bypass Surgery Cost in India,Rs. 250000 to Rs. 600000
Hair transplantation in Hyderabad,Rs. 30000 - Rs. 40000
Hair transplantation in Raipur,Rs. 30000 - Rs. 40000
Hair transplantation in Bhubaneswar,Rs. 30000 - Rs. 40000
Hair transplantation in Visakhapatnam,Rs. 30000 - Rs. 70000
Hair transplantation in Nagpur,Rs. 30000 - Rs. 70000
Hair transplantation in Indore,Rs. 30000 - Rs. 70000
Hair transplantation in Aurangabad,Rs. 30000 - Rs. 70000
Hair transplantation in India (average),Rs. 30000 - Rs. 100000
IVF cost in Hyderabad,Rs. 100000 to Rs. 230000
IVF cost in Raipur,Rs. 100000 to Rs. 200000
IVF cost in Bhubaneswar,Rs. 100000 to Rs. 220000
IVF cost in Visakhapatnam,Rs. 100000 to Rs. 190000
IVF cost in Nagpur,Rs. 100000 to Rs. 180000
IVF cost in Indore,Rs. 100000 to Rs. 180000
IVF cost in Aurangabad,Rs. 100000 to Rs. 170000
IVF cost in India,Rs. 100000 to Rs. 250000
Glaucoma Surgery Cost in Hyderabad,Rs. 55000/-
Glaucoma Surgery Cost in Raipur,Rs. 50000/-
Glaucoma Surgery Cost in Bhubaneswar,Rs. 50000/-
Glaucoma Surgery Cost in Visakhapatnam,Rs. 45000/-
Glaucoma Surgery Cost in Nagpur,Rs. 48000/-
Glaucoma Surgery Cost in Indore,Rs. 55000/-
Glaucoma Surgery Cost in Aurangabad,Rs. 55000/-
Glaucoma Surgery Cost in India,Rs. 45000/- - Rs.60000/-
Hysteroscopy cost in Hyderabad,Rs. 15000/- to Rs. 55000/-
Hysteroscopy cost in Raipur,Rs. 15000/- to Rs. 40000/-
Hysteroscopy cost in Bhubaneswar,Rs. 15000/- to Rs. 50000/-
Hysteroscopy cost in Visakhapatnam,Rs. 15000/- to Rs. 50000/-
Hysteroscopy cost in Nagpur,Rs. 15000/- to Rs. 50000/-
Hysteroscopy cost in Indore,Rs. 15000/- to Rs. 50000/-
Hysteroscopy cost in Aurangabad,Rs. 15000/- to Rs. 45000/-
Hysteroscopy cost in India,Rs. 15000/- to Rs. 60000/-
Insulin injection cost in HyderabadRs. 120 - Rs. 150
Insulin injection cost in RaipurRs. 120 - Rs. 150
Insulin injection cost in BhubaneswarRs. 120 - Rs. 150
Insulin injection cost in VisakhapatnamRs. 120 - Rs. 150
Insulin injection cost in NagpurRs. 120 - Rs. 150
Insulin injection cost in IndoreRs. 120 - Rs. 150
Insulin injection cost in AurangabadRs. 120 - Rs. 150
Insulin injection cost in IndiaRs. 120 - Rs. 150
Hip arthroscopy in Hyderabad,Rs. 80000 to Rs. 200000
Hip arthroscopy in Raipur,Rs. 80000 to Rs. 200000
Hip arthroscopy in Bhubaneswar,Rs. 80000 to Rs. 200000
Hip arthroscopy in Visakhapatnam,Rs. 80000 to Rs. 200.000
Hip arthroscopy in Nagpur,Rs. 80000 to Rs. 200000
Hip arthroscopy in Indore,Rs. 80000 to Rs. 200000
Hip arthroscopy in Aurangabad,Rs. 80000 to Rs. 200000
Hip arthroscopy in India,Rs. 80000 to Rs. 200000
IUI treatment cost in Hyderabad,Rs. 10000 to Rs. 35000
IUI treatment cost in Raipur,Rs. 10000 to Rs. 30000
IUI treatment  cost in Bhubaneswar,Rs. 15000 to Rs. 35000
IUI treatment  cost in Visakhapatnam,Rs. 10000 to Rs. 25000
IUI treatment  cost in Indore,Rs. 10000 to Rs. 30000
IUI treatment  cost in Nagpur,Rs. 12000 to Rs. 30000
IUI treatment  cost in Aurangabad,Rs. 10000 to Rs. 35000
IUI treatment  cost in India,Rs. 10000 to Rs. 50000
Laparoscopic hernia surgery cost in Hyderabad,Rs. 27000 to Rs. 150000
Laparoscopic hernia surgery cost in India,Rs. 50000 to Rs. 265000
Hydrocele surgery cost in Hyderabad,Rs. 25000 - Rs. 90000
Hydrocele surgery cost in Bhubaneswar,Rs. 25000 - Rs. 80000
Hydrocele surgery cost in India,Rs. 25000 - Rs. 100000
Hypospadias Surgery Cost in Hyderabad,Rs. 50000 – Rs. 100000
Hypospadias Surgery Cost in Raipur,Rs. 40000 - Rs. 75000
Hypospadias Surgery Cost in Bhubaneshwar,Rs. 50000 – Rs. 100000
Hypospadias Surgery Cost in Visakhapatnam,Rs. 20000 - Rs. 90000
Hypospadias Surgery Cost in Nagpur,Rs. 50000 - Rs. 80000
Hypospadias Surgery Cost in Indore,Rs. 34000 - Rs. 80000
Hypospadias Surgery Cost in Aurangabad,Rs. 35000 - Rs. 80000
Hypospadias Surgery Cost in India,Rs. 35000 – Rs. 100000
Hysterolaparoscopy Cost in Hyderabad,Rs. 58500/-
Hysterolaparoscopy Cost in Raipur,Rs. 48000/-
Hysterolaparoscopy Cost in Bhubaneswar,Rs. 60000/-
Hysterolaparoscopy Cost in Visakhapatnam,Rs. 54000/-
Hysterolaparoscopy Cost in Nagpur,Rs. 55000/-`;

  useEffect(() => {
    const parseCSV = (csv) => {
      const rows = csv.trim().split('\n');
      return rows.map((row) => row.split(','));
    };
    const data = parseCSV(csvData);
    setTableData(data);
  }, []);

  const headers = tableData.length > 0 ? tableData[0] : [];

  const filteredData =
  tableData.length > 1
    ? tableData.slice(1).filter((row) => {
        const searchKeywords = searchText.toLowerCase().split(" ");

        
        return searchKeywords.every((keyword) =>
          row.some((cell) => cell.toLowerCase().includes(keyword))
        );
      })
    : [];

  const paginatedRows = () => {
    const startIndex = (currentPage - 1) * itemsPerPage;
    const endIndex = startIndex + itemsPerPage;
    return filteredData.slice(startIndex, endIndex);
  };

  const totalPages = Math.ceil(filteredData.length / itemsPerPage);

  const goToPreviousPage = () => {
    setCurrentPage((prevPage) => Math.max(1, prevPage - 1));
  };

  const goToNextPage = () => {
    setCurrentPage((prevPage) => Math.min(totalPages, prevPage + 1));
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <Appbar.Header style={styles.appbar}>
      <Appbar.BackAction color="white" onPress={() => router.push('(tabs)')} />
        <Text style={styles.headerTitle}>Dhancha</Text>
      </Appbar.Header>
      
      <ScrollView contentContainerStyle={styles.scrollContent}>
        <Surface style={styles.patientCard}>
          <Text style={styles.cardTitle}>Patient Details</Text>
          <Divider style={styles.divider} />
          
          <View style={styles.gridContainer}>
            <View style={styles.column}>
              <InfoRow 
                icon="account" 
                label="Patient Name" 
                value="Mr. Lakksh Sharma" 
              />
              <InfoRow 
                icon="calendar-account" 
                label="Age/Gender" 
                value="19Y 0M 2D /F" 
              />
              <InfoRow 
                icon="identifier" 
                label="Aabha. No." 
                value="ML0193" 
              />
              <InfoRow 
                icon="medical-bag" 
                label="Diagnosis" 
                value="Fever" 
              />
            </View>
            
            <View style={styles.column}>
              <InfoRow 
                icon="hospital-building" 
                label="Centre" 
                value="Fortis Hospital, Gurgaon" 
              />
              <InfoRow 
                icon="clock-outline" 
                label="Updated" 
                value="06/Feb/2025 05:08PM" 
              />
              <InfoRow 
                icon="doctor" 
                label="Doctor" 
                value="Dr. Hinge" 
              />
              <InfoRow 
                icon="medical-cotton-swab" 
                label="Treatment" 
                value="Treatment Plan A" 
              />
            </View>
          </View>
        </Surface>

        <Surface style={styles.tableContainer}>
        <Text style={styles.tableTitle}>Treatment Cost Estimates</Text>
        
        <AnimatedSearchBar
          value={searchText}
          onChangeText={setSearchText}
        />

        <CustomTable
          headers={headers}
          rows={paginatedRows()}
        />

        <PaginationControls
          currentPage={currentPage}
          totalPages={totalPages}
          onPrevious={goToPreviousPage}
          onNext={goToNextPage}
        />

        <Text style={styles.disclaimer}>
          * Prices shown are estimates and may vary based on individual cases
        </Text>
      </Surface>
      </ScrollView> 
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  },
  appbar: {
    backgroundColor: '#381e3c',
    borderRadius:10,
    elevation: 4,
    color:'#FFFFFF'
  },
  headerTitle: {
    fontSize: 20,
    fontWeight: '600',
    color: '#FFFFFF',
  },
  scrollContent: {
    padding: 16,
  },
  patientCard: {
    borderRadius: 12,
    elevation: 4,
    marginBottom: 16,
    overflow: 'hidden',
  },
  cardTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#333',
    padding: 16,
  },
  divider: {
    height: 1,
    backgroundColor: '#e0e0e0',
  },
  gridContainer: {
    flexDirection: 'row',
    padding: 16,
  },
  column: {
    flex: 1,
  },
  infoRow: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 8,
  },
  icon: {
    marginRight: 8,
  },
  label: {
    flex: 1,
    fontSize: 14,
    color: '#666',
    fontWeight: '500',
  },
  value: {
    flex: 2,
    fontSize: 14,
    color: '#333',
  },
  tableCard: {
    borderRadius: 12,
    elevation: 4,
    padding: 16,
  },
  tableTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 16,
  },
  searchContainer: {
    marginBottom: 24,
    position: 'relative',
  },
  searchBar: {
    elevation: 0,
    backgroundColor: '#f8fafc',
    borderRadius: 12,
    height: 56,
  },
  searchBarFocused: {
    backgroundColor: '#fff',
    borderWidth: 1,
    borderColor: '#e2e8f0',
  },
  searchInput: {
    fontSize: 16,
    color: '#1e293b',
  },
  searchUnderline: {
    position: 'absolute',
    bottom: -2,
    left: 0,
    height: 2,
    backgroundColor: '#6366f1',
  },
  tableWrapper: {
    borderRadius: 12,
    overflow: 'hidden',
    borderWidth: 1,
    borderColor: '#e2e8f0',
    marginBottom: 24,
  },
  tableHeader: {
    flexDirection: 'row',
    backgroundColor: '#f8fafc',
    borderBottomWidth: 2,
    borderBottomColor: '#e2e8f0',
  },
  headerCell: {
    flex: 1,
    padding: 16,
    justifyContent: 'center',
    alignItems: 'center',
  },
  headerText: {
    color: '#475569',
    fontSize: 14,
    fontWeight: '600',
    textTransform: 'uppercase',
    letterSpacing: 0.5,
  },
  tableBody: {
    backgroundColor: '#fff',
  },
  tableRow: {
    flexDirection: 'row',
    borderBottomWidth: 1,
    borderBottomColor: '#e2e8f0',
  },
  evenRow: {
    backgroundColor: '#fff',
  },
  oddRow: {
    backgroundColor: '#f8fafc',
  },
  tableCell: {
    flex: 1,
    padding: 16,
    justifyContent: 'center',
    alignItems: 'center',
  },
  cellText: {
    color: '#334155',
    fontSize: 14,
  },
  paginationContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 16,
    marginTop: 16,
  },
  paginationButton: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 12,
    borderRadius: 8,
    backgroundColor: '#f1f5f9',
  },
  paginationText: {
    color: '#6366f1',
    fontSize: 14,
    fontWeight: '500',
    marginHorizontal: 4,
  },
  pageIndicator: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  pageNumber: {
    fontSize: 16,
    fontWeight: '600',
    color: '#1e293b',
  },
  pageTotal: {
    fontSize: 14,
    color: '#64748b',
    marginLeft: 4,
  },
  disabledButton: {
    opacity: 0.5,
  },
  tableContainer: {
    margin: 16,
    padding: 24,
    borderRadius: 16,
    backgroundColor: '#fff',
  },
  tableTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#1e293b',
    marginBottom: 24,
  },
  disclaimer: {
    fontSize: 12,
    color: '#64748b',
    textAlign: 'center',
    marginTop: 16,
    fontStyle: 'italic',
  },
});

export default App;


