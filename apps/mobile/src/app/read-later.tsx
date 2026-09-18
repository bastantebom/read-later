import { Ionicons } from "@expo/vector-icons";
import { useState } from "react";
import {
  ActivityIndicator,
  Button,
  Alert,
  FlatList,
  StyleSheet,
  Text,
  View,
} from "react-native";

import { ArticleCard } from "@/components/article-card";
import {
  useArticles,
  useReadLater,
  useReadLaterBusy,
  useRemoveReadLaterItem,
} from "@/hooks/read-later";

export default function ReadLaterScreen() {
  const {
    data: articlesData,
    isLoading: isArticlesLoading,
    isError: isArticlesError,
    refetch: refetchArticles,
  } = useArticles();
  const {
    data: readLaterData,
    isLoading: isReadLaterLoading,
    refetch: refetchReadLater,
    isError: isReadLaterError,
    isPending: isReadLaterPending,
  } = useReadLater();

  const removeReadLater = useRemoveReadLaterItem();
  const busy = useReadLaterBusy();
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

  const savedIds = new Set(
    readLaterData?.items.map((item) => item.articleId) ?? [],
  );

  const savedArticles =
    articlesData?.items.filter((article) => savedIds.has(article.id)) ?? [];

  if (isArticlesLoading || isReadLaterLoading) {
    return (
      <View style={styles.center}>
        <ActivityIndicator />
      </View>
    );
  }

  if (isArticlesError || isReadLaterError) {
    return <View><Text>Failed to load saved articles</Text><Button title="Try again" onPress={onRefresh} /></View>;
  }

  return (
    <FlatList
      refreshing={refreshing}
      onRefresh={onRefresh}
      alwaysBounceVertical
      data={savedArticles}
      keyExtractor={(article) => article.id}
      contentContainerStyle={styles.list}
      ListHeaderComponent={
        <View style={styles.header}>
          <Text style={styles.headerTitle}>Read Later</Text>
          <Text style={styles.headerSubtitle}>
            Articles you've saved for later
          </Text>
        </View>
      }
      ListEmptyComponent={
        <View style={styles.empty}>
          <Ionicons name="bookmark-outline" size={36} />

          <Text style={styles.emptyTitle}>Nothing saved yet</Text>

          <Text style={styles.emptyText}>
            Articles you save will appear here.
          </Text>
        </View>
      }
      renderItem={({ item }) => (
        <ArticleCard
          article={item}
          isSaved={true}
          disabled={busy || isReadLaterPending}
          onBookmarkPress={() => {
            removeReadLater.mutate(item.id, {
              onError: () =>
                Alert.alert(
                  "Bookmark update failed",
                  "Couldn't remove this article. Please try again.",
                ),
            });
          }}
        />
      )}
    />
  );
}

const styles = StyleSheet.create({
  list: {
    padding: 16,
    gap: 16,
    flexGrow: 1,
    marginTop: 50,
  },

  header: {
    marginBottom: 8,
  },

  headerTitle: {
    fontSize: 28,
    fontWeight: "700",
  },

  headerSubtitle: {
    fontSize: 15,
    marginTop: 4,
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

  empty: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    gap: 8,
    paddingVertical: 60,
  },

  emptyTitle: {
    fontSize: 18,
    fontWeight: "600",
  },

  emptyText: {
    fontSize: 14,
  },

  center: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
  },
});
