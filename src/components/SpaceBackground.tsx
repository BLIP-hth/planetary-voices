import './SpaceBackground.css'

export function SpaceBackground() {
  return (
    <div className="space-bg" aria-hidden="true">
      <div className="space-bg__stars space-bg__stars--far" />
      <div className="space-bg__stars space-bg__stars--near" />
      <div className="space-bg__shooting">
        <span className="shoot shoot--1" />
        <span className="shoot shoot--2" />
        <span className="shoot shoot--3" />
      </div>
      <div className="space-bg__vignette" />
      {/* ambient "exhibit room" glow in the selected planet's color */}
      <div className="space-bg__tint" />
      <div className="space-bg__grain" />
    </div>
  )
}
