"use client";

import { useEffect, useState } from "react";
import {
  MapPin,
  Link2,
  Building2,
  Users,
  BookMarked,
  CalendarDays,
  ExternalLink,
  RefreshCw,
  Activity,
} from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";

const USERNAME = "sayid2kx";
const API_URL = `https://api.github.com/users/${USERNAME}`;
const PROFILE_URL = `https://github.com/${USERNAME}`;

type GitHubUser = {
  login: string;
  name: string | null;
  avatar_url: string;
  bio: string | null;
  location: string | null;
  company: string | null;
  blog: string | null;
  html_url: string;
  public_repos: number;
  followers: number;
  following: number;
  created_at: string;
  updated_at: string;
};

// Snapshot fallback (verified 2026-09-07) so the section never looks empty
// if the API is rate-limited (60 req/hr unauthenticated) or offline.
const FALLBACK_USER: GitHubUser = {
  login: "sayid2kx",
  name: "Sarowar Jahan Sayid",
  avatar_url: "https://avatars.githubusercontent.com/u/95705800?v=4",
  bio: "CS Graduate → Hardware Business Owner",
  location: "Bangladesh",
  company: "Self Employed",
  blog: "https://sayid2kx.github.io/",
  html_url: PROFILE_URL,
  public_repos: 9,
  followers: 13,
  following: 72,
  created_at: "2021-12-07T16:28:17Z",
  updated_at: "2026-08-28T03:04:07Z",
};

function GitHubMark({ className = "h-3.5 w-3.5" }: { className?: string }) {
  return (
    <svg
      className={className}
      width="16"
      height="16"
      fill="currentColor"
      viewBox="0 0 24 24"
      aria-hidden="true"
    >
      <path d="M12 .297c-6.63 0-12 5.373-12 12 0 5.303 3.438 9.8 8.205 11.385.6.113.82-.258.82-.577 0-.285-.01-1.04-.015-2.04-3.338.724-4.042-1.61-4.042-1.61C4.422 18.07 3.633 17.7 3.633 17.7c-1.087-.744.084-.729.084-.729 1.205.084 1.838 1.236 1.838 1.236 1.07 1.835 2.809 1.305 3.495.998.108-.776.417-1.305.76-1.605-2.665-.3-5.466-1.332-5.466-5.93 0-1.31.465-2.38 1.235-3.22-.135-.303-.54-1.523.105-3.176 0 0 1.005-.322 3.3 1.23.96-.267 1.98-.399 3-.405 1.02.006 2.04.138 3 .405 2.28-1.552 3.285-1.23 3.285-1.23.645 1.653.24 2.873.12 3.176.765.84 1.23 1.91 1.23 3.22 0 4.61-2.805 5.625-5.475 5.92.42.36.81 1.096.81 2.22 0 1.606-.015 2.896-.015 3.286 0 .315.21.69.825.57C20.565 22.092 24 17.592 24 12.297c0-6.627-5.373-12-12-12" />
    </svg>
  );
}

function formatDate(iso: string) {
  try {
    return new Date(iso).toLocaleDateString("en-US", {
      month: "short",
      year: "numeric",
    });
  } catch {
    return iso;
  }
}

export function GitHubProfile({
  onHover,
}: {
  onHover?: (hovering: boolean) => void;
}) {
  const [user, setUser] = useState<GitHubUser | null>(null);
  const [loading, setLoading] = useState(true);
  const [live, setLive] = useState(false);
  const [error, setError] = useState(false);
  const [retryKey, setRetryKey] = useState(0);
  const [chartError, setChartError] = useState(false);

  useEffect(() => {
    const ctrl = new AbortController();
    setLoading(true);
    setError(false);

    fetch(API_URL, { signal: ctrl.signal, cache: "force-cache" })
      .then((res) => {
        if (!res.ok) throw new Error(`GitHub API: ${res.status}`);
        return res.json();
      })
      .then((data: GitHubUser) => {
        setUser(data);
        setLive(true);
        setLoading(false);
      })
      .catch((err) => {
        if (err?.name === "AbortError") return;
        // Graceful fallback — never leave the section empty on static export.
        setUser(FALLBACK_USER);
        setLive(false);
        setError(true);
        setLoading(false);
      });

    return () => ctrl.abort();
  }, [retryKey]);

  const display = user ?? FALLBACK_USER;
  const memberSince = formatDate(display.created_at);

  return (
    <Card className="rounded-[20px] border shadow-sm sm:rounded-[24px]">
      <CardContent className="p-4 sm:p-6 md:p-8">
        <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
          <h2 className="font-heading text-[clamp(1.6rem,3vw,2.2rem)] tracking-tight">
            On GitHub
          </h2>
          <div className="flex flex-wrap items-center gap-2">
            <Badge className="self-start rounded-full gap-1.5 sm:self-auto">
              <GitHubMark className="h-3 w-3" /> @{USERNAME}
            </Badge>
            <Badge
              variant={live && !loading ? "secondary" : "outline"}
              className="rounded-full gap-1.5 font-mono text-[11px]"
            >
              <span
                className={`h-1.5 w-1.5 rounded-full ${
                  loading
                    ? "animate-pulse bg-muted-foreground"
                    : live
                      ? "bg-green-500"
                      : "bg-amber-500"
                }`}
              />
              {loading ? "Syncing…" : live ? "Live" : "Cached"}
            </Badge>
          </div>
        </div>
        <Separator className="my-6" />

        {loading && !user ? (
          <div
            aria-label="Loading GitHub profile"
            aria-busy="true"
            className="grid gap-4 md:grid-cols-[0.9fr_1.6fr]"
          >
            <div className="flex items-center gap-4 rounded-2xl border bg-card p-5">
              <div className="h-16 w-16 shrink-0 animate-pulse rounded-full bg-muted sm:h-20 sm:w-20" />
              <div className="flex-1 space-y-2">
                <div className="h-4 w-2/3 animate-pulse rounded bg-muted" />
                <div className="h-3 w-1/3 animate-pulse rounded bg-muted" />
                <div className="h-3 w-full animate-pulse rounded bg-muted" />
              </div>
            </div>
            <div className="grid grid-cols-3 gap-3">
              {[0, 1, 2].map((i) => (
                <div
                  key={i}
                  className="grid animate-pulse place-items-center rounded-2xl border p-5"
                >
                  <div className="h-6 w-10 rounded bg-muted" />
                  <div className="mt-2 h-3 w-14 rounded bg-muted" />
                </div>
              ))}
            </div>
          </div>
        ) : (
          <div className="grid gap-4 md:grid-cols-[0.9fr_1.6fr]">
            {/* Profile card */}
            <div
              onMouseEnter={() => onHover?.(true)}
              onMouseLeave={() => onHover?.(false)}
              className="flex items-center gap-4 rounded-2xl border bg-card p-5 shadow-sm transition-all hover:-translate-y-0.5 hover:shadow-md"
            >
              <img
                src={display.avatar_url}
                alt={`${display.name ?? display.login} GitHub avatar`}
                width={80}
                height={80}
                loading="lazy"
                className="h-16 w-16 shrink-0 rounded-full border object-cover shadow-sm sm:h-20 sm:w-20"
              />
              <div className="min-w-0 flex-1">
                <h3 className="font-heading truncate text-lg leading-tight">
                  {display.name ?? display.login}
                </h3>
                <p className="font-mono text-xs text-muted-foreground">
                  @{display.login}
                </p>
                {display.bio && (
                  <p className="mt-1 line-clamp-2 text-sm leading-6 text-muted-foreground">
                    {display.bio}
                  </p>
                )}
                <div className="mt-2 flex flex-wrap gap-x-3 gap-y-1 text-xs text-muted-foreground">
                  {display.location && (
                    <span className="inline-flex items-center gap-1">
                      <MapPin className="h-3 w-3" /> {display.location}
                    </span>
                  )}
                  {display.company && (
                    <span className="inline-flex items-center gap-1">
                      <Building2 className="h-3 w-3" /> {display.company}
                    </span>
                  )}
                </div>
                <a
                  href={display.html_url}
                  target="_blank"
                  rel="noopener noreferrer"
                  onMouseEnter={() => onHover?.(true)}
                  onMouseLeave={() => onHover?.(false)}
                  className="mt-3 inline-flex h-8 items-center gap-1.5 rounded-full bg-primary px-4 text-xs font-medium text-primary-foreground transition-colors hover:bg-primary/90"
                >
                  <GitHubMark className="h-3.5 w-3.5" /> View Profile{" "}
                  <ExternalLink className="h-3 w-3" />
                </a>
              </div>
            </div>

            {/* Stats */}
            <div className="flex flex-col gap-3">
              <div className="grid grid-cols-3 gap-3">
                <div className="grid place-items-center rounded-2xl border bg-card p-4 text-center shadow-sm sm:p-5">
                  <BookMarked className="h-4 w-4 text-primary" />
                  <div className="mt-1 text-2xl font-bold tracking-tight sm:text-3xl">
                    {display.public_repos}
                  </div>
                  <div className="mt-1 font-mono text-[10px] font-semibold tracking-widest uppercase opacity-60">
                    Repos
                  </div>
                </div>
                <div className="grid place-items-center rounded-2xl border bg-card p-4 text-center shadow-sm sm:p-5">
                  <Users className="h-4 w-4 text-primary" />
                  <div className="mt-1 text-2xl font-bold tracking-tight sm:text-3xl">
                    {display.followers}
                  </div>
                  <div className="mt-1 font-mono text-[10px] font-semibold tracking-widest uppercase opacity-60">
                    Followers
                  </div>
                </div>
                <div className="grid place-items-center rounded-2xl border bg-card p-4 text-center shadow-sm sm:p-5">
                  <Users className="h-4 w-4 text-primary" />
                  <div className="mt-1 text-2xl font-bold tracking-tight sm:text-3xl">
                    {display.following}
                  </div>
                  <div className="mt-1 font-mono text-[10px] font-semibold tracking-widest uppercase opacity-60">
                    Following
                  </div>
                </div>
              </div>

              <div className="flex flex-wrap items-center gap-2 text-xs text-muted-foreground">
                <Badge variant="secondary" className="rounded-full gap-1">
                  <CalendarDays className="h-3 w-3" /> Since {memberSince}
                </Badge>
                {display.blog && (
                  <a
                    href={
                      display.blog.startsWith("http")
                        ? display.blog
                        : `https://${display.blog}`
                    }
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-1 font-medium hover:text-primary transition-colors"
                  >
                    <Link2 className="h-3 w-3" />
                    <span className="max-w-[220px] truncate">
                      {display.blog.replace(/^https?:\/\//, "")}
                    </span>
                  </a>
                )}
                {error ? (
                  <span className="inline-flex items-center gap-2">
                    <span>Showing cached info.</span>
                    <button
                      onClick={() => setRetryKey((k) => k + 1)}
                      className="inline-flex items-center gap-1 font-medium text-primary hover:underline"
                    >
                      <RefreshCw className="h-3 w-3" /> Retry live
                    </button>
                  </span>
                ) : (
                  <span>Updated {formatDate(display.updated_at)}</span>
                )}
              </div>
            </div>
          </div>
        )}

        {/* Contribution graph — rendered from public contributions chart,
            works with static export (plain <img>, no API token needed). */}
        {!chartError && (
          <div
            onMouseEnter={() => onHover?.(true)}
            onMouseLeave={() => onHover?.(false)}
            className="mt-4 rounded-2xl border bg-card p-4 shadow-sm transition-all hover:-translate-y-0.5 hover:shadow-md sm:p-5"
          >
            <div className="flex flex-wrap items-center justify-between gap-2">
              <div className="flex items-center gap-2">
                <div className="grid h-8 w-8 place-items-center rounded-lg border bg-[var(--accent)]/15 text-primary">
                  <Activity className="h-4 w-4" />
                </div>
                <h3 className="font-heading text-base">Contributions</h3>
                <Badge variant="secondary" className="rounded-full font-mono text-[11px]">
                  last 12 months
                </Badge>
              </div>
              <a
                href={`${PROFILE_URL}?tab=overview&from=${new Date().getFullYear() - 1}-09-01&to=${new Date().getFullYear()}-09-01`}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-1 text-xs font-medium text-muted-foreground hover:text-primary transition-colors"
              >
                @{USERNAME} <ExternalLink className="h-3 w-3" />
              </a>
            </div>
            <div className="mt-3 overflow-x-auto rounded-xl border bg-background/60 p-3">
              <img
                src={`https://ghchart.rshah.org/${USERNAME}`}
                alt={`GitHub contribution graph for ${USERNAME}`}
                loading="lazy"
                onError={() => setChartError(true)}
                className="h-auto w-full min-w-[640px] object-contain"
              />
            </div>
            <p className="mt-2 text-xs text-muted-foreground">
              Daily public contributions. Click through to see the full activity
              on GitHub.
            </p>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
