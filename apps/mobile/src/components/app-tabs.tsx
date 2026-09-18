import { NativeTabs } from "expo-router/unstable-native-tabs";
import { useColorScheme } from "react-native";

import { Colors } from "@/constants/theme";

export default function AppTabs() {
  const scheme = useColorScheme();
  const colors = Colors[scheme === "unspecified" ? "light" : scheme];

  return (
    <NativeTabs
      backgroundColor={colors.background}
      indicatorColor={colors.backgroundElement}
      labelStyle={{ selected: { color: colors.text } }}
    >
      <NativeTabs.Trigger name="index">
        <NativeTabs.Trigger.Label>Articles</NativeTabs.Trigger.Label>
        <NativeTabs.Trigger.Icon
          sf={{ default: "house", selected: "house.fill" }}
          md={{ default: "home", selected: "home_filled" }}
        />
      </NativeTabs.Trigger>

      <NativeTabs.Trigger name="read-later">
        <NativeTabs.Trigger.Label>Read Later</NativeTabs.Trigger.Label>
        <NativeTabs.Trigger.Icon
          sf={{ default: "bookmark", selected: "bookmark.fill" }}
          md={{ default: "bookmark_border", selected: "bookmark" }}
        />
      </NativeTabs.Trigger>
    </NativeTabs>
  );
}
