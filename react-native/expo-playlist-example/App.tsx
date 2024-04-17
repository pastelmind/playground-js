import { MaterialIcons } from "@expo/vector-icons";
import Slider from "@react-native-community/slider";
import {
  Audio,
  InterruptionModeAndroid,
  InterruptionModeIOS,
  ResizeMode,
  Video,
  type AVPlaybackStatus,
  type VideoFullscreenUpdateEvent,
  type VideoReadyForDisplayEvent,
} from "expo-av";
import * as Font from "expo-font";
import {
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
  type ComponentRef,
} from "react";
import {
  Dimensions,
  Image,
  StyleSheet,
  Text,
  TouchableHighlight,
  View,
  type GestureResponderEvent,
  type ImageURISource,
} from "react-native";

import {
  ICON_BACK_BUTTON,
  ICON_FORWARD_BUTTON,
  ICON_LOOP_ALL_BUTTON,
  ICON_LOOP_ONE_BUTTON,
  ICON_MUTED_BUTTON,
  ICON_PAUSE_BUTTON,
  ICON_PLAY_BUTTON,
  ICON_STOP_BUTTON,
  ICON_THUMB_1,
  ICON_THUMB_2,
  ICON_TRACK_1,
  ICON_UNMUTED_BUTTON,
} from "./src/icons";
import { PLAYLIST } from "./src/playlist";
import { getMMSSFromMillis, useLatestRef } from "./src/util";

const ICON_THROUGH_EARPIECE = "speaker-phone";
const ICON_THROUGH_SPEAKER = "speaker";

const LOOPING_TYPE_ALL = 0;
const LOOPING_TYPE_ONE = 1;
const LOOPING_TYPE_ICONS = { 0: ICON_LOOP_ALL_BUTTON, 1: ICON_LOOP_ONE_BUTTON };

const { width: DEVICE_WIDTH, height: DEVICE_HEIGHT } = Dimensions.get("window");
const BACKGROUND_COLOR = "#FFF8ED";
const DISABLED_OPACITY = 0.5;
const FONT_SIZE = 14;
const LOADING_STRING = "... loading ...";
const BUFFERING_STRING = "...buffering...";
const RATE_SCALE = 3.0;
const VIDEO_CONTAINER_HEIGHT = (DEVICE_HEIGHT * 2.0) / 5.0 - FONT_SIZE * 2;

interface State {
  showVideo: boolean;
  playbackInstanceName: string;
  loopingType: keyof typeof LOOPING_TYPE_ICONS;
  muted: boolean;
  playbackInstancePosition: number | null;
  playbackInstanceDuration: number | null;
  shouldPlay: boolean;
  isPlaying: boolean;
  isBuffering: boolean;
  isLoading: boolean;
  fontLoaded: boolean;
  shouldCorrectPitch: boolean;
  volume: number;
  rate: number;
  videoWidth: number;
  videoHeight: number;
  poster: boolean;
  useNativeControls: boolean;
  fullscreen: boolean;
  throughEarpiece: boolean;
}

const INITIAL_STATE: State = {
  showVideo: false,
  playbackInstanceName: LOADING_STRING,
  loopingType: LOOPING_TYPE_ALL,
  muted: false,
  playbackInstancePosition: null,
  playbackInstanceDuration: null,
  shouldPlay: false,
  isPlaying: false,
  isBuffering: false,
  isLoading: true,
  fontLoaded: false,
  shouldCorrectPitch: true,
  volume: 1.0,
  rate: 1.0,
  videoWidth: DEVICE_WIDTH,
  videoHeight: VIDEO_CONTAINER_HEIGHT,
  poster: false,
  useNativeControls: false,
  fullscreen: false,
  throughEarpiece: false,
};

export default function App() {
  const indexRef = useRef(0);
  const isSeekingRef = useRef(false);
  const shouldPlayAtEndOfSeekRef = useRef(false);
  const playbackInstanceRef = useRef<Audio.Sound | Video | null>(null);
  const _videoRef = useRef<Video | null>(null);

  const [state, setState] = useState<State>(INITIAL_STATE);
  const stateRef = useLatestRef(state);

  useEffect(() => {
    Audio.setAudioModeAsync({
      allowsRecordingIOS: false,
      staysActiveInBackground: false,
      interruptionModeIOS: InterruptionModeIOS.DoNotMix,
      playsInSilentModeIOS: true,
      shouldDuckAndroid: true,
      interruptionModeAndroid: InterruptionModeAndroid.DoNotMix,
      playThroughEarpieceAndroid: false,
    });

    Font.loadAsync({
      ...MaterialIcons.font,
      "cutive-mono-regular": require("./assets/fonts/CutiveMono-Regular.ttf"),
    }).then(() => setState((prev) => ({ ...prev, fontLoaded: true })));
  }, []);

  const {
    _loadNewPlaybackInstance,
    _onPlaybackStatusUpdate,
    _updatePlaybackInstanceForIndex,
  } = useMemo(() => {
    const _loadNewPlaybackInstance = async (playing: boolean) => {
      if (playbackInstanceRef.current != null) {
        await playbackInstanceRef.current.unloadAsync();
        // playbackInstanceRef.current.setOnPlaybackStatusUpdate(null);
        playbackInstanceRef.current = null;
      }

      const source = { uri: PLAYLIST[indexRef.current].uri };
      const initialStatus = {
        shouldPlay: playing,
        rate: stateRef.current.rate,
        shouldCorrectPitch: stateRef.current.shouldCorrectPitch,
        volume: stateRef.current.volume,
        isMuted: stateRef.current.muted,
        isLooping: stateRef.current.loopingType === LOOPING_TYPE_ONE,
        // // UNCOMMENT THIS TO TEST THE OLD androidImplementation:
        // androidImplementation: 'MediaPlayer',
      };

      if (PLAYLIST[indexRef.current].isVideo) {
        await _videoRef.current!.loadAsync(source, initialStatus);
        // this._video.onPlaybackStatusUpdate(this._onPlaybackStatusUpdate);
        playbackInstanceRef.current = _videoRef.current;
        const status = await _videoRef.current!.getStatusAsync();
      } else {
        const { sound, status } = await Audio.Sound.createAsync(
          source,
          initialStatus,
          _onPlaybackStatusUpdate,
        );
        playbackInstanceRef.current = sound;
      }

      _updateScreenForLoading(false);
    };

    const _onPlaybackStatusUpdate = (status: AVPlaybackStatus) => {
      if (status.isLoaded) {
        setState((prev) => ({
          ...prev,
          playbackInstancePosition: status.positionMillis,
          playbackInstanceDuration: status.durationMillis ?? null,
          shouldPlay: status.shouldPlay,
          isPlaying: status.isPlaying,
          isBuffering: status.isBuffering,
          rate: status.rate,
          muted: status.isMuted,
          volume: status.volume,
          loopingType: status.isLooping ? LOOPING_TYPE_ONE : LOOPING_TYPE_ALL,
          shouldCorrectPitch: status.shouldCorrectPitch,
        }));
        if (status.didJustFinish && !status.isLooping) {
          _advanceIndex(true);
          _updatePlaybackInstanceForIndex(true);
        }
      } else {
        if (status.error) {
          console.log(`FATAL PLAYER ERROR: ${status.error}`);
        }
      }
    };

    const _updatePlaybackInstanceForIndex = async (playing: boolean) => {
      _updateScreenForLoading(true);

      setState((prev) => ({
        ...prev,
        videoWidth: DEVICE_WIDTH,
        videoHeight: VIDEO_CONTAINER_HEIGHT,
      }));

      _loadNewPlaybackInstance(playing);
    };

    return {
      _loadNewPlaybackInstance,
      _onPlaybackStatusUpdate,
      _updatePlaybackInstanceForIndex,
    };
  }, [stateRef]);

  const _mountVideo = useCallback(
    (component: ComponentRef<typeof Video>) => {
      _videoRef.current = component;
      _loadNewPlaybackInstance(false);
    },
    [_loadNewPlaybackInstance],
  );

  const _updateScreenForLoading = (isLoading: boolean) => {
    if (isLoading) {
      setState((prev) => ({
        ...prev,
        showVideo: false,
        isPlaying: false,
        playbackInstanceName: LOADING_STRING,
        playbackInstanceDuration: null,
        playbackInstancePosition: null,
        isLoading: true,
      }));
    } else {
      setState((prev) => ({
        ...prev,
        playbackInstanceName: PLAYLIST[indexRef.current].name,
        showVideo: PLAYLIST[indexRef.current].isVideo,
        isLoading: false,
      }));
    }
  };

  const _onLoadStart = () => {
    console.log(`ON LOAD START`);
  };

  const _onLoad = (status: AVPlaybackStatus) => {
    console.log(`ON LOAD : ${JSON.stringify(status)}`);
  };

  const _onError = (error: string) => {
    console.log(`ON ERROR : ${error}`);
  };

  const _onReadyForDisplay = (event: VideoReadyForDisplayEvent) => {
    const widestHeight =
      (DEVICE_WIDTH * event.naturalSize.height) / event.naturalSize.width;
    if (widestHeight > VIDEO_CONTAINER_HEIGHT) {
      setState((prev) => ({
        ...prev,
        videoWidth:
          (VIDEO_CONTAINER_HEIGHT * event.naturalSize.width) /
          event.naturalSize.height,
        videoHeight: VIDEO_CONTAINER_HEIGHT,
      }));
    } else {
      setState((prev) => ({
        ...prev,
        videoWidth: DEVICE_WIDTH,
        videoHeight:
          (DEVICE_WIDTH * event.naturalSize.height) / event.naturalSize.width,
      }));
    }
  };

  const _onFullscreenUpdate = (event: VideoFullscreenUpdateEvent) => {
    console.log(
      `FULLSCREEN UPDATE : ${JSON.stringify(event.fullscreenUpdate)}`,
    );
  };

  const _advanceIndex = (forward: boolean) => {
    indexRef.current =
      (indexRef.current + (forward ? 1 : PLAYLIST.length - 1)) %
      PLAYLIST.length;
  };

  const _onPlayPausePressed = () => {
    if (playbackInstanceRef.current != null) {
      if (state.isPlaying) {
        playbackInstanceRef.current.pauseAsync();
      } else {
        playbackInstanceRef.current.playAsync();
      }
    }
  };

  const _onStopPressed = () => {
    if (playbackInstanceRef.current != null) {
      playbackInstanceRef.current.stopAsync();
    }
  };

  const _onForwardPressed = () => {
    if (playbackInstanceRef.current != null) {
      _advanceIndex(true);
      _updatePlaybackInstanceForIndex(state.shouldPlay);
    }
  };

  const _onBackPressed = () => {
    if (playbackInstanceRef.current != null) {
      _advanceIndex(false);
      _updatePlaybackInstanceForIndex(state.shouldPlay);
    }
  };

  const _onMutePressed = () => {
    if (playbackInstanceRef.current != null) {
      playbackInstanceRef.current.setIsMutedAsync(!state.muted);
    }
  };

  const _onLoopPressed = () => {
    if (playbackInstanceRef.current != null) {
      playbackInstanceRef.current.setIsLoopingAsync(
        state.loopingType !== LOOPING_TYPE_ONE,
      );
    }
  };

  const _onVolumeSliderValueChange = (value: number) => {
    if (playbackInstanceRef.current != null) {
      playbackInstanceRef.current.setVolumeAsync(value);
    }
  };

  const _trySetRate = async (rate: number, shouldCorrectPitch: boolean) => {
    if (playbackInstanceRef.current != null) {
      try {
        await playbackInstanceRef.current.setRateAsync(
          rate,
          shouldCorrectPitch,
        );
      } catch (error) {
        // Rate changing could not be performed, possibly because the client's Android API is too old.
      }
    }
  };

  const _onRateSliderSlidingComplete = async (value: number) => {
    _trySetRate(value * RATE_SCALE, state.shouldCorrectPitch);
  };

  const _onPitchCorrectionPressed = async (value: GestureResponderEvent) => {
    _trySetRate(state.rate, !state.shouldCorrectPitch);
  };

  const _onSeekSliderValueChange = (value: number) => {
    if (playbackInstanceRef.current != null && !isSeekingRef.current) {
      isSeekingRef.current = true;
      shouldPlayAtEndOfSeekRef.current = state.shouldPlay;
      playbackInstanceRef.current.pauseAsync();
    }
  };

  const _onSeekSliderSlidingComplete = async (value: number) => {
    if (playbackInstanceRef.current != null) {
      isSeekingRef.current = false;
      const seekPosition = value * state.playbackInstanceDuration!;
      if (shouldPlayAtEndOfSeekRef.current) {
        playbackInstanceRef.current.playFromPositionAsync(seekPosition);
      } else {
        playbackInstanceRef.current.setPositionAsync(seekPosition);
      }
    }
  };

  const _getSeekSliderPosition = () => {
    if (
      playbackInstanceRef.current != null &&
      state.playbackInstancePosition != null &&
      state.playbackInstanceDuration != null
    ) {
      return state.playbackInstancePosition / state.playbackInstanceDuration;
    }
    return 0;
  };

  const _getTimestamp = () => {
    if (
      playbackInstanceRef.current != null &&
      state.playbackInstancePosition != null &&
      state.playbackInstanceDuration != null
    ) {
      return `${getMMSSFromMillis(
        state.playbackInstancePosition,
      )} / ${getMMSSFromMillis(state.playbackInstanceDuration)}`;
    }
    return "";
  };

  const _onPosterPressed = () => {
    setState((prev) => ({ ...prev, poster: !state.poster }));
  };

  const _onUseNativeControlsPressed = () => {
    setState((prev) => ({
      ...prev,
      useNativeControls: !state.useNativeControls,
    }));
  };

  const _onFullscreenPressed = () => {
    try {
      _videoRef.current!.presentFullscreenPlayer();
    } catch (error) {
      console.log(String(error));
    }
  };

  const _onSpeakerPressed = () => {
    setState((prev) => ({ ...prev, throughEarpiece: !prev.throughEarpiece }));
  };

  useEffect(() => {
    Audio.setAudioModeAsync({
      allowsRecordingIOS: false,
      interruptionModeIOS: InterruptionModeIOS.DoNotMix,
      playsInSilentModeIOS: true,
      shouldDuckAndroid: true,
      interruptionModeAndroid: InterruptionModeAndroid.DoNotMix,
      playThroughEarpieceAndroid: !state.throughEarpiece,
    });
  }, [state.throughEarpiece]);

  return !state.fontLoaded ? (
    <View style={styles.emptyContainer} />
  ) : (
    <View style={styles.container}>
      <View />
      <View style={styles.nameContainer}>
        <Text style={[styles.text, { fontFamily: "cutive-mono-regular" }]}>
          {state.playbackInstanceName}
        </Text>
      </View>
      <View style={styles.space} />
      <View style={styles.videoContainer}>
        <Video
          ref={_mountVideo}
          style={[
            styles.video,
            {
              opacity: state.showVideo ? 1.0 : 0.0,
              width: state.videoWidth,
              height: state.videoHeight,
            },
          ]}
          resizeMode={ResizeMode.CONTAIN}
          onPlaybackStatusUpdate={_onPlaybackStatusUpdate}
          onLoadStart={_onLoadStart}
          onLoad={_onLoad}
          onError={_onError}
          onFullscreenUpdate={_onFullscreenUpdate}
          onReadyForDisplay={_onReadyForDisplay}
          useNativeControls={state.useNativeControls}
        />
      </View>
      <View
        style={[
          styles.playbackContainer,
          { opacity: state.isLoading ? DISABLED_OPACITY : 1.0 },
        ]}
      >
        <Slider
          style={styles.playbackSlider}
          trackImage={ICON_TRACK_1.module as ImageURISource}
          thumbImage={ICON_THUMB_1.module as ImageURISource}
          value={_getSeekSliderPosition()}
          onValueChange={_onSeekSliderValueChange}
          onSlidingComplete={_onSeekSliderSlidingComplete}
          disabled={state.isLoading}
        />
        <View style={styles.timestampRow}>
          <Text
            style={[
              styles.text,
              styles.buffering,
              { fontFamily: "cutive-mono-regular" },
            ]}
          >
            {state.isBuffering ? BUFFERING_STRING : ""}
          </Text>
          <Text
            style={[
              styles.text,
              styles.timestamp,
              { fontFamily: "cutive-mono-regular" },
            ]}
          >
            {_getTimestamp()}
          </Text>
        </View>
      </View>
      <View
        style={[
          styles.buttonsContainerBase,
          styles.buttonsContainerTopRow,
          {
            opacity: state.isLoading ? DISABLED_OPACITY : 1.0,
          },
        ]}
      >
        <TouchableHighlight
          underlayColor={BACKGROUND_COLOR}
          style={styles.wrapper}
          onPress={_onBackPressed}
          disabled={state.isLoading}
        >
          <Image style={styles.button} source={ICON_BACK_BUTTON.module} />
        </TouchableHighlight>
        <TouchableHighlight
          underlayColor={BACKGROUND_COLOR}
          style={styles.wrapper}
          onPress={_onPlayPausePressed}
          disabled={state.isLoading}
        >
          <Image
            style={styles.button}
            source={
              state.isPlaying
                ? ICON_PAUSE_BUTTON.module
                : ICON_PLAY_BUTTON.module
            }
          />
        </TouchableHighlight>
        <TouchableHighlight
          underlayColor={BACKGROUND_COLOR}
          style={styles.wrapper}
          onPress={_onStopPressed}
          disabled={state.isLoading}
        >
          <Image style={styles.button} source={ICON_STOP_BUTTON.module} />
        </TouchableHighlight>
        <TouchableHighlight
          underlayColor={BACKGROUND_COLOR}
          style={styles.wrapper}
          onPress={_onForwardPressed}
          disabled={state.isLoading}
        >
          <Image style={styles.button} source={ICON_FORWARD_BUTTON.module} />
        </TouchableHighlight>
      </View>
      <View
        style={[styles.buttonsContainerBase, styles.buttonsContainerMiddleRow]}
      >
        <View style={styles.volumeContainer}>
          <TouchableHighlight
            underlayColor={BACKGROUND_COLOR}
            style={styles.wrapper}
            onPress={_onMutePressed}
          >
            <Image
              style={styles.button}
              source={
                state.muted
                  ? ICON_MUTED_BUTTON.module
                  : ICON_UNMUTED_BUTTON.module
              }
            />
          </TouchableHighlight>
          <Slider
            style={styles.volumeSlider}
            trackImage={ICON_TRACK_1.module as ImageURISource}
            thumbImage={ICON_THUMB_2.module as ImageURISource}
            value={1}
            onValueChange={_onVolumeSliderValueChange}
          />
        </View>
        <TouchableHighlight
          underlayColor={BACKGROUND_COLOR}
          style={styles.wrapper}
          onPress={_onLoopPressed}
        >
          <Image
            style={styles.button}
            source={LOOPING_TYPE_ICONS[state.loopingType].module}
          />
        </TouchableHighlight>
      </View>
      <View
        style={[styles.buttonsContainerBase, styles.buttonsContainerBottomRow]}
      >
        <TouchableHighlight
          underlayColor={BACKGROUND_COLOR}
          style={styles.wrapper}
          onPress={() => _trySetRate(1.0, state.shouldCorrectPitch)}
        >
          <View style={styles.button}>
            <Text style={[styles.text, { fontFamily: "cutive-mono-regular" }]}>
              Rate:
            </Text>
          </View>
        </TouchableHighlight>
        <Slider
          style={styles.rateSlider}
          trackImage={ICON_TRACK_1.module as ImageURISource}
          thumbImage={ICON_THUMB_1.module as ImageURISource}
          value={state.rate / RATE_SCALE}
          onSlidingComplete={_onRateSliderSlidingComplete}
        />
        <TouchableHighlight
          underlayColor={BACKGROUND_COLOR}
          style={styles.wrapper}
          onPress={_onPitchCorrectionPressed}
        >
          <View style={styles.button}>
            <Text style={[styles.text, { fontFamily: "cutive-mono-regular" }]}>
              PC: {state.shouldCorrectPitch ? "yes" : "no"}
            </Text>
          </View>
        </TouchableHighlight>
        <TouchableHighlight
          onPress={_onSpeakerPressed}
          underlayColor={BACKGROUND_COLOR}
        >
          <MaterialIcons
            name={
              state.throughEarpiece
                ? ICON_THROUGH_EARPIECE
                : ICON_THROUGH_SPEAKER
            }
            size={32}
            color="black"
          />
        </TouchableHighlight>
      </View>
      <View />
      {state.showVideo ? (
        <View>
          <View
            style={[
              styles.buttonsContainerBase,
              styles.buttonsContainerTextRow,
            ]}
          >
            <View />
            <TouchableHighlight
              underlayColor={BACKGROUND_COLOR}
              style={styles.wrapper}
              onPress={_onPosterPressed}
            >
              <View style={styles.button}>
                <Text
                  style={[styles.text, { fontFamily: "cutive-mono-regular" }]}
                >
                  Poster: {state.poster ? "yes" : "no"}
                </Text>
              </View>
            </TouchableHighlight>
            <View />
            <TouchableHighlight
              underlayColor={BACKGROUND_COLOR}
              style={styles.wrapper}
              onPress={_onFullscreenPressed}
            >
              <View style={styles.button}>
                <Text
                  style={[styles.text, { fontFamily: "cutive-mono-regular" }]}
                >
                  Fullscreen
                </Text>
              </View>
            </TouchableHighlight>
            <View />
          </View>
          <View style={styles.space} />
          <View
            style={[
              styles.buttonsContainerBase,
              styles.buttonsContainerTextRow,
            ]}
          >
            <View />
            <TouchableHighlight
              underlayColor={BACKGROUND_COLOR}
              style={styles.wrapper}
              onPress={_onUseNativeControlsPressed}
            >
              <View style={styles.button}>
                <Text
                  style={[styles.text, { fontFamily: "cutive-mono-regular" }]}
                >
                  Native Controls: {state.useNativeControls ? "yes" : "no"}
                </Text>
              </View>
            </TouchableHighlight>
            <View />
          </View>
        </View>
      ) : null}
    </View>
  );
}

const styles = StyleSheet.create({
  emptyContainer: {
    alignSelf: "stretch",
    backgroundColor: BACKGROUND_COLOR,
  },
  container: {
    flex: 1,
    flexDirection: "column",
    justifyContent: "space-between",
    alignItems: "center",
    alignSelf: "stretch",
    backgroundColor: BACKGROUND_COLOR,
  },
  wrapper: {},
  nameContainer: {
    height: FONT_SIZE,
  },
  space: {
    height: FONT_SIZE,
  },
  videoContainer: {
    height: VIDEO_CONTAINER_HEIGHT,
  },
  video: {
    maxWidth: DEVICE_WIDTH,
  },
  playbackContainer: {
    flex: 1,
    flexDirection: "column",
    justifyContent: "space-between",
    alignItems: "center",
    alignSelf: "stretch",
    minHeight: ICON_THUMB_1.height * 2.0,
    maxHeight: ICON_THUMB_1.height * 2.0,
  },
  playbackSlider: {
    alignSelf: "stretch",
  },
  timestampRow: {
    flex: 1,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    alignSelf: "stretch",
    minHeight: FONT_SIZE,
  },
  text: {
    fontSize: FONT_SIZE,
    minHeight: FONT_SIZE,
  },
  buffering: {
    textAlign: "left",
    paddingLeft: 20,
  },
  timestamp: {
    textAlign: "right",
    paddingRight: 20,
  },
  button: {
    backgroundColor: BACKGROUND_COLOR,
  },
  buttonsContainerBase: {
    flex: 1,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  buttonsContainerTopRow: {
    maxHeight: ICON_PLAY_BUTTON.height,
    minWidth: DEVICE_WIDTH / 2.0,
    maxWidth: DEVICE_WIDTH / 2.0,
  },
  buttonsContainerMiddleRow: {
    maxHeight: ICON_MUTED_BUTTON.height,
    alignSelf: "stretch",
    paddingRight: 20,
  },
  volumeContainer: {
    flex: 1,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    minWidth: DEVICE_WIDTH / 2.0,
    maxWidth: DEVICE_WIDTH / 2.0,
  },
  volumeSlider: {
    width: DEVICE_WIDTH / 2.0 - ICON_MUTED_BUTTON.width,
  },
  buttonsContainerBottomRow: {
    maxHeight: ICON_THUMB_1.height,
    alignSelf: "stretch",
    paddingRight: 20,
    paddingLeft: 20,
  },
  rateSlider: {
    width: DEVICE_WIDTH / 2.0,
  },
  buttonsContainerTextRow: {
    maxHeight: FONT_SIZE,
    alignItems: "center",
    paddingRight: 20,
    paddingLeft: 20,
    minWidth: DEVICE_WIDTH,
    maxWidth: DEVICE_WIDTH,
  },
});
