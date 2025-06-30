import { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  Image,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { router } from 'expo-router';
import { ArrowLeft, Play, Pause, SkipForward, SkipBack, Heart, Shuffle, Repeat } from 'lucide-react-native';
import Animated, { 
  useSharedValue, 
  useAnimatedStyle, 
  withTiming,
  withRepeat,
  Easing
} from 'react-native-reanimated';
import { Colors, Typography, Spacing, BorderRadius, Shadow } from '@/constants/theme';

const playlists = [
  {
    id: 1,
    name: 'Calm & Peaceful',
    mood: 'relaxing',
    color: Colors.pastelBlue,
    image: 'https://images.pexels.com/photos/1671325/pexels-photo-1671325.jpeg?auto=compress&cs=tinysrgb&w=400',
    tracks: [
      { id: 1, title: 'Ocean Waves', artist: 'Nature Sounds', duration: 180 },
      { id: 2, title: 'Forest Rain', artist: 'Ambient Collective', duration: 240 },
      { id: 3, title: 'Gentle Piano', artist: 'Peaceful Melodies', duration: 200 },
    ]
  },
  {
    id: 2,
    name: 'Uplifting Energy',
    mood: 'energizing',
    color: Colors.yellow,
    image: 'https://images.pexels.com/photos/1105666/pexels-photo-1105666.jpeg?auto=compress&cs=tinysrgb&w=400',
    tracks: [
      { id: 4, title: 'Morning Sunshine', artist: 'Positive Vibes', duration: 195 },
      { id: 5, title: 'Happy Thoughts', artist: 'Upbeat Collective', duration: 210 },
      { id: 6, title: 'Motivation Flow', artist: 'Energy Boost', duration: 185 },
    ]
  },
  {
    id: 3,
    name: 'Deep Focus',
    mood: 'focusing',
    color: Colors.lavender,
    image: 'https://images.pexels.com/photos/1181677/pexels-photo-1181677.jpeg?auto=compress&cs=tinysrgb&w=400',
    tracks: [
      { id: 7, title: 'Binaural Beats', artist: 'Focus Lab', duration: 300 },
      { id: 8, title: 'White Noise', artist: 'Concentration Aid', duration: 360 },
      { id: 9, title: 'Study Flow', artist: 'Productivity Sounds', duration: 280 },
    ]
  }
];

export default function MusicPlayerScreen() {
  const [selectedPlaylist, setSelectedPlaylist] = useState(playlists[0]);
  const [currentTrack, setCurrentTrack] = useState(selectedPlaylist.tracks[0]);
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [isLiked, setIsLiked] = useState(false);
  const [isShuffled, setIsShuffled] = useState(false);
  const [repeatMode, setRepeatMode] = useState(false);

  const rotationValue = useSharedValue(0);
  const pulseValue = useSharedValue(1);

  useEffect(() => {
    let interval: NodeJS.Timeout;
    
    if (isPlaying) {
      interval = setInterval(() => {
        setCurrentTime(prev => {
          if (prev >= currentTrack.duration) {
            handleNext();
            return 0;
          }
          return prev + 1;
        });
      }, 1000);

      // Animate album art rotation
      rotationValue.value = withRepeat(
        withTiming(360, { duration: 10000, easing: Easing.linear }),
        -1,
        false
      );

      // Pulse effect for play button
      pulseValue.value = withRepeat(
        withTiming(1.05, { duration: 1000 }),
        -1,
        true
      );
    } else {
      rotationValue.value = withTiming(rotationValue.value);
      pulseValue.value = withTiming(1);
    }

    return () => {
      if (interval) clearInterval(interval);
    };
  }, [isPlaying, currentTrack]);

  const rotationStyle = useAnimatedStyle(() => ({
    transform: [{ rotate: `${rotationValue.value}deg` }],
  }));

  const pulseStyle = useAnimatedStyle(() => ({
    transform: [{ scale: pulseValue.value }],
  }));

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  const handlePlayPause = () => {
    setIsPlaying(!isPlaying);
  };

  const handleNext = () => {
    const currentIndex = selectedPlaylist.tracks.findIndex(track => track.id === currentTrack.id);
    const nextIndex = (currentIndex + 1) % selectedPlaylist.tracks.length;
    setCurrentTrack(selectedPlaylist.tracks[nextIndex]);
    setCurrentTime(0);
  };

  const handlePrevious = () => {
    const currentIndex = selectedPlaylist.tracks.findIndex(track => track.id === currentTrack.id);
    const prevIndex = currentIndex === 0 ? selectedPlaylist.tracks.length - 1 : currentIndex - 1;
    setCurrentTrack(selectedPlaylist.tracks[prevIndex]);
    setCurrentTime(0);
  };

  const progress = (currentTime / currentTrack.duration) * 100;

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.back()}>
          <ArrowLeft size={24} color={Colors.black} />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Music Player</Text>
        <View style={{ width: 24 }} />
      </View>

      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
        {/* Playlist Selection */}
        <View style={styles.playlistSection}>
          <Text style={styles.sectionTitle}>Choose Your Mood</Text>
          <ScrollView horizontal showsHorizontalScrollIndicator={false}>
            {playlists.map((playlist) => (
              <TouchableOpacity
                key={playlist.id}
                style={[
                  styles.playlistCard,
                  { backgroundColor: playlist.color + '20' },
                  selectedPlaylist.id === playlist.id && styles.selectedPlaylist
                ]}
                onPress={() => {
                  setSelectedPlaylist(playlist);
                  setCurrentTrack(playlist.tracks[0]);
                  setCurrentTime(0);
                  setIsPlaying(false);
                }}
              >
                <Image source={{ uri: playlist.image }} style={styles.playlistImage} />
                <Text style={styles.playlistName}>{playlist.name}</Text>
                <Text style={[styles.playlistMood, { color: playlist.color }]}>
                  {playlist.mood}
                </Text>
              </TouchableOpacity>
            ))}
          </ScrollView>
        </View>

        {/* Now Playing */}
        <View style={styles.nowPlayingSection}>
          <Text style={styles.sectionTitle}>Now Playing</Text>
          
          <View style={styles.albumArtContainer}>
            <Animated.View style={[styles.albumArt, rotationStyle]}>
              <Image 
                source={{ uri: selectedPlaylist.image }} 
                style={styles.albumImage}
              />
            </Animated.View>
          </View>

          <View style={styles.trackInfo}>
            <Text style={styles.trackTitle}>{currentTrack.title}</Text>
            <Text style={styles.trackArtist}>{currentTrack.artist}</Text>
          </View>

          <View style={styles.progressContainer}>
            <View style={styles.progressBar}>
              <View style={[styles.progressFill, { width: `${progress}%` }]} />
            </View>
            <View style={styles.timeContainer}>
              <Text style={styles.timeText}>{formatTime(currentTime)}</Text>
              <Text style={styles.timeText}>{formatTime(currentTrack.duration)}</Text>
            </View>
          </View>

          <View style={styles.controlsContainer}>
            <TouchableOpacity 
              style={[styles.controlButton, isShuffled && styles.activeControl]}
              onPress={() => setIsShuffled(!isShuffled)}
            >
              <Shuffle size={20} color={isShuffled ? Colors.lavender : Colors.gray600} />
            </TouchableOpacity>

            <TouchableOpacity style={styles.controlButton} onPress={handlePrevious}>
              <SkipBack size={24} color={Colors.gray600} />
            </TouchableOpacity>

            <Animated.View style={pulseStyle}>
              <TouchableOpacity style={styles.playButton} onPress={handlePlayPause}>
                {isPlaying ? (
                  <Pause size={32} color={Colors.white} />
                ) : (
                  <Play size={32} color={Colors.white} />
                )}
              </TouchableOpacity>
            </Animated.View>

            <TouchableOpacity style={styles.controlButton} onPress={handleNext}>
              <SkipForward size={24} color={Colors.gray600} />
            </TouchableOpacity>

            <TouchableOpacity 
              style={[styles.controlButton, repeatMode && styles.activeControl]}
              onPress={() => setRepeatMode(!repeatMode)}
            >
              <Repeat size={20} color={repeatMode ? Colors.lavender : Colors.gray600} />
            </TouchableOpacity>
          </View>

          <TouchableOpacity 
            style={styles.likeButton}
            onPress={() => setIsLiked(!isLiked)}
          >
            <Heart 
              size={24} 
              color={isLiked ? Colors.pink : Colors.gray400}
              fill={isLiked ? Colors.pink : 'transparent'}
            />
            <Text style={[styles.likeText, isLiked && { color: Colors.pink }]}>
              {isLiked ? 'Liked' : 'Like this track'}
            </Text>
          </TouchableOpacity>
        </View>

        {/* Track List */}
        <View style={styles.trackListSection}>
          <Text style={styles.sectionTitle}>Playlist</Text>
          {selectedPlaylist.tracks.map((track, index) => (
            <TouchableOpacity
              key={track.id}
              style={[
                styles.trackItem,
                currentTrack.id === track.id && styles.currentTrackItem
              ]}
              onPress={() => {
                setCurrentTrack(track);
                setCurrentTime(0);
              }}
            >
              <View style={styles.trackNumber}>
                <Text style={[
                  styles.trackNumberText,
                  currentTrack.id === track.id && styles.currentTrackText
                ]}>
                  {index + 1}
                </Text>
              </View>
              <View style={styles.trackDetails}>
                <Text style={[
                  styles.trackItemTitle,
                  currentTrack.id === track.id && styles.currentTrackText
                ]}>
                  {track.title}
                </Text>
                <Text style={styles.trackItemArtist}>{track.artist}</Text>
              </View>
              <Text style={styles.trackDuration}>{formatTime(track.duration)}</Text>
            </TouchableOpacity>
          ))}
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
  },
  sectionTitle: {
    ...Typography.heading,
    color: Colors.black,
    marginBottom: Spacing.lg,
  },
  playlistSection: {
    paddingHorizontal: Spacing.xl,
    paddingTop: Spacing.xl,
    marginBottom: Spacing.xl,
  },
  playlistCard: {
    width: 140,
    borderRadius: BorderRadius.lg,
    padding: Spacing.md,
    marginRight: Spacing.md,
    alignItems: 'center',
    borderWidth: 2,
    borderColor: 'transparent',
    ...Shadow.small,
  },
  selectedPlaylist: {
    borderColor: Colors.lavender,
  },
  playlistImage: {
    width: 80,
    height: 80,
    borderRadius: BorderRadius.md,
    marginBottom: Spacing.sm,
  },
  playlistName: {
    ...Typography.secondary,
    color: Colors.black,
    fontFamily: 'Poppins-SemiBold',
    textAlign: 'center',
    marginBottom: Spacing.xs,
  },
  playlistMood: {
    ...Typography.small,
    fontFamily: 'Poppins-SemiBold',
  },
  nowPlayingSection: {
    backgroundColor: Colors.white,
    paddingHorizontal: Spacing.xl,
    paddingVertical: Spacing.xl,
    marginBottom: Spacing.xl,
  },
  albumArtContainer: {
    alignItems: 'center',
    marginBottom: Spacing.xl,
  },
  albumArt: {
    width: 200,
    height: 200,
    borderRadius: BorderRadius.round,
    ...Shadow.large,
  },
  albumImage: {
    width: '100%',
    height: '100%',
    borderRadius: BorderRadius.round,
  },
  trackInfo: {
    alignItems: 'center',
    marginBottom: Spacing.xl,
  },
  trackTitle: {
    ...Typography.subtitle,
    color: Colors.black,
    marginBottom: Spacing.sm,
  },
  trackArtist: {
    ...Typography.secondary,
    color: Colors.gray600,
  },
  progressContainer: {
    marginBottom: Spacing.xl,
  },
  progressBar: {
    height: 6,
    backgroundColor: Colors.gray200,
    borderRadius: 3,
    marginBottom: Spacing.sm,
  },
  progressFill: {
    height: '100%',
    backgroundColor: Colors.lavender,
    borderRadius: 3,
  },
  timeContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  timeText: {
    ...Typography.small,
    color: Colors.gray600,
    fontFamily: 'Poppins-SemiBold',
  },
  controlsContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: Spacing.lg,
  },
  controlButton: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: Colors.gray100,
    justifyContent: 'center',
    alignItems: 'center',
    marginHorizontal: Spacing.md,
  },
  activeControl: {
    backgroundColor: Colors.lightLavender,
  },
  playButton: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: Colors.lavender,
    justifyContent: 'center',
    alignItems: 'center',
    marginHorizontal: Spacing.lg,
    ...Shadow.medium,
  },
  likeButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: Spacing.md,
  },
  likeText: {
    ...Typography.secondary,
    color: Colors.gray600,
    marginLeft: Spacing.sm,
    fontFamily: 'Poppins-SemiBold',
  },
  trackListSection: {
    paddingHorizontal: Spacing.xl,
    paddingBottom: Spacing.huge,
  },
  trackItem: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: Colors.white,
    borderRadius: BorderRadius.md,
    padding: Spacing.md,
    marginBottom: Spacing.sm,
    ...Shadow.small,
  },
  currentTrackItem: {
    backgroundColor: Colors.lightLavender,
  },
  trackNumber: {
    width: 32,
    alignItems: 'center',
    marginRight: Spacing.md,
  },
  trackNumberText: {
    ...Typography.secondary,
    color: Colors.gray600,
    fontFamily: 'Poppins-SemiBold',
  },
  currentTrackText: {
    color: Colors.lavender,
  },
  trackDetails: {
    flex: 1,
  },
  trackItemTitle: {
    ...Typography.secondary,
    color: Colors.black,
    fontFamily: 'Poppins-SemiBold',
    marginBottom: Spacing.xs,
  },
  trackItemArtist: {
    ...Typography.small,
    color: Colors.gray600,
  },
  trackDuration: {
    ...Typography.small,
    color: Colors.gray600,
    fontFamily: 'Poppins-SemiBold',
  },
});