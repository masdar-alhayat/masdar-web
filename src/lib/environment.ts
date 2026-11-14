/** True for staging deployments (e.g. staging.masdarksa.cloud), which must not be indexed by search engines. */
export function isStagingHost(host: string | null | undefined): boolean {
  return Boolean(host && /(^|[.-])staging([.-]|$)/i.test(host));
}
