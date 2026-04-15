import { useEffect, useState } from 'react';

export interface Duration {
  years: number;
  months: number;
  days: number;
  hours: number;
  minutes: number;
  seconds: number;
  totalSeconds: number;
}

function computeDuration(since: Date, now: Date): Duration {
  if (now < since) {
    return { years: 0, months: 0, days: 0, hours: 0, minutes: 0, seconds: 0, totalSeconds: 0 };
  }

  // Compute calendar-aware years/months/days, then remainder as hh:mm:ss
  let years = now.getFullYear() - since.getFullYear();
  let months = now.getMonth() - since.getMonth();
  let days = now.getDate() - since.getDate();
  let hours = now.getHours() - since.getHours();
  let minutes = now.getMinutes() - since.getMinutes();
  let seconds = now.getSeconds() - since.getSeconds();

  if (seconds < 0) { seconds += 60; minutes -= 1; }
  if (minutes < 0) { minutes += 60; hours -= 1; }
  if (hours < 0) { hours += 24; days -= 1; }
  if (days < 0) {
    const prevMonth = new Date(now.getFullYear(), now.getMonth(), 0);
    days += prevMonth.getDate();
    months -= 1;
  }
  if (months < 0) { months += 12; years -= 1; }

  const totalSeconds = Math.floor((now.getTime() - since.getTime()) / 1000);
  return { years, months, days, hours, minutes, seconds, totalSeconds };
}

export function useRelationshipDuration(sinceISO: string): Duration {
  const since = new Date(sinceISO);
  const [duration, setDuration] = useState<Duration>(() => computeDuration(since, new Date()));

  useEffect(() => {
    const id = window.setInterval(() => {
      setDuration(computeDuration(since, new Date()));
    }, 1000);
    return () => window.clearInterval(id);
  }, [sinceISO]);

  return duration;
}
