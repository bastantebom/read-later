import { ArticleCard } from "@/components/article-card";
import {
  useAddReadLaterItem,
  useArticles,
  useReadLater,
  useRemoveReadLaterItem,
} from "@/hooks/read-later";
import { useState } from "react";
import {
  ActivityIndicator,
  FlatList,
  StyleSheet,
  Text,
  View,
} from "react-native";

export default function HomeScreen() {
  const { data, isLoading, error, refetch: refetchArticles } = useArticles();
  const { data: readLaterData, refetch: refetchReadLater } = useReadLater();

  const addReadLater = useAddReadLaterItem();
  const removeReadLater = useRemoveReadLaterItem();
  const [refreshing, setRefreshing] = useState(false);

  const onRefresh = async () => {
    if (refreshing) return;
    setRefreshing(true);
    try {
      await Promise.allSettled([refetchArticles(), refetchReadLater()]);
    } finally {
      setRefreshing(false);
    }
  };

  if (isLoading) {
    return <ActivityIndicator />;
  }

  if (error) {
    return <Text>Failed to load articles</Text>;
  }

  return (
    <FlatList
      refreshing={refreshing}
      onRefresh={onRefresh}
      alwaysBounceVertical
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
            isSaved={isSaved}
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
    marginTop: 50,
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
