import { Ionicons } from "@expo/vector-icons";
import { Image, Pressable, StyleSheet, Text, View } from "react-native";

import type { Article } from "shared-core";

type ArticleCardProps = {
  article: Article;
  isSaved: boolean;
  disabled: boolean;
  onBookmarkPress: () => void;
};

export function ArticleCard({
  article,
  isSaved,
  disabled,
  onBookmarkPress,
}: ArticleCardProps) {
  return (
    <View style={styles.card}>
      <Image source={{ uri: article.imageUrl }} style={styles.image} />

      <View style={styles.content}>
        <View style={styles.cardHeader}>
          <Text style={styles.section}>{article.section}</Text>

          <Pressable
            hitSlop={10}
            onPress={onBookmarkPress}
            disabled={disabled}
          >
            <Ionicons
              name={isSaved ? "bookmark" : "bookmark-outline"}
              size={22}
            />
          </Pressable>
        </View>

        <Text style={styles.title}>{article.title}</Text>

        <Text style={styles.summary} numberOfLines={3}>
          {article.summary}
        </Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    flexDirection: "row",
    padding: 12,
    borderWidth: 1,
    borderColor: "#ddd",
    borderRadius: 8,
    backgroundColor: "#fff",
    gap: 12,
  },

  image: {
    width: 110,
    height: 110,
    borderRadius: 6,
  },

  content: {
    flex: 1,
    gap: 6,
  },

  cardHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },

  section: {
    fontSize: 12,
    fontWeight: "600",
    textTransform: "uppercase",
  },

  title: {
    fontSize: 17,
    fontWeight: "700",
  },

  summary: {
    fontSize: 14,
    lineHeight: 19,
  },
});
