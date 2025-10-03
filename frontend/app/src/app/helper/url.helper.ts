export class UrlHelper {
  public static getSubOutletTarget(url: string): string[] {
    return [...url.matchAll(/:([^)]*)/g)].map((m) => m[1]);
  }
}
