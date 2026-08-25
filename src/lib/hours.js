/*
 * Opening-hours logic, in Europe/Amsterdam.
 *
 * Deliberately dependency-free and side-effect-free: this module is imported by
 * .astro components at build time AND bundled into the one client script that
 * recomputes the live status in the visitor's browser. Nothing here touches the
 * DOM or reads globals other than Intl.
 */

export const TZ = 'Europe/Amsterdam';

/** Week order for display: the Dutch week starts on Monday. */
export const DAY_KEYS = ['mon', 'tue', 'wed', 'thu', 'fri', 'sat', 'sun'];

const WEEKDAY_FROM_EN = {
	Mon: 'mon',
	Tue: 'tue',
	Wed: 'wed',
	Thu: 'thu',
	Fri: 'fri',
	Sat: 'sat',
	Sun: 'sun',
};

/** Day abbreviations, lowercase per section 3 of the design language. */
export const DAY_LABELS = {
	nl: { mon: 'ma', tue: 'di', wed: 'wo', thu: 'do', fri: 'vr', sat: 'za', sun: 'zo' },
	en: { mon: 'mon', tue: 'tue', wed: 'wed', thu: 'thu', fri: 'fri', sat: 'sat', sun: 'sun' },
};

/** schema.org day names, for openingHoursSpecification. */
export const SCHEMA_DAYS = {
	mon: 'Monday',
	tue: 'Tuesday',
	wed: 'Wednesday',
	thu: 'Thursday',
	fri: 'Friday',
	sat: 'Saturday',
	sun: 'Sunday',
};

export function toMinutes(hhmm) {
	const [h, m] = String(hhmm).split(':').map(Number);
	return h * 60 + m;
}

/**
 * The wall clock in Amsterdam, whatever the visitor's own timezone is.
 * Returns the calendar date, the day key and minutes since midnight.
 */
export function zonedNow(now = new Date(), timeZone = TZ) {
	const parts = {};
	const formatter = new Intl.DateTimeFormat('en-US', {
		timeZone,
		hourCycle: 'h23',
		weekday: 'short',
		year: 'numeric',
		month: '2-digit',
		day: '2-digit',
		hour: '2-digit',
		minute: '2-digit',
	});
	for (const part of formatter.formatToParts(now)) parts[part.type] = part.value;
	const hour = Number(parts.hour) % 24;
	return {
		date: `${parts.year}-${parts.month}-${parts.day}`,
		dayKey: WEEKDAY_FROM_EN[parts.weekday],
		minutes: hour * 60 + Number(parts.minute),
	};
}

/** Calendar arithmetic on a YYYY-MM-DD string plus its day key. */
export function addDays(date, dayKey, days) {
	const [y, m, d] = date.split('-').map(Number);
	const shifted = new Date(Date.UTC(y, m - 1, d + days));
	const iso = shifted.toISOString().slice(0, 10);
	const index = (DAY_KEYS.indexOf(dayKey) + days) % 7;
	return { date: iso, dayKey: DAY_KEYS[(index + 7) % 7] };
}

/** Ranges that apply on one date: an exception wins over the regular week. */
export function rangesFor(hours, date, dayKey) {
	const exception = (hours.exceptions ?? []).find((item) => item.date === date);
	if (exception) return { ranges: exception.hours ?? [], exception };
	return { ranges: hours.regular?.[dayKey] ?? [], exception: null };
}

const byStart = (a, b) => toMinutes(a[0]) - toMinutes(b[0]);

/**
 * Open or closed, right now.
 *
 * `key` names the string to use from site.status, so the copy stays in JSON:
 *   openUntil   open now, closing at `time`
 *   opensToday  closed, but opening later today at `time`
 *   opensAt     closed, opening tomorrow at `time`
 *   closed      closed, and not open today or tomorrow
 */
export function computeStatus(hours, now = new Date(), timeZone = TZ) {
	const { date, dayKey, minutes } = zonedNow(now, timeZone);
	const today = rangesFor(hours, date, dayKey);

	for (const [from, to] of today.ranges) {
		if (minutes >= toMinutes(from) && minutes < toMinutes(to)) {
			return { open: true, key: 'openUntil', time: to, date, dayKey, exception: today.exception };
		}
	}

	const laterToday = today.ranges.filter(([from]) => toMinutes(from) > minutes).sort(byStart)[0];
	if (laterToday) {
		return {
			open: false,
			key: 'opensToday',
			time: laterToday[0],
			date,
			dayKey,
			exception: today.exception,
		};
	}

	// Look ahead a full week so a day with an empty hours array cannot produce
	// a wrong answer, then give up rather than loop.
	for (let ahead = 1; ahead <= 7; ahead += 1) {
		const next = addDays(date, dayKey, ahead);
		const { ranges } = rangesFor(hours, next.date, next.dayKey);
		if (ranges.length) {
			const opensAt = ranges.slice().sort(byStart)[0][0];
			return {
				open: false,
				key: ahead === 1 ? 'opensAt' : 'closed',
				time: opensAt,
				nextDate: next.date,
				nextDayKey: next.dayKey,
				date,
				dayKey,
				exception: today.exception,
			};
		}
	}

	return { open: false, key: 'closed', time: null, date, dayKey, exception: today.exception };
}

/**
 * Collapse consecutive identical days, so the current data reads
 * "ma-vr 08:30-17:00 / za-zo 09:00-17:00" instead of seven lines.
 */
export function groupedHours(hours) {
	const groups = [];
	for (const dayKey of DAY_KEYS) {
		const ranges = hours.regular?.[dayKey] ?? [];
		const signature = JSON.stringify(ranges);
		const last = groups[groups.length - 1];
		if (last && last.signature === signature) last.days.push(dayKey);
		else groups.push({ signature, days: [dayKey], ranges });
	}
	return groups;
}

export function groupLabel(group, locale) {
	const labels = DAY_LABELS[locale] ?? DAY_LABELS.nl;
	const first = labels[group.days[0]];
	if (group.days.length === 1) return first;
	return `${first}-${labels[group.days[group.days.length - 1]]}`;
}

/** "08:30-17:00", or several ranges joined, or null when the day is closed. */
export function rangeLabel(ranges) {
	if (!ranges.length) return null;
	return ranges.map(([from, to]) => `${from}-${to}`).join(', ');
}
