import React from 'react'

import { ContentContainer, FooterContainer, GradientOverlay, PageMain } from './elements'
import PrivacyLink from '@components/privacy-link'

export interface JokePageLayoutProps {
  children: React.ReactNode
}

const JokePageLayout = ({ children }: JokePageLayoutProps): React.ReactNode => (
  <PageMain>
    <GradientOverlay />
    <ContentContainer>{children}</ContentContainer>
    <FooterContainer>
      <PrivacyLink />
    </FooterContainer>
  </PageMain>
)

export default JokePageLayout
