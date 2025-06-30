import { useState, useEffect, useRef } from 'react';
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
import {
  ArrowLeft,
  Play,
  Pause,
  SkipForward,
  SkipBack,
  Heart,
  Shuffle,
  Repeat,
} from 'lucide-react-native';
import Animated, {
  useSharedValue,
  useAnimatedStyle,
} from 'react-native-reanimated';
import { Audio } from 'expo-av';
import {
  Colors,
  Typography,
  Spacing,
  BorderRadius,
  Shadow,
} from '@/constants/theme';

const playlists = [
  {
    id: 1,
    name: 'Ocean Waves',
    mood: 'Relax',
    color: Colors.info,
    image: 'https://images.unsplash.com/photo-1506744038136-46273834b3fb',
    tracks: [
      {
        id: 101,
        title: 'Ocean Waves',
        artist: 'Nature Sounds',
        duration: 68,
        url: 'https://soundbible.com/grab.php?id=1936&type=mp3',
      },
    ],
  },
  {
    id: 2,
    name: 'Forest Rain',
    mood: 'Calm',
    color: Colors.green,
    image: 'https://images.unsplash.com/photo-1465101046530-73398c7f28ca',
    tracks: [
      {
        id: 201,
        title: 'Forest Rain',
        artist: 'Ambient Collective',
        duration: 48,
        url: 'https://soundbible.com/grab.php?id=2006&type=mp3',
      },
    ],
  },
  {
    id: 3,
    name: 'Gentle Piano',
    mood: 'Peaceful',
    color: Colors.purple,
    image: 'https://images.unsplash.com/photo-1511671782779-c97d3d27a1d4',
    tracks: [
      {
        id: 301,
        title: 'Gentle Piano',
        artist: 'Peaceful Melodies',
        duration: 12960,
        url: 'https://firebasestorage.googleapis.com/v0/b/attendance-64030.appspot.com/o/Relaxing%20Piano%20Music_%20Romantic%20Music%2C%20Beautiful%20Relaxing%20Music%2C%20Sleep%20Music%2C%20Stress%20Relief%20%C3%A2%CB%9C%E2%80%A6122.mp3?alt=media&token=5bb296d5-5b12-46ec-a3b9-c6ade4687bc2',
      },
    ],
  },
];

export default function MusicPlayerScreen() {
  const [selectedPlaylist, setSelectedPlaylist] = useState(playlists[0]);
  const [currentTrack, setCurrentTrack] = useState(playlists[0].tracks[0]);
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [isLiked, setIsLiked] = useState(false);
  const [isShuffled, setIsShuffled] = useState(false);
  const [repeatMode, setRepeatMode] = useState(false);
  const [sound, setSound] = useState<Audio.Sound | null>(null);
  const intervalRef = useRef<number | null>(null);

  const rotationValue = useSharedValue(0);
  const pulseValue = useSharedValue(1);

  useEffect(() => {
    Audio.setAudioModeAsync({
      allowsRecordingIOS: false,
      staysActiveInBackground: true,
      playsInSilentModeIOS: true,
      shouldDuckAndroid: true,
      playThroughEarpieceAndroid: false,
    });
  }, []);

  useEffect(() => {
    return () => {
      if (intervalRef.current) clearInterval(intervalRef.current);
      sound?.unloadAsync();
    };
  }, []);

  useEffect(() => {
    const loadSound = async () => {
      if (sound) {
        await sound.stopAsync();
        await sound.unloadAsync();
        setSound(null);
      }

      const { sound: newSound } = await Audio.Sound.createAsync(
        { uri: currentTrack.url },
        { shouldPlay: isPlaying }
      );

      setSound(newSound);
      setCurrentTime(0);

      if (isPlaying) {
        startTimer();
      }
    };

    loadSound();
  }, [currentTrack]);

  useEffect(() => {
    if (isPlaying) {
      sound?.playAsync();
      startTimer();
    } else {
      sound?.pauseAsync();
      if (intervalRef.current) clearInterval(intervalRef.current);
    }
  }, [isPlaying]);

  const startTimer = () => {
    if (intervalRef.current) clearInterval(intervalRef.current);
    intervalRef.current = setInterval(() => {
      setCurrentTime((prev) => {
        if (prev >= currentTrack.duration) {
          handleNext();
          return 0;
        }
        return prev + 1;
      });
    }, 1000);
  };

  const handlePlayPause = () => {
    setIsPlaying((prev) => !prev);
  };

  const handleNext = () => {
    const tracks = selectedPlaylist.tracks;
    const index = tracks.findIndex((t) => t.id === currentTrack.id);
    const nextIndex = (index + 1) % tracks.length;
    setCurrentTrack(tracks[nextIndex]);
    setIsPlaying(true);
  };

  const handlePrevious = () => {
    const tracks = selectedPlaylist.tracks;
    const index = tracks.findIndex((t) => t.id === currentTrack.id);
    const prevIndex = index === 0 ? tracks.length - 1 : index - 1;
    setCurrentTrack(tracks[prevIndex]);
    setIsPlaying(true);
  };

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  const progress = (currentTime / currentTrack.duration) * 100;

  const rotationStyle = useAnimatedStyle(() => ({
    transform: [{ rotate: `${rotationValue.value}deg` }],
  }));

  const pulseStyle = useAnimatedStyle(() => ({
    transform: [{ scale: pulseValue.value }],
  }));

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
            {playlists.map(p => (
              <TouchableOpacity
                key={p.id}
                style={[styles.playlistCard, { backgroundColor: p.color + '20' }, selectedPlaylist.id === p.id && styles.selectedPlaylist]}
                onPress={() => {
                  setSelectedPlaylist(p);
                  setCurrentTrack(p.tracks[0]);
                  setCurrentTime(0);
                  setIsPlaying(false);
                }}
              >
                <Image source={{ uri: p.image }} style={styles.playlistImage} />
                <Text style={styles.playlistName}>{p.name}</Text>
                <Text style={[styles.playlistMood, { color: p.color }]}>{p.mood}</Text>
              </TouchableOpacity>
            ))}
          </ScrollView>
        </View>

        {/* Now Playing */}
        <View style={styles.nowPlayingSection}>
          <Text style={styles.sectionTitle}>Now Playing</Text>
          <View style={styles.albumArtContainer}>
            <Animated.View style={[styles.albumArt, rotationStyle]}>
              <Image source={{ uri: selectedPlaylist.image }} style={styles.albumImage} />
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
            <TouchableOpacity style={[styles.controlButton, isShuffled && styles.activeControl]} onPress={() => setIsShuffled(!isShuffled)}>
              <Shuffle size={20} color={isShuffled ? Colors.purple : Colors.gray600} />
            </TouchableOpacity>
            <TouchableOpacity style={styles.controlButton} onPress={handlePrevious}>
              <SkipBack size={24} color={Colors.gray600} />
            </TouchableOpacity>
            <Animated.View style={pulseStyle}>
              <TouchableOpacity style={styles.playButton} onPress={handlePlayPause}>
                {isPlaying ? <Pause size={32} color={Colors.white} /> : <Play size={32} color={Colors.white} />}
              </TouchableOpacity>
            </Animated.View>
            <TouchableOpacity style={styles.controlButton} onPress={handleNext}>
              <SkipForward size={24} color={Colors.gray600} />
            </TouchableOpacity>
            <TouchableOpacity style={[styles.controlButton, repeatMode && styles.activeControl]} onPress={() => setRepeatMode(!repeatMode)}>
              <Repeat size={20} color={repeatMode ? Colors.purple : Colors.gray600} />
            </TouchableOpacity>
          </View>
          <TouchableOpacity style={styles.likeButton} onPress={() => setIsLiked(!isLiked)}>
            <Heart size={24} color={isLiked ? Colors.pink : Colors.gray400} fill={isLiked ? Colors.pink : 'transparent'} />
            <Text style={[styles.likeText, isLiked && { color: Colors.pink }]}>{isLiked ? 'Liked' : 'Like this track'}</Text>
          </TouchableOpacity>
        </View>

        {/* Track List */}
        <View style={styles.trackListSection}>
          <Text style={styles.sectionTitle}>Playlist</Text>
          {selectedPlaylist.tracks.map((track, idx) => (
            <TouchableOpacity
              key={track.id}
              style={[styles.trackItem, currentTrack.id === track.id && styles.currentTrackItem]}
              onPress={() => {
                setCurrentTrack(track);
                setCurrentTime(0);
              }}
            >
              <View style={styles.trackNumber}>
                <Text style={[styles.trackNumberText, currentTrack.id === track.id && styles.currentTrackText]}>{idx + 1}</Text>
              </View>
              <View style={styles.trackDetails}>
                <Text style={[styles.trackItemTitle, currentTrack.id === track.id && styles.currentTrackText]}>{track.title}</Text>
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
    backgroundColor: Colors.gray100,
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
    // ...Shadow.small,
  },
  selectedPlaylist: {
    borderColor: Colors.purple,
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
    borderRadius: BorderRadius.xl,
    // ...Shadow.large,
  },
  albumImage: {
    width: '100%',
    height: '100%',
    borderRadius: 200,
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
    backgroundColor: Colors.purple,
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
    backgroundColor: Colors.purple,
  },
  playButton: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: Colors.purple,
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
    backgroundColor: Colors.purple,
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
    color: Colors.purple,
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
