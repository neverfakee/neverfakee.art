export function CosmicBackdrop() {
  return (
    <div className="cosmic-backdrop" aria-hidden="true">
      <div className="cosmic-backdrop__stars" />
      <div className="cosmic-backdrop__haze" />
      <div className="cosmic-backdrop__streaks cosmic-backdrop__streaks--near" />
      <div className="cosmic-backdrop__streaks cosmic-backdrop__streaks--far" />
    </div>
  )
}
