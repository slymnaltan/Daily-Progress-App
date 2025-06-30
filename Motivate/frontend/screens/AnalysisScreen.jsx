import React, { useEffect, useState } from 'react';
import { View, Text, ScrollView, Dimensions, StyleSheet, ActivityIndicator } from 'react-native';
import { BarChart, LineChart } from 'react-native-chart-kit';
import axios from 'axios';
import { useSelector } from 'react-redux';

const screenWidth = Dimensions.get("window").width;

const AnalyticsScreen = () => {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  
  // Get token from Redux store
  const token = useSelector(state => state.auth.token);

  useEffect(() => {
    const fetchAnalytics = async () => {
      setLoading(true);
      try {
        // Make sure the URL includes the correct port if needed
        const res = await axios.get('http://192.168.1.104:5000/api/analytics/weekly', {
          headers: {
            'Authorization': `Bearer ${token}`
          }
        });
        console.log("API Response:", res.data); // Debug response
        setData(res.data);
        setError(null);
      } catch (error) {
        console.error("Veri alınamadı", error.response?.data || error.message);
        setError("Veriler yüklenemedi. Lütfen daha sonra tekrar deneyin.");
      } finally {
        setLoading(false);
      }
    };
    
    if (token) {
      fetchAnalytics();
    } else {
      setError("Oturum bilgisi bulunamadı. Lütfen tekrar giriş yapın.");
      setLoading(false);
    }
  }, [token]);

  if (loading) {
    return (
      <View style={styles.centerContainer}>
        <ActivityIndicator size="large" color="#0000ff" />
        <Text style={styles.message}>Yükleniyor...</Text>
      </View>
    );
  }
  
  if (error) {
    return (
      <View style={styles.centerContainer}>
        <Text style={styles.errorMessage}>{error}</Text>
      </View>
    );
  }
  
  if (!data) {
    return (
      <View style={styles.centerContainer}>
        <Text style={styles.message}>Veri bulunamadı.</Text>
      </View>
    );
  }

  // Format labels to show shorter date format (DD/MM)
  const labels = data.dailyStats.map(stat => {
    const [year, month, day] = stat.date.split('-');
    return `${day}/${month}`;
  });
  
  // Ensure we have numeric data
  const hoursData = data.dailyStats.map(stat => Number(stat.hoursWorked) || 0);
  const completedTasksData = data.dailyStats.map(stat => Number(stat.completedTasks) || 0);

  // Ensure all data arrays have valid numbers (replace any NaN with 0)
  const safeHoursData = hoursData.map(val => isNaN(val) ? 0 : val);
  const safeCompletedTasksData = completedTasksData.map(val => isNaN(val) ? 0 : val);

  // Ensure we have valid data for the task summary
  const completedTasks = Number(data.completedTasks) || 0;
  const totalTasks = Number(data.totalTasks) || 0;
  const remainingTasks = Math.max(0, totalTasks - completedTasks);

  // Only render task summary if we have valid task data
  const shouldRenderTaskSummary = totalTasks > 0;

  // Chart configuration
  const chartConfig = {
    backgroundGradientFrom: "#fff",
    backgroundGradientTo: "#fff",
    decimalPlaces: 1,
    color: (opacity = 1) => `rgba(0, 122, 255, ${opacity})`,
    labelColor: (opacity = 1) => `rgba(0, 0, 0, ${opacity})`,
    style: {
      borderRadius: 16
    },
    propsForDots: {
      r: "6",
      strokeWidth: "2",
      stroke: "#ffa726"
    }
  };

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.contentContainer}>
      <Text style={styles.title}>Haftalık Analiz</Text>
      
      <View style={styles.summaryContainer}>
        <Text style={styles.dateRange}>
          {data.week.start} - {data.week.end}
        </Text>
        <View style={styles.summaryRow}>
          <View style={styles.summaryItem}>
            <Text style={styles.summaryValue}>{Number(data.totalHours).toFixed(1)}</Text>
            <Text style={styles.summaryLabel}>Toplam Saat</Text>
          </View>
          <View style={styles.summaryItem}>
            <Text style={styles.summaryValue}>{data.dailyAverage}</Text>
            <Text style={styles.summaryLabel}>Günlük Ort.</Text>
          </View>
        </View>
      </View>
      
      <View style={styles.chartContainer}>
        <Text style={styles.subtitle}>📊 Günlük Çalışma Saatleri</Text>
        {safeHoursData.some(val => val > 0) ? (
          <BarChart
            data={{
              labels,
              datasets: [{ data: safeHoursData }]
            }}
            width={screenWidth - 40}
            height={220}
            yAxisSuffix="s"
            chartConfig={chartConfig}
            style={styles.chart}
            fromZero
          />
        ) : (
          <Text style={styles.noDataText}>Bu hafta için saat kaydı bulunamadı.</Text>
        )}
      </View>
      
      <View style={styles.chartContainer}>
        <Text style={styles.subtitle}>📈 Günlük Tamamlanan Görevler</Text>
        {safeCompletedTasksData.some(val => val > 0) ? (
          <LineChart
            data={{
              labels,
              datasets: [{ data: safeCompletedTasksData }]
            }}
            width={screenWidth - 40}
            height={220}
            chartConfig={chartConfig}
            style={styles.chart}
            fromZero
          />
        ) : (
          <Text style={styles.noDataText}>Bu hafta için tamamlanan görev bulunamadı.</Text>
        )}
      </View>
      
      {shouldRenderTaskSummary ? (
        <View style={styles.chartContainer}>
          <Text style={styles.subtitle}>🧮 Görev Dağılımı</Text>
          
          <View style={styles.taskSummaryContainer}>
            <View style={styles.taskSummaryItem}>
              <View style={[styles.colorIndicator, { backgroundColor: "#4CAF50" }]} />
              <Text style={styles.taskLabel}>Tamamlanan:</Text>
              <Text style={styles.taskCount}>{completedTasks}</Text>
            </View>
            <View style={styles.taskSummaryItem}>
              <View style={[styles.colorIndicator, { backgroundColor: "#F44336" }]} />
              <Text style={styles.taskLabel}>Eksik:</Text>
              <Text style={styles.taskCount}>{remainingTasks}</Text>
            </View>
            <View style={styles.taskSummaryItem}>
              <View style={[styles.colorIndicator, { backgroundColor: "#2196F3" }]} />
              <Text style={styles.taskLabel}>Toplam:</Text>
              <Text style={styles.taskCount}>{totalTasks}</Text>
            </View>
          </View>
          
          <View style={styles.completionRateContainer}>
            <Text style={styles.completionRateLabel}>Tamamlama Oranı</Text>
            <View style={styles.progressBarContainer}>
              <View 
                style={[
                  styles.progressBar, 
                  { width: `${totalTasks ? (completedTasks / totalTasks) * 100 : 0}%` }
                ]} 
              />
            </View>
            <Text style={styles.completionRateText}>
              {totalTasks ? Math.round((completedTasks / totalTasks) * 100) : 0}%
            </Text>
          </View>
        </View>
      ) : (
        <View style={styles.chartContainer}>
          <Text style={styles.subtitle}>🧮 Görev Dağılımı</Text>
          <Text style={styles.noDataText}>Henüz görev verisi bulunmamaktadır.</Text>
        </View>
      )}
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#f9f9f9"
  },
  contentContainer: {
    padding: 10,
    paddingBottom: 20,
  },
  centerContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 15,
    textAlign: 'center',
  },
  subtitle: {
    marginTop: 10,
    marginBottom: 15,
    fontSize: 18,
    fontWeight: '600',
  },
  summaryContainer: {
    backgroundColor: '#fff',
    borderRadius: 16,
    padding: 15,
    marginVertical: 10,
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 3.84,
    elevation: 5,
  },
  dateRange: {
    fontSize: 16,
    textAlign: 'center',
    marginBottom: 10,
    color: '#666',
  },
  summaryRow: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    marginVertical: 5,
  },
  summaryItem: {
    alignItems: 'center',
  },
  summaryValue: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#0077CC',
  },
  summaryLabel: {
    fontSize: 14,
    color: '#666',
    marginTop: 5,
  },
  chartContainer: {
    marginVertical: 15,
    padding: 15,
    backgroundColor: '#fff',
    borderRadius: 16,
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 3.84,
    elevation: 5,
  },
  chart: {
    marginVertical: 8,
    borderRadius: 16,
  },
  message: {
    fontSize: 18,
    textAlign: 'center',
    marginTop: 10,
  },
  errorMessage: {
    fontSize: 18,
    textAlign: 'center',
    color: 'red',
  },
  taskSummaryContainer: {
    marginTop: 10,
    marginBottom: 20,
  },
  taskSummaryItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginVertical: 8,
  },
  colorIndicator: {
    width: 16,
    height: 16,
    borderRadius: 8,
    marginRight: 10,
  },
  taskLabel: {
    fontSize: 16,
    flex: 1,
  },
  taskCount: {
    fontSize: 16,
    fontWeight: 'bold',
    marginLeft: 10,
  },
  completionRateContainer: {
    marginTop: 15,
  },
  completionRateLabel: {
    fontSize: 16,
    marginBottom: 8,
    fontWeight: '600',
  },
  progressBarContainer: {
    height: 16,
    backgroundColor: '#E0E0E0',
    borderRadius: 8,
    overflow: 'hidden',
    marginBottom: 8,
  },
  progressBar: {
    height: '100%',
    backgroundColor: '#4CAF50',
  },
  completionRateText: {
    fontSize: 16,
    fontWeight: 'bold',
    textAlign: 'right',
  },
  noDataText: {
    fontSize: 16,
    textAlign: 'center',
    marginVertical: 20,
    color: '#757575',
  },
});

export default AnalyticsScreen;