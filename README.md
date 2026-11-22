# Salah

Simple, ad-free prayer times and Hijri calendar. Works offline and installs like an app.

## Features
- Prayer times with next-prayer countdown and iqama times
- Qibla compass
- Hijri calendar with Islamic events, fasting times and voluntary prayers
- Adhan at prayer time (your own sound file; plays while the app is open)
- Printable monthly timetable
- English, Soomaali and العربية
- Light and dark themes

## Install
Open the site in Safari (iPhone) or Chrome (Android), then choose **Add to Home Screen**.

## Setup
In **Settings**, pick your city or tap **Use my location**. Choose the calculation method that your local mosque follows (MWL, Egyptian, Umm al-Qura, ISNA or Karachi). Use **Fine-tune minutes** to match your mosque's timetable exactly.

## Good to know
- The Islamic day starts at Maghrib, so the Hijri date and weekday change then.
- Hijri dates use Umm al-Qura. If your country sees the moon differently, use **Hijri date adjustment** (-1 / +1 day).
- Everything is calculated on your device. No account, no tracking, no data sent anywhere. Settings stay on your phone.

## For developers
Plain HTML, CSS and JavaScript with no build step. After changing `index.html`, bump the version in `sw.js` (for example `salah-v2` to `salah-v3`) so installed copies update.

## Adhan sound
The app does not ship with an adhan recording. Either put your own file at `audio/adhan.mp3` (it is cached for offline use), or let each person tap **Choose adhan sound** in Tools and pick a file from their phone. Only use recordings you have the right to use.
