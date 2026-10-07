#!/bin/bash
set -e

gen_film() {
  in="$1"
  out="$2"
  if [ ! -f "$out" ]; then
    echo "Generating $out from $in"
    ffmpeg -y -loop 1 -i "$in" -vf "scale=1280:720:force_original_aspect_ratio=increase,crop=1280:720,zoompan=z='min(zoom+0.0012,1.15)':d=100:x='iw/2-(iw/zoom/2)':y='ih/2-(ih/zoom/2)':s=1280x720" -c:v libx264 -t 4 -pix_fmt yuv420p -r 24 -preset fast -crf 24 "$out"
  fi
}

gen_reel() {
  in="$1"
  out="$2"
  if [ ! -f "$out" ]; then
    echo "Generating $out from $in"
    ffmpeg -y -loop 1 -i "$in" -vf "scale=720:1280:force_original_aspect_ratio=increase,crop=720:1280,zoompan=z='min(zoom+0.0014,1.18)':d=100:x='iw/2-(iw/zoom/2)':y='ih/2-(ih/zoom/2)':s=720x1280" -c:v libx264 -t 4 -pix_fmt yuv420p -r 24 -preset fast -crf 24 "$out"
  fi
}

# 3 Commercial Films (16:9)
gen_film "public/assets/images/tgg_flower_bouquet_roses_1791323354001.jpg" "public/assets/videos/film_flower_bouquet.mp4"
gen_film "public/assets/images/tgg_hero_floral_luxury_1791323375875.jpg" "public/assets/videos/film_anniversary_romance.mp4"
gen_film "public/assets/images/tgg_custom_gift_basket_1791323363511.jpg" "public/assets/videos/film_custom_basket.mp4"

# 6 Trending Reels (9:16)
gen_reel "public/assets/images/tgg_flower_bouquet_roses_1791323354001.jpg" "public/assets/videos/reel_flower_bouquet.mp4"
gen_reel "public/assets/images/tgg_custom_gift_basket_1791323363511.jpg" "public/assets/videos/reel_custom_basket.mp4"
gen_reel "public/assets/images/tgg_luxury_watch_perfume_box_1790253135569.jpg" "public/assets/videos/reel_watch_perfume.mp4"
gen_reel "public/assets/images/tgg_accessories_jewellery_1791323387866.jpg" "public/assets/videos/reel_bracelets.mp4"
gen_reel "public/assets/images/tgg_hero_floral_luxury_1791323375875.jpg" "public/assets/videos/reel_anniversary.mp4"
gen_reel "public/assets/images/tgg_packaging_boxes_1791323401254.jpg" "public/assets/videos/reel_packaging.mp4"

echo "All videos generated successfully!"
