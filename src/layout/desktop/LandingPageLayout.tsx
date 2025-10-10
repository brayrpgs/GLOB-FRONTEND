interface LandingPageLayoutProps {
  children?: React.ReactNode
}
const LandingPageLayout: React.FC<LandingPageLayoutProps> = ({ children }: LandingPageLayoutProps) => {
  return (
    <div>
      {children}
    </div>
  )
}

export { LandingPageLayout }
