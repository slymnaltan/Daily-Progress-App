import React, { useEffect, useState } from "react";
import { View, Text, TextInput, Button, FlatList, TouchableOpacity, StyleSheet } from "react-native";
import { useDispatch, useSelector } from "react-redux";
import { fetchTasks, addTask, completeTask, deleteTask } from "../redux/slice/taskSlices";

const TaskScreen = () => {
  const [newTask, setNewTask] = useState("");
  const dispatch = useDispatch();
  const { tasks, loading } = useSelector((state) => state.tasks);

  useEffect(() => {
    dispatch(fetchTasks());
  }, []);

  const handleAddTask = () => {
    if (newTask.trim()) {
      dispatch(addTask(newTask));
      setNewTask("");
    }
  };

  const renderItem = ({ item }) => (
    <View style={styles.taskItem}>
      <Text style={[styles.taskText, item.isCompleted && styles.completed]}>
        {item.title}
      </Text>
      <View style={styles.buttons}>
        {!item.isCompleted && (
          <Button title="✓" onPress={() => dispatch(completeTask(item._id))} />
        )}
        <Button title="🗑" onPress={() => dispatch(deleteTask(item._id))} />
      </View>
    </View>
  );

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Görevler</Text>
      <View style={styles.inputContainer}>
        <TextInput
          value={newTask}
          onChangeText={setNewTask}
          placeholder="Yeni görev ekle"
          style={styles.input}
        />
        <Button title="Ekle" onPress={handleAddTask} />
      </View>
      {loading ? (
        <Text>Yükleniyor...</Text>
      ) : (
        <FlatList
          data={tasks}
          keyExtractor={(item) => item._id}
          renderItem={renderItem}
        />
      )}
    </View>
  );
};

export default TaskScreen;

const styles = StyleSheet.create({
  container: { flex: 1, padding: 20 },
  title: { fontSize: 24, fontWeight: "bold", marginBottom: 10 },
  inputContainer: { flexDirection: "row", alignItems: "center", marginBottom: 15 },
  input: { flex: 1, borderWidth: 1, padding: 10, borderRadius: 8, marginRight: 10 },
  taskItem: { flexDirection: "row", justifyContent: "space-between", marginBottom: 10 },
  taskText: { fontSize: 18 },
  completed: { textDecorationLine: "line-through", color: "gray" },
  buttons: { flexDirection: "row", gap: 10 },
});
