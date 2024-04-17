import { useState } from "react";
import { FlatList, Image, Platform, Pressable, StyleSheet } from "react-native";

import EMOJI1 from "../assets/images/emoji1.png";
import EMOJI2 from "../assets/images/emoji2.png";
import EMOJI3 from "../assets/images/emoji3.png";
import EMOJI4 from "../assets/images/emoji4.png";
import EMOJI5 from "../assets/images/emoji5.png";

export default function EmojiList({ onSelect, onCloseModal }) {
  const [emoji] = useState([EMOJI1, EMOJI2, EMOJI3, EMOJI4, EMOJI5]);

  return (
    <FlatList
      horizontal
      showsHorizontalScrollIndicator={Platform.OS === "web"}
      data={emoji}
      contentContainerStyle={styles.listContainer}
      renderItem={({ item, index }) => (
        <Pressable
          onPress={() => {
            onSelect(item);
            onCloseModal();
          }}
        >
          <Image source={item} key={index} style={styles.image} />
        </Pressable>
      )}
    />
  );
}

const styles = StyleSheet.create({
  listContainer: {
    borderTopRightRadius: 10,
    borderTopLeftRadius: 10,
    paddingHorizontal: 20,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  image: {
    width: 100,
    height: 100,
    marginRight: 20,
  },
});
