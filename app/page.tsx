import Home from "./home";

const RELEASE_API = "https://api.github.com/repos/BenchGrid-dev/slate/releases/latest";
const FALLBACK_TAG = "v0.2.1";

async function getLatestReleaseTag(): Promise<string> {
  try {
    const response = await fetch(RELEASE_API, {
      headers: { Accept: "application/vnd.github+json" },
      next: { revalidate: 3600 },
      signal: AbortSignal.timeout(3500),
    });

    if (response.ok) {
      const { tag_name: tag }: { tag_name?: unknown } = await response.json();
      if (typeof tag === "string" && /^v\d+\.\d+\.\d+$/.test(tag)) return tag;
    }
  } catch {
    // Keep the homepage usable when the GitHub API is unavailable.
  }

  return FALLBACK_TAG;
}

export default async function Page() {
  return <Home releaseTag={await getLatestReleaseTag()} />;
}
