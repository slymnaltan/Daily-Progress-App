import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  TextInput,
  Pressable,
  FlatList,
  StyleSheet,
  ActivityIndicator,
  Alert,
} from "react-native";
import { useDispatch, useSelector } from "react-redux";
import { fetchTasks, completeTask } from "../redux/slice/taskSlices";
import { fetchDailyEntry, updateDailyEntry, clearEntryError } from "../redux/slice/entrySlice";
import moment from "moment";

const HomeScreen = () => {
  const dispatch = useDispatch();
  const today = moment().format("YYYY-MM-DD");
  
  // Redux state
  const { tasks } = useSelector(state => state.tasks);
  const { data: entry, status: entryStatus, error: entryError } = useSelector(state => state.entry);
  const isAuthenticated = useSelector(state => !!state.auth.token);
  
  const [note, setNote] = useState("");
  const [hoursWorked, setHoursWorked] = useState("");
  const loading = entryStatus === "loading";

  // Fetch data on mount if authenticated
  useEffect(() => {
    if (isAuthenticated) {
      dispatch(fetchTasks());
      dispatch(fetchDailyEntry(today));
    }
  }, [dispatch, isAuthenticated]);

  // Update inputs when entry data changes
  useEffect(() => {
    if (entry) {
      setNote(entry.note || "");
      setHoursWorked(entry.hoursWorked?.toString() || "");
    }
  }, [entry]);

  // Handle errors
  useEffect(() => {
    if (entryError) {
      Alert.alert("Hata", entryError);
      dispatch(clearEntryError());
    }
  }, [entryError, dispatch]);

  // Save entry and clear inputs on success
  const handleSaveEntry = () => {
    if (hoursWorked && isNaN(Number(hoursWorked))) {
      Alert.alert("Hata", "Lütfen çalışılan saat için geçerli bir sayı girin");
      return;
    }
    
    dispatch(updateDailyEntry({ 
      date: today, 
      note, 
      hoursWorked: hoursWorked ? Number(hoursWorked) : 0 
    }))
      .unwrap()
      .then(() => {
        // Clear inputs on successful save
        setNote("");
        setHoursWorked("");
        Alert.alert("Başarılı", "Günlük giriş kaydedildi");
      });
  };

  const renderTask = ({ item }) => (
    <View style={styles.taskItem}>
      <Text style={item.isCompleted ? styles.completedTask : styles.taskText}>
        {item.title}
      </Text>
      {!item.isCompleted && (
        <Pressable onPress={() => dispatch(completeTask(item._id))}>
          <Text style={styles.completeButton}>✅</Text>
        </Pressable>
      )}
    </View>
  );

  if (!isAuthenticated) return (
    <View style={[styles.container, styles.centered]}>
      <Text style={styles.heading}>Lütfen giriş yapın</Text>
    </View>
  );

  if (loading) return (
    <View style={[styles.container, styles.centered]}>
      <ActivityIndicator size="large" color="#16a34a" />
    </View>
  );

  return (
    <View style={styles.container}>
      <Text style={styles.heading}>📅 Bugünkü Görevler</Text>
      {tasks?.length ? (
        <FlatList
          data={tasks}
          renderItem={renderTask}
          keyExtractor={item => item._id}
        />
      ) : (
        <Text style={styles.emptyText}>Bugün için görev bulunmamaktadır.</Text>
      )}

      <View style={styles.separator} />

      <Text style={styles.heading}>📝 Günlük Giriş</Text>
      <TextInput
        value={note}
        onChangeText={setNote}
        multiline
        placeholder="Bugün neler yaptın?"
        style={styles.textarea}
      />
      <TextInput
        value={hoursWorked}
        onChangeText={setHoursWorked}
        placeholder="Çalışılan saat (örneğin: 5)"
        keyboardType="numeric"
        style={styles.input}
      />
      <Pressable 
        style={[styles.saveButton, loading && styles.disabledButton]} 
        onPress={handleSaveEntry}
        disabled={loading}
      >
        <Text style={styles.saveButtonText}>
          {loading ? "Kaydediliyor..." : "Kaydet"}
        </Text>
      </Pressable>
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, padding: 16 },
  centered: { justifyContent: 'center', alignItems: 'center' },
  heading: { fontSize: 22, fontWeight: "bold", marginBottom: 12 },
  taskItem: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingVertical: 8,
    borderBottomWidth: 1,
    borderColor: "#ccc",
  },
  taskText: { fontSize: 16 },
  completedTask: {
    fontSize: 16,
    textDecorationLine: "line-through",
    color: "#888",
  },
  completeButton: { color: "green", fontSize: 18 },
  separator: { height: 24 },
  textarea: {
    borderWidth: 1,
    borderColor: "#ccc",
    padding: 8,
    marginBottom: 12,
    height: 100,
    textAlignVertical: "top",
  },
  input: {
    borderWidth: 1,
    borderColor: "#ccc",
    padding: 8,
    marginBottom: 12,
  },
  saveButton: {
    backgroundColor: "#16a34a",
    paddingVertical: 12,
    alignItems: "center",
    borderRadius: 8,
  },
  disabledButton: { backgroundColor: "#90be90" },
  saveButtonText: {
    color: "white",
    fontWeight: "bold",
    fontSize: 16,
  },
  emptyText: {
    fontSize: 16,
    fontStyle: 'italic',
    color: '#666',
    textAlign: 'center',
    marginVertical: 20,
  }
});

export default HomeScreen;