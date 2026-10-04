# Scoped React Doctor exceptions

## Carousel API publication

The `setApi(api)` call in `components/ui/carousel/index.tsx` has one line-scoped
exception for `react-doctor/no-pass-data-to-parent`,
`react-doctor/no-pass-live-state-to-parent`, and
`react-doctor/no-prop-callback-in-effect`.

This exception applies only while all of these facts hold:

- `api` comes directly from the third-party `useEmblaCarousel` hook.
- The callback publishes that imperative handle when the handle or recipient changes.
- The carousel owns its DOM ref and external subscriptions. Its scroll availability
  uses `useSyncExternalStore`; it is not copied into parent state by this callback.
- The public `setApi` compatibility callback remains available to consumers.

`components/ui/carousel/__tests__/carousel-api.test.tsx` verifies publication and
that selection changes do not publish mirrored state. Revisit the exception if
API ownership, callback arguments, or notification timing changes.

No rule is disabled globally. The unsuppressed audit should report exactly these
three findings; a normal full scan still covers this file and every other rule.
