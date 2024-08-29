# LingoCafe.app

## Bus Events

### credits.update

Thrown by `Apollo.client.creditsLink` when intercepting an operation that is known to affect the credits balance.

Used by the `AppMobile.TopBar.CreditsBalance` to refetch the current balance.

### paywall.require

Thrown by `Apollo.client.onError` when intercepting an insufficient credits error.

Used by the `AppShared.PaywallScreen` to popup.

### publication:archive

Thrown by `PublicationScreen` after the publication is correctly archived.

Used by `ReadScreen` to build a local state and hide the archived publication without reloading the data.
