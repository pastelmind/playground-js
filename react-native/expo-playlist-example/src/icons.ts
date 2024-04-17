import { Asset } from "expo-asset";
import type { ImageRequireSource } from "react-native";

class Icon {
  constructor(
    public readonly module: ImageRequireSource,
    public readonly width: number,
    public readonly height: number,
  ) {
    Asset.fromModule(this.module).downloadAsync();
  }
}

export const ICON_THROUGH_EARPIECE = "speaker-phone";
export const ICON_THROUGH_SPEAKER = "speaker";

export const ICON_PLAY_BUTTON = new Icon(
  require("../assets/images/play_button.png"),
  34,
  51,
);
export const ICON_PAUSE_BUTTON = new Icon(
  require("../assets/images/pause_button.png"),
  34,
  51,
);
export const ICON_STOP_BUTTON = new Icon(
  require("../assets/images/stop_button.png"),
  22,
  22,
);
export const ICON_FORWARD_BUTTON = new Icon(
  require("../assets/images/forward_button.png"),
  33,
  25,
);
export const ICON_BACK_BUTTON = new Icon(
  require("../assets/images/back_button.png"),
  33,
  25,
);

export const ICON_LOOP_ALL_BUTTON = new Icon(
  require("../assets/images/loop_all_button.png"),
  77,
  35,
);
export const ICON_LOOP_ONE_BUTTON = new Icon(
  require("../assets/images/loop_one_button.png"),
  77,
  35,
);

export const ICON_MUTED_BUTTON = new Icon(
  require("../assets/images/muted_button.png"),
  67,
  58,
);
export const ICON_UNMUTED_BUTTON = new Icon(
  require("../assets/images/unmuted_button.png"),
  67,
  58,
);

export const ICON_TRACK_1 = new Icon(
  require("../assets/images/track_1.png"),
  166,
  5,
);
export const ICON_THUMB_1 = new Icon(
  require("../assets/images/thumb_1.png"),
  18,
  19,
);
export const ICON_THUMB_2 = new Icon(
  require("../assets/images/thumb_2.png"),
  15,
  19,
);
