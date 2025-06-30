import { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  Dimensions,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { router } from 'expo-router';
import { ArrowLeft, TrendingUp, Calendar, ChartBar as BarChart3, ChartPie as PieChart } from 'lucide-react-native';
import { Colors, Typography, Spacing, BorderRadius, Shadow } from '@/constants/theme';

const { width } = Dimensions.get('window');

// Mock data for demonstration
const moodData = [
  { date: '2024-01-01', mood: 'happy', intensity: 8, factors: ['exercise', 'friends'] },
  { date: '2024-01-02', mood: 'anxious', intensity: 6, factors: ['work', 'sleep'] },
  { date: '2024-01-03', mood: 'content', intensity: 7, factors: ['family', 'rest'] },
  { date: '2024-01-04', mood: 'happy', intensity: 9, factors: ['achievement', 'exercise'] },
  { date: '2024-01-05', mood: 'sad', intensity: 4, factors: ['stress', 'weather'] },
  { date: '2024-01-06', mood: 'content', intensity: 7, factors: ['meditation', 'music'] },
  { date: '2024-01-07', mood: 'happy', intensity: 8, factors: ['social', 'nature'] },
];

const moodColors = {
  happy: Colors.green,
  content: Colors.pastelBlue,
  anxious: Colors.yellow,
  sad: Colors.pink,
  angry: Colors.orange,
};

const moodEmojis = {
  happy: '😊',
  content: '😌',
  anxious: '😰',
  sad: '😢',
  angry: '😠',
};

export default function MoodTrendsScreen() {
  const [selectedPeriod, setSelectedPeriod] = useState('week');
  const [selectedView, setSelectedView] = useState('chart');

  const periods = [
    { id: 'week', label: 'Week' },
    { id: 'month', label: 'Month' },
    { id: 'year', label: 'Year' },
  ];

  const views = [
    { id: 'chart', label: 'Chart', icon: BarChart3 },
    { id: 'calendar', label: 'Calendar', icon: Calendar },
    { id: 'insights', label: 'Insights', icon: PieChart },
  ];

  const getMoodStats = () => {
    const moodCounts = moodData.reduce((acc, entry) => {
      acc[entry.mood] = (acc[entry.mood] || 0) + 1;
      return acc;
    }, {} as Record<string, number>);

    const totalEntries = moodData.length;
    const averageIntensity = moodData.reduce((sum, entry) => sum + entry.intensity, 0) / totalEntries;

    return { moodCounts, totalEntries, averageIntensity };
  };

  const { moodCounts, totalEntries, averageIntensity } = getMoodStats();

  const renderChart = () => (
    <View style={styles.chartContainer}>
      <Text style={styles.chartTitle}>Mood Intensity Over Time</Text>
      <View style={styles.chart}>
        {moodData.map((entry, index) => {
          const height = (entry.intensity / 10) * 120;
          const color = moodColors[entry.mood as keyof typeof moodColors];
          
          return (
            <View key={index} style={styles.chartBar}>
              <View
                style={[
                  styles.bar,
                  {
                    height,
                    backgroundColor: color,
                  }
                ]}
              />
              <Text style={styles.barLabel}>
                {new Date(entry.date).getDate()}
              </Text>
            </View>
          );
        })}
      </View>
      <View style={styles.chartLegend}>
        <Text style={styles.legendText}>Intensity (1-10)</Text>
      </View>
    </View>
  );

  const renderCalendar = () => (
    <View style={styles.calendarContainer}>
      <Text style={styles.chartTitle}>Mood Calendar</Text>
      <View style={styles.calendarGrid}>
        {moodData.map((entry, index) => {
          const color = moodColors[entry.mood as keyof typeof moodColors];
          const emoji = moodEmojis[entry.mood as keyof typeof moodEmojis];
          
          return (
            <TouchableOpacity
              key={index}
              style={[
                styles.calendarDay,
                { backgroundColor: color + '20', borderColor: color }
              ]}
            >
              <Text style={styles.calendarDate}>
                {new Date(entry.date).getDate()}
              </Text>
              <Text style={styles.calendarEmoji}>{emoji}</Text>
              <Text style={styles.calendarIntensity}>{entry.intensity}</Text>
            </TouchableOpacity>
          );
        })}
      </View>
    </View>
  );

  const renderInsights = () => (
    <View style={styles.insightsContainer}>
      <Text style={styles.chartTitle}>Mood Insights</Text>
      
      {/* Mood Distribution */}
      <View style={styles.insightCard}>
        <Text style={styles.insightTitle}>Mood Distribution</Text>
        {Object.entries(moodCounts).map(([mood, count]) => {
          const percentage = ((count / totalEntries) * 100).toFixed(1);
          const color = moodColors[mood as keyof typeof moodColors];
          const emoji = moodEmojis[mood as keyof typeof moodEmojis];
          
          return (
            <View key={mood} style={styles.moodDistributionItem}>
              <View style={styles.moodInfo}>
                <Text style={styles.moodEmoji}>{emoji}</Text>
                <Text style={styles.moodName}>{mood}</Text>
              </View>
              <View style={styles.moodStats}>
                <View style={styles.progressBar}>
                  <View
                    style={[
                      styles.progressFill,
                      { width: `${percentage}%`, backgroundColor: color }
                    ]}
                  />
                </View>
                <Text style={styles.percentageText}>{percentage}%</Text>
              </View>
            </View>
          );
        })}
      </View>

      {/* Average Intensity */}
      <View style={styles.insightCard}>
        <Text style={styles.insightTitle}>Average Intensity</Text>
        <View style={styles.intensityDisplay}>
          <Text style={styles.intensityNumber}>{averageIntensity.toFixed(1)}</Text>
          <Text style={styles.intensityLabel}>out of 10</Text>
        </View>
        <Text style={styles.intensityDescription}>
          Your overall mood intensity has been {averageIntensity >= 7 ? 'positive' : averageIntensity >= 5 ? 'moderate' : 'challenging'} this period
        </Text>
      </View>

      {/* Top Factors */}
      <View style={styles.insightCard}>
        <Text style={styles.insightTitle}>Common Factors</Text>
        <View style={styles.factorsContainer}>
          {['exercise', 'work', 'sleep', 'friends', 'stress'].map((factor, index) => (
            <View key={factor} style={styles.factorTag}>
              <Text style={styles.factorText}>{factor}</Text>
            </View>
          ))}
        </View>
      </View>
    </View>
  );

  const renderContent = () => {
    switch (selectedView) {
      case 'chart':
        return renderChart();
      case 'calendar':
        return renderCalendar();
      case 'insights':
        return renderInsights();
      default:
        return renderChart();
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.back()}>
          <ArrowLeft size={24} color={Colors.black} />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Mood Trends</Text>
        <View style={{ width: 24 }} />
      </View>

      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
        {/* Period Selector */}
        <View style={styles.periodSelector}>
          {periods.map((period) => (
            <TouchableOpacity
              key={period.id}
              style={[
                styles.periodButton,
                selectedPeriod === period.id && styles.selectedPeriod
              ]}
              onPress={() => setSelectedPeriod(period.id)}
            >
              <Text
                style={[
                  styles.periodText,
                  selectedPeriod === period.id && styles.selectedPeriodText
                ]}
              >
                {period.label}
              </Text>
            </TouchableOpacity>
          ))}
        </View>

        {/* View Selector */}
        <View style={styles.viewSelector}>
          {views.map((view) => (
            <TouchableOpacity
              key={view.id}
              style={[
                styles.viewButton,
                selectedView === view.id && styles.selectedView
              ]}
              onPress={() => setSelectedView(view.id)}
            >
              <view.icon 
                size={20} 
                color={selectedView === view.id ? Colors.lavender : Colors.gray600} 
              />
              <Text
                style={[
                  styles.viewText,
                  selectedView === view.id && styles.selectedViewText
                ]}
              >
                {view.label}
              </Text>
            </TouchableOpacity>
          ))}
        </View>

        {/* Content */}
        {renderContent()}

        {/* Summary Stats */}
        <View style={styles.summaryContainer}>
          <View style={styles.summaryCard}>
            <TrendingUp size={24} color={Colors.green} />
            <Text style={styles.summaryNumber}>{totalEntries}</Text>
            <Text style={styles.summaryLabel}>Total Entries</Text>
          </View>
          <View style={styles.summaryCard}>
            <Calendar size={24} color={Colors.lavender} />
            <Text style={styles.summaryNumber}>7</Text>
            <Text style={styles.summaryLabel}>Day Streak</Text>
          </View>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.warmGray,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: Spacing.xl,
    paddingVertical: Spacing.lg,
    backgroundColor: Colors.white,
    borderBottomWidth: 1,
    borderBottomColor: Colors.gray200,
  },
  headerTitle: {
    ...Typography.heading,
    color: Colors.black,
  },
  content: {
    flex: 1,
    paddingHorizontal: Spacing.xl,
  },
  periodSelector: {
    flexDirection: 'row',
    backgroundColor: Colors.white,
    borderRadius: BorderRadius.xl,
    padding: Spacing.xs,
    marginTop: Spacing.xl,
    marginBottom: Spacing.lg,
    ...Shadow.small,
  },
  periodButton: {
    flex: 1,
    paddingVertical: Spacing.md,
    alignItems: 'center',
    borderRadius: BorderRadius.lg,
  },
  selectedPeriod: {
    backgroundColor: Colors.lavender,
  },
  periodText: {
    ...Typography.secondary,
    color: Colors.gray600,
    fontFamily: 'Poppins-SemiBold',
  },
  selectedPeriodText: {
    color: Colors.white,
  },
  viewSelector: {
    flexDirection: 'row',
    backgroundColor: Colors.white,
    borderRadius: BorderRadius.lg,
    padding: Spacing.sm,
    marginBottom: Spacing.xl,
    ...Shadow.small,
  },
  viewButton: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: Spacing.md,
    borderRadius: BorderRadius.md,
  },
  selectedView: {
    backgroundColor: Colors.lightLavender,
  },
  viewText: {
    ...Typography.small,
    color: Colors.gray600,
    marginLeft: Spacing.sm,
    fontFamily: 'Poppins-SemiBold',
  },
  selectedViewText: {
    color: Colors.lavender,
  },
  chartContainer: {
    backgroundColor: Colors.white,
    borderRadius: BorderRadius.lg,
    padding: Spacing.lg,
    marginBottom: Spacing.xl,
    ...Shadow.small,
  },
  chartTitle: {
    ...Typography.paragraph,
    color: Colors.black,
    fontFamily: 'Poppins-SemiBold',
    marginBottom: Spacing.lg,
    textAlign: 'center',
  },
  chart: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    alignItems: 'flex-end',
    height: 140,
    marginBottom: Spacing.md,
  },
  chartBar: {
    alignItems: 'center',
    flex: 1,
  },
  bar: {
    width: 20,
    borderRadius: BorderRadius.sm,
    marginBottom: Spacing.sm,
  },
  barLabel: {
    ...Typography.small,
    color: Colors.gray600,
  },
  chartLegend: {
    alignItems: 'center',
  },
  legendText: {
    ...Typography.small,
    color: Colors.gray600,
  },
  calendarContainer: {
    backgroundColor: Colors.white,
    borderRadius: BorderRadius.lg,
    padding: Spacing.lg,
    marginBottom: Spacing.xl,
    ...Shadow.small,
  },
  calendarGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
  },
  calendarDay: {
    width: (width - Spacing.xl * 2 - Spacing.lg * 2) / 7 - 4,
    aspectRatio: 1,
    borderRadius: BorderRadius.md,
    borderWidth: 2,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: Spacing.sm,
  },
  calendarDate: {
    ...Typography.small,
    color: Colors.black,
    fontFamily: 'Poppins-SemiBold',
  },
  calendarEmoji: {
    fontSize: 16,
  },
  calendarIntensity: {
    ...Typography.small,
    color: Colors.gray600,
  },
  insightsContainer: {
    marginBottom: Spacing.xl,
  },
  insightCard: {
    backgroundColor: Colors.white,
    borderRadius: BorderRadius.lg,
    padding: Spacing.lg,
    marginBottom: Spacing.lg,
    ...Shadow.small,
  },
  insightTitle: {
    ...Typography.paragraph,
    color: Colors.black,
    fontFamily: 'Poppins-SemiBold',
    marginBottom: Spacing.lg,
  },
  moodDistributionItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: Spacing.md,
  },
  moodInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    width: 100,
  },
  moodEmoji: {
    fontSize: 20,
    marginRight: Spacing.sm,
  },
  moodName: {
    ...Typography.secondary,
    color: Colors.black,
    textTransform: 'capitalize',
  },
  moodStats: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
  },
  progressBar: {
    flex: 1,
    height: 8,
    backgroundColor: Colors.gray200,
    borderRadius: 4,
    marginRight: Spacing.md,
  },
  progressFill: {
    height: '100%',
    borderRadius: 4,
  },
  percentageText: {
    ...Typography.small,
    color: Colors.gray600,
    fontFamily: 'Poppins-SemiBold',
    width: 40,
    textAlign: 'right',
  },
  intensityDisplay: {
    alignItems: 'center',
    marginBottom: Spacing.md,
  },
  intensityNumber: {
    ...Typography.title,
    color: Colors.lavender,
    fontFamily: 'Poppins-Bold',
  },
  intensityLabel: {
    ...Typography.secondary,
    color: Colors.gray600,
  },
  intensityDescription: {
    ...Typography.secondary,
    color: Colors.gray700,
    textAlign: 'center',
    lineHeight: 20,
  },
  factorsContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
  },
  factorTag: {
    backgroundColor: Colors.lightLavender,
    paddingHorizontal: Spacing.md,
    paddingVertical: Spacing.sm,
    borderRadius: BorderRadius.xl,
    marginRight: Spacing.sm,
    marginBottom: Spacing.sm,
  },
  factorText: {
    ...Typography.small,
    color: Colors.lavender,
    fontFamily: 'Poppins-SemiBold',
  },
  summaryContainer: {
    flexDirection: 'row',
    marginBottom: Spacing.huge,
  },
  summaryCard: {
    flex: 1,
    backgroundColor: Colors.white,
    borderRadius: BorderRadius.lg,
    padding: Spacing.lg,
    alignItems: 'center',
    marginHorizontal: Spacing.sm,
    ...Shadow.small,
  },
  summaryNumber: {
    ...Typography.title,
    color: Colors.black,
    fontFamily: 'Poppins-Bold',
    marginTop: Spacing.sm,
  },
  summaryLabel: {
    ...Typography.small,
    color: Colors.gray600,
    marginTop: Spacing.xs,
  },
});