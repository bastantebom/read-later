import {
  useAddReadLaterItem,
  useArticles,
  useReadLater,
  useRemoveReadLaterItem,
} from "@/hooks/read-later";
import {
  ActivityIndicator,
  FlatList,
  Text,
  View,
  StyleSheet,
  Image,
  Pressable,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { ArticleCard } from "@/components/article-card";

export default function HomeScreen() {
  const { data, isLoading, error } = useArticles();
  const { data: readLaterData } = useReadLater();

  const addReadLater = useAddReadLaterItem();
  const removeReadLater = useRemoveReadLaterItem();

  if (isLoading) {
    return <ActivityIndicator />;
  }

  if (error) {
    return <Text>Failed to load articles</Text>;
  }

  return (
    <FlatList
      data={data?.items ?? []}
      keyExtractor={(article) => article.id}
      contentContainerStyle={styles.list}
      ListHeaderComponent={
        <View style={styles.header}>
          <Text style={styles.headerTitle}>Latest Articles</Text>
        </View>
      }
      renderItem={({ item }) => {
        const isSaved =
          readLaterData?.items.some(
            (savedItem) => savedItem.articleId === item.id,
          ) ?? false;
        return (
          <ArticleCard
            article={item}
            isSaved={true}
            onBookmarkPress={() => {
              if (isSaved) {
                removeReadLater.mutate(item.id);
              } else {
                addReadLater.mutate(item.id);
              }
            }}
          />
        );
      }}
    />
  );
}

const styles = StyleSheet.create({
  list: {
    padding: 16,
    gap: 16,
  },

  header: {
    marginBottom: 8,
  },

  headerTitle: {
    fontSize: 28,
    fontWeight: "700",
  },

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
