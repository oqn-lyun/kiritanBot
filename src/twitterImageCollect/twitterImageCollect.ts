import Twitter from "twitter";
import { Status, MediaEntity } from "twitter-d";
import { isFullUser } from "../Utils";
import { sendMessage } from "../bot/kiritanbot";
import { getTwitterKeys } from "../twitterKeys";
sendMessage;

const getVideoUrl = (media: MediaEntity): string | undefined => {
  if (!media.video_info?.variants) {
    return undefined;
  }
  let url;
  let bitrate = 0;
  for (const e of media.video_info.variants) {
    if (e.content_type === "video/mp4" && e.bitrate && bitrate < e.bitrate) {
      url = e.url;
      bitrate = e.bitrate;
    }
  }
  return url;
};

const getUserFavorite = async (): Promise<void> => {
  const twitterKeys = getTwitterKeys();
  const path = "favorites/list.json";
  const screenName = "oqn_like_lily";
  const client = new Twitter(twitterKeys);
  let allFavTweet: Status[] = [];
  for (const i of Array.from({ length: 100 }, (_, i) => i)) {
    const favList = <Status[]>await client.get(path, {
      screen_name: screenName,
      page: i + 1,
      count: 200,
      include_entities: 1,
      tweet_mode: "extended",
    });
    allFavTweet = allFavTweet.concat(favList);
  }

  let image_num = 0;
  let video_num = 0;
  for (const tw of allFavTweet) {
    if (!tw.extended_entities?.media || !isFullUser(tw.user)) {
      continue;
    }
    for (const media of tw.extended_entities.media) {
      if (media.type === "photo") {
        console.log(media.media_url);

        image_num++;
      } else if (media.type === "video" || media.type === "animated_gif") {
        const url = getVideoUrl(media);
        if (!url) {
          continue;
        }
        console.log(url);
        video_num++;
      }
    }
  }

  console.log(image_num);
  console.log(video_num);
};

const main = async (): Promise<void> => {
  await getUserFavorite();
};

main().catch((error) => {
  console.log(error);
});
